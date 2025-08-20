import { Repository } from 'typeorm';
import { UserEntity as UserDB, UserRole } from '../../data/mysql/entities/user.entity';
import { MySQLDatabase } from '../../data';
import { CustomError } from '../../domain';
import { UserEntity } from '../../domain/entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../../domain';
import { bcryptAdapter } from '../../config';

export class UserService {

  private userRepository: Repository<UserDB>;

  constructor() {
    this.userRepository = MySQLDatabase.connection.getRepository(UserDB);
  }

  async createUser( createUserDto: CreateUserDto, currentUser: UserEntity ) {

    if ( !currentUser.canCreateUsers() ) {
      throw CustomError.forbidden('You do not have permission to create users');
    }

    const existUserByEmail = await this.userRepository.findOne({ 
      where: { email: createUserDto.email } 
    });
    if ( existUserByEmail ) throw CustomError.badRequest('Email already exists');

    const existUserByUsername = await this.userRepository.findOne({ 
      where: { username: createUserDto.username } 
    });
    if ( existUserByUsername ) throw CustomError.badRequest('Username already exists');

    try {
      const userDB = new UserDB();
      userDB.username = createUserDto.username;
      userDB.email = createUserDto.email;
      userDB.fullName = createUserDto.fullName;
      userDB.password = bcryptAdapter.hash( createUserDto.password );
      userDB.role = createUserDto.role;
      userDB.isActive = true;

      const savedUser = await this.userRepository.save(userDB);

      const userEntity = UserEntity.fromObject(savedUser);
      return userEntity.getPublicData();

    } catch (error) {
      throw CustomError.internalServer(`${ error }`);
    }
  }

  async getUsers( currentUser: UserEntity ) {

    if ( !currentUser.canManageUsers() ) {
      throw CustomError.forbidden('You do not have permission to view users');
    }

    try {
      const users = await this.userRepository.find({
        order: { createdAt: 'DESC' }
      });

      return users.map(user => {
        const userEntity = UserEntity.fromObject(user);
        return userEntity.getPublicData();
      });

    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async getUserById( id: string, currentUser: UserEntity ) {

    if ( !currentUser.canManageUsers() && currentUser.id !== id ) {
      throw CustomError.forbidden('You do not have permission to view this user');
    }

    try {
      const userDB = await this.userRepository.findOne({ where: { id } });
      if ( !userDB ) throw CustomError.notFound('User not found');

      const userEntity = UserEntity.fromObject(userDB);
      return userEntity.getPublicData();

    } catch (error) {
      if ( error instanceof CustomError ) throw error;
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async updateUser( updateUserDto: UpdateUserDto, currentUser: UserEntity ) {

    const { id, ...updateData } = updateUserDto;
    if ( !currentUser.canManageUsers() && currentUser.id !== id ) {
      throw CustomError.forbidden('You do not have permission to update this user');
    }

    try {
      const userDB = await this.userRepository.findOne({ where: { id } });
      if ( !userDB ) throw CustomError.notFound('User not found');

      if ( userDB.role === UserRole.SUPER_ADMIN && updateData.role && updateData.role !== UserRole.SUPER_ADMIN ) {
        throw CustomError.forbidden('Cannot change Super Admin role');
      }
      if ( updateData.role && !currentUser.canManageUsers() ) {
        throw CustomError.forbidden('You do not have permission to change user roles');
      }

      if ( updateData.email && updateData.email !== userDB.email ) {
        const existUser = await this.userRepository.findOne({ where: { email: updateData.email } });
        if ( existUser ) throw CustomError.badRequest('Email already exists');
      }

      if ( updateData.username && updateData.username !== userDB.username ) {
        const existUser = await this.userRepository.findOne({ where: { username: updateData.username } });
        if ( existUser ) throw CustomError.badRequest('Username already exists');
      }

      Object.assign(userDB, updateData);
      const updatedUser = await this.userRepository.save(userDB);

      const userEntity = UserEntity.fromObject(updatedUser);
      return userEntity.getPublicData();

    } catch (error) {
      if ( error instanceof CustomError ) throw error;
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async toggleUserStatus( id: string, currentUser: UserEntity ) {

    if ( !currentUser.canManageUsers() ) {
      throw CustomError.forbidden('You do not have permission to change user status');
    }

    try {
      const userDB = await this.userRepository.findOne({ where: { id } });
      if ( !userDB ) throw CustomError.notFound('User not found');

      if ( userDB.role === UserRole.SUPER_ADMIN ) {
        throw CustomError.forbidden('Cannot change Super Admin status');
      }

      userDB.isActive = !userDB.isActive;
      const updatedUser = await this.userRepository.save(userDB);

      const userEntity = UserEntity.fromObject(updatedUser);
      return userEntity.getPublicData();

    } catch (error) {
      if ( error instanceof CustomError ) throw error;
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async deleteUser( id: string, currentUser: UserEntity ) {

    if ( !currentUser.canManageUsers() ) {
      throw CustomError.forbidden('You do not have permission to delete users');
    }

    try {
      const userDB = await this.userRepository.findOne({ where: { id } });
      if ( !userDB ) throw CustomError.notFound('User not found');

      if ( userDB.role === UserRole.SUPER_ADMIN ) {
        throw CustomError.forbidden('Cannot delete Super Admin');
      }
      if ( userDB.isActive ) {
        throw CustomError.badRequest('Cannot delete active user. Deactivate first.');
      }

      await this.userRepository.remove(userDB);
      return true;

    } catch (error) {
      if ( error instanceof CustomError ) throw error;
      throw CustomError.internalServer('Internal Server Error');
    }
  }
}