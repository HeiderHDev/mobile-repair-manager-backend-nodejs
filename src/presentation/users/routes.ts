import { Router } from 'express';
import { UserController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { UserService } from '../services/user.service';

export class UserRoutes {

  static get routes(): Router {

    const router = Router();
    const userService = new UserService();
    const controller = new UserController(userService);

    router.use( AuthMiddleware.validateJWT );

    router.get( '/', controller.getUsers );
    router.get( '/:id', controller.getUserById );
    router.post( '/', controller.createUser );
    router.put( '/:id', controller.updateUser );
    router.patch( '/:id/toggle-status', controller.toggleUserStatus );
    router.delete( '/:id', controller.deleteUser );

    return router;
  }
}