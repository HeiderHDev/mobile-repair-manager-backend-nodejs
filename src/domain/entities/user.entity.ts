import { CustomError } from '../errors/custom.error';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
}

export class UserEntity {

  constructor(
    public id: string,
    public username: string,
    public email: string,
    public fullName: string,
    public password: string,
    public role: UserRole,
    public isActive: boolean,
    public createdAt: Date,
    public updatedAt: Date,
  ) { }

  static fromObject( object: { [ key: string ]: any; } ) {
    const { 
      id, 
      username, 
      email, 
      fullName, 
      password, 
      role, 
      isActive, 
      createdAt, 
      updatedAt 
    } = object;

    if ( !id ) {
      throw CustomError.badRequest( 'Missing id' );
    }

    if ( !username ) throw CustomError.badRequest( 'Missing username' );
    if ( !email ) throw CustomError.badRequest( 'Missing email' );
    if ( !fullName ) throw CustomError.badRequest( 'Missing fullName' );
    if ( !password ) throw CustomError.badRequest( 'Missing password' );
    if ( !role ) throw CustomError.badRequest( 'Missing role' );
    if ( isActive === undefined ) throw CustomError.badRequest( 'Missing isActive' );

    return new UserEntity( 
      id, 
      username, 
      email, 
      fullName, 
      password, 
      role, 
      isActive, 
      createdAt, 
      updatedAt 
    );
  }

  // Método para obtener datos públicos (sin password)
  public getPublicData() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      fullName: this.fullName,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Verificar si puede crear usuarios
  public canCreateUsers(): boolean {
    return this.role === UserRole.SUPER_ADMIN;
  }

  // Verificar si puede gestionar otros usuarios
  public canManageUsers(): boolean {
    return this.role === UserRole.SUPER_ADMIN;
  }
}