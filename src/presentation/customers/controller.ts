import { Request, Response, NextFunction } from 'express';
import { CustomError, CreateCustomerDto, UpdateCustomerDto, PaginationDto } from '../../domain';
import { CustomerService } from '../services/customer.service';

export class CustomerController {

  constructor(
    private readonly customerService: CustomerService,
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }

  createCustomer = (req: Request, res: Response, next: NextFunction) => {
    const [error, createCustomerDto] = CreateCustomerDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.customerService.createCustomer(createCustomerDto!)
      .then(customer => res.status(201).json(customer))
      .catch(error => this.handleError(error, res));
  }

  getCustomers = (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.customerService.getCustomers(paginationDto!)
      .then(customers => res.json(customers))
      .catch(error => this.handleError(error, res));
  }

  getCustomerById = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    this.customerService.getCustomerById(id)
      .then(customer => res.json(customer))
      .catch(error => this.handleError(error, res));
  }

  updateCustomer = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const [error, updateCustomerDto] = UpdateCustomerDto.create({ id, ...req.body });
    if (error) return res.status(400).json({ error });

    this.customerService.updateCustomer(updateCustomerDto!)
      .then(customer => res.json(customer))
      .catch(error => this.handleError(error, res));
  }

  deleteCustomer = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    this.customerService.deleteCustomer(id)
      .then(() => res.json({ message: 'Customer deleted successfully' }))
      .catch(error => this.handleError(error, res));
  }

  toggleCustomerStatus = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    this.customerService.toggleCustomerStatus(id)
      .then(customer => res.json(customer))
      .catch(error => this.handleError(error, res));
  }
}