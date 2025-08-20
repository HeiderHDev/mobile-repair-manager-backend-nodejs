import { Repository } from 'typeorm';
import { JwtAdapter, bcryptAdapter, envs } from '../../config';
import { UserEntity as UserDB } from '../../data/mysql/entities/user.entity';
import { MySQLDatabase } from '../../data';
import { CustomError, LoginUserDto, RegisterUserDto } from '../../domain';
import { UserEntity } from '../../domain/entities/user.entity';
import { EmailService } from './email.service';

export class AuthService {

  private userRepository: Repository<UserDB>;

  constructor(
    private readonly emailService: EmailService,
  ) {
    this.userRepository = MySQLDatabase.connection.getRepository(UserDB);
  }

  public async registerUser( registerUserDto: RegisterUserDto ) {
    
    const existUserByEmail = await this.userRepository.findOne({ 
      where: { email: registerUserDto.email } 
    });
    if ( existUserByEmail ) throw CustomError.badRequest('Email already exist');

    const existUserByUsername = await this.userRepository.findOne({ 
      where: { username: registerUserDto.username } 
    });
    if ( existUserByUsername ) throw CustomError.badRequest('Username already exist');

    try {
      const userDB = new UserDB();
      userDB.username = registerUserDto.username;
      userDB.email = registerUserDto.email;
      userDB.fullName = registerUserDto.fullName;
      userDB.password = bcryptAdapter.hash( registerUserDto.password );
      userDB.role = registerUserDto.role;
      userDB.isActive = true;

      const savedUser = await this.userRepository.save(userDB);

      await this.sendEmailValidationLink( savedUser.email );

      const userEntity = UserEntity.fromObject(savedUser);
      const publicUserData = userEntity.getPublicData();

      const token = await JwtAdapter.generateToken({ 
        id: savedUser.id,
        username: savedUser.username,
        role: savedUser.role 
      });
      if ( !token ) throw CustomError.internalServer('Error while creating JWT');

      return { 
        user: publicUserData, 
        token: token,
        expiresIn: 86400
      };

    } catch (error) {
      throw CustomError.internalServer(`${ error }`);
    }
  }

  public async loginUser( loginUserDto: LoginUserDto ) {
    const userDB = await this.userRepository.findOne({ 
      where: { username: loginUserDto.username } 
    });
    if (!userDB) throw CustomError.badRequest('Invalid credentials');

    const isMatching = bcryptAdapter.compare( loginUserDto.password, userDB.password );
    if ( !isMatching ) throw CustomError.badRequest('Invalid credentials');

    if ( !userDB.isActive ) throw CustomError.forbidden('User is inactive');

    const userEntity = UserEntity.fromObject(userDB);
    const publicUserData = userEntity.getPublicData();
    
    const token = await JwtAdapter.generateToken({ 
      id: userDB.id,
      username: userDB.username,
      role: userDB.role 
    });
    if ( !token ) throw CustomError.internalServer('Error while creating JWT');

    return {
      user: publicUserData,
      token: token,
      expiresIn: 86400
    }
  }

  private sendEmailValidationLink = async( email: string ) => {
    const token = await JwtAdapter.generateToken({ email });
    if ( !token ) throw CustomError.internalServer('Error getting token');

    const link = `${ envs.WEBSERVICE_URL }/auth/validate-email/${ token }`;
    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${ link }">Validate your email: ${ email }</a>
    `;

    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html,
    }

    const isSent = await this.emailService.sendEmail(options);
    if ( !isSent ) throw CustomError.internalServer('Error sending email');

    return true;
  }

  public validateEmail = async(token:string) => {
    const payload = await JwtAdapter.validateToken(token);
    if ( !payload ) throw CustomError.unauthorized('Invalid token');

    const { email } = payload as { email: string };
    if ( !email ) throw CustomError.internalServer('Email not in token');

    const userDB = await this.userRepository.findOne({ where: { email } });
    if ( !userDB ) throw CustomError.internalServer('Email not exists');

    return true;
  }
}