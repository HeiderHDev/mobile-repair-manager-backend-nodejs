import { regularExps } from '../../../config';
import { UserRole } from '../../entities/user.entity';

export class CreateUserDto {

  private constructor(
    public username: string,
    public email: string,
    public fullName: string,
    public password: string,
    public role: UserRole,
  ) {}

  static create( object: { [key:string]:any } ): [string?, CreateUserDto?] {
    const { username, email, fullName, password, role } = object;

    if ( !username ) return ['Missing username'];
    if ( !email ) return ['Missing email'];
    if ( !regularExps.email.test( email ) ) return ['Email is not valid'];
    if ( !fullName ) return ['Missing fullName'];
    if ( !password ) return ['Missing password'];
    if ( password.length < 6 ) return ['Password too short'];
    if ( !role ) return ['Missing role'];
    if ( !Object.values(UserRole).includes(role) ) return ['Invalid role'];

    return [undefined, new CreateUserDto(username, email, fullName, password, role)];
  }
}