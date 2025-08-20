import { Request, Response, NextFunction } from 'express';
import { CustomError, CreatePhoneDto, UpdatePhoneDto } from '../../domain';
import { PhoneService } from '../services/phone.service';

export class PhoneController {

  constructor(
    private readonly phoneService: PhoneService,
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }

  createPhone = (req: Request, res: Response, next: NextFunction) => {
    const [error, createPhoneDto] = CreatePhoneDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.phoneService.createPhone(createPhoneDto!)
      .then(phone => res.status(201).json(phone))
      .catch(error => this.handleError(error, res));
  }

  getPhonesByCustomer = (req: Request, res: Response, next: NextFunction) => {
    const { customerId } = req.params;

    this.phoneService.getPhonesByCustomerId(customerId)
      .then(phones => res.json(phones))
      .catch(error => this.handleError(error, res));
  }

  getAllPhones = (req: Request, res: Response, next: NextFunction) => {
    this.phoneService.getAllPhones()
      .then(phones => res.json(phones))
      .catch(error => this.handleError(error, res));
  }

  getPhoneById = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    this.phoneService.getPhoneById(id)
      .then(phone => res.json(phone))
      .catch(error => this.handleError(error, res));
  }

  updatePhone = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const [error, updatePhoneDto] = UpdatePhoneDto.create({ id, ...req.body });
    if (error) return res.status(400).json({ error });

    this.phoneService.updatePhone(updatePhoneDto!)
      .then(phone => res.json(phone))
      .catch(error => this.handleError(error, res));
  }

  deletePhone = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    this.phoneService.deletePhone(id)
      .then(() => res.json({ message: 'Phone deleted successfully' }))
      .catch(error => this.handleError(error, res));
  }
}