import { Router } from 'express';
import { CustomerController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CustomerService } from '../services/customer.service';

export class CustomerRoutes {

  static get routes(): Router {

    const router = Router();
    const customerService = new CustomerService();
    const controller = new CustomerController(customerService);

    router.use(AuthMiddleware.validateJWT);

    router.get('/', controller.getCustomers);
    router.get('/:id', controller.getCustomerById);
    router.post('/', controller.createCustomer);
    router.put('/:id', controller.updateCustomer);
    router.patch('/:id/toggle-status', controller.toggleCustomerStatus);
    router.delete('/:id', controller.deleteCustomer);

    return router;
  }
}