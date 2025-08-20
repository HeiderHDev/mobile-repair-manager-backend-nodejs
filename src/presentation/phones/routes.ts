import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { PhoneService } from '../services/phone.service';
import { PhoneController } from './controller';

export class PhoneRoutes {

  static get routes(): Router {

    const router = Router();
    const phoneService = new PhoneService();
    const controller = new PhoneController(phoneService);

    router.use(AuthMiddleware.validateJWT);

    router.get('/', controller.getAllPhones);
    router.get('/customer/:customerId', controller.getPhonesByCustomer);
    router.get('/:id', controller.getPhoneById);
    router.post('/', controller.createPhone);
    router.put('/:id', controller.updatePhone);
    router.delete('/:id', controller.deletePhone);

    return router;
  }
}