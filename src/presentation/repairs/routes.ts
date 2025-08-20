import { Router } from 'express';
import { RepairController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RepairService } from '../services/repair.service';

export class RepairRoutes {

  static get routes(): Router {

    const router = Router();
    const repairService = new RepairService();
    const controller = new RepairController(repairService);

    router.use(AuthMiddleware.validateJWT);

    router.get('/', controller.getAllRepairs);
    router.get('/statistics', controller.getRepairStatistics);
    router.get('/phone/:phoneId', controller.getRepairsByPhone);
    router.get('/customer/:customerId', controller.getRepairsByCustomer);
    router.get('/:id', controller.getRepairById);
    router.post('/', controller.createRepair);
    router.put('/:id', controller.updateRepair);
    router.delete('/:id', controller.deleteRepair);

    return router;
  }
}