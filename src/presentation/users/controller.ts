import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { CreateUserDto, UpdateUserDto } from '../../domain';
import { UserService } from '../services/user.service';

export class UserController {

  constructor(
    public readonly userService: UserService,
  ) {}

  private handleError = (error: unknown, res: Response ) => {
    if ( error instanceof CustomError ) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${ error }`);
    return res.status(500).json({ error: 'Internal server error' })
  } 

  createUser = (req: Request, res: Response) => {
    const [error, createUserDto] = CreateUserDto.create(req.body);
    if ( error ) return res.status(400).json({error})

    this.userService.createUser(createUserDto!, req.body.user)
      .then( (user) => res.status(201).json(user) )
      .catch( error => this.handleError(error, res) );
  }

  getUsers = (req: Request, res: Response) => {
    this.userService.getUsers(req.body.user)
      .then( (users) => res.json(users) )
      .catch( error => this.handleError(error, res) );
  }

  getUserById = (req: Request, res: Response) => {
    const { id } = req.params;

    this.userService.getUserById(id, req.body.user)
      .then( (user) => res.json(user) )
      .catch( error => this.handleError(error, res) );
  }

  updateUser = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, updateUserDto] = UpdateUserDto.create({ id, ...req.body });
    if ( error ) return res.status(400).json({error})

    this.userService.updateUser(updateUserDto!, req.body.user)
      .then( (user) => res.json(user) )
      .catch( error => this.handleError(error, res) );
  }

  toggleUserStatus = (req: Request, res: Response) => {
    const { id } = req.params;

    this.userService.toggleUserStatus(id, req.body.user)
      .then( (user) => res.json(user) )
      .catch( error => this.handleError(error, res) );
  }

  deleteUser = (req: Request, res: Response) => {
    const { id } = req.params;

    this.userService.deleteUser(id, req.body.user)
      .then( () => res.json({ message: 'User deleted successfully' }) )
      .catch( error => this.handleError(error, res) );
  }
}