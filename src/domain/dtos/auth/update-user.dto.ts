import { regularExps } from '../../../config';
import { UserRole } from '../../entities/user.entity';

export class UpdateUserDto {

  private constructor(
    public id: string,
    public username?: string,
    public email?: string,
    public fullName?: string,
    public role?: UserRole,
    public isActive?: boolean,
  ) {}

  static create( object: { [key:string]:any } ): [string?, UpdateUserDto?] {
    const { id, username, email, fullName, role, isActive } = object;

    if ( !id ) return ['Missing id'];
    if ( email && !regularExps.email.test( email ) ) return ['Email is not valid'];
    if ( role && !Object.values(UserRole).includes(role) ) return ['Invalid role'];

    return [undefined, new UpdateUserDto(id, username, email, fullName, role, isActive)];
  }
}