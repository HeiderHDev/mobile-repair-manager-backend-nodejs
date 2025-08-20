import { Router } from 'express';

import { Authroutes } from './auth/routes';
import { UserRoutes } from './users/routes';
import { CustomerRoutes } from './customers/routes';
import { PhoneRoutes } from './phones/routes';
import { RepairRoutes } from './repairs/routes';
import { FileUploadRoutes } from './file-upload/routes';
import { ImageRoutes } from './images/routes';

export class AppRoutes {

  static get routes(): Router {

    const router = Router();
    
    router.use('/api/auth', Authroutes.routes );
    router.use('/api/users', UserRoutes.routes );
    
    router.use('/api/customers', CustomerRoutes.routes );
    router.use('/api/phones', PhoneRoutes.routes );
    router.use('/api/repairs', RepairRoutes.routes );
    
    router.use('/api/upload', FileUploadRoutes.routes );
    router.use('/api/images', ImageRoutes.routes );
    
    return router;
  }
}