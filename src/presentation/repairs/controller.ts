import { Request, Response, NextFunction } from 'express';
import { CustomError, CreateRepairDto, UpdateRepairDto, PaginationDto } from '../../domain';
import { RepairService } from '../services/repair.service';

export class RepairController {

  constructor(
    private readonly repairService: RepairService,
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  }

  createRepair = (req: Request, res: Response, next: NextFunction) => {
    const [error, createRepairDto] = CreateRepairDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.repairService.createRepair(createRepairDto!)
      .then(repair => res.status(201).json(repair))
      .catch(error => this.handleError(error, res));
  }

  getAllRepairs = (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.repairService.getAllRepairs(paginationDto!)
      .then(repairs => res.json(repairs))
      .catch(error => this.handleError(error, res));
  }

  getRepairsByPhone = (req: Request, res: Response, next: NextFunction) => {
    const { phoneId } = req.params;

    this.repairService.getRepairsByPhoneId(phoneId)
      .then(repairs => res.json(repairs))
      .catch(error => this.handleError(error, res));
  }

  getRepairsByCustomer = (req: Request, res: Response, next: NextFunction) => {
    const { customerId } = req.params;

    this.repairService.getRepairsByCustomerId(customerId)
      .then(repairs => res.json(repairs))
      .catch(error => this.handleError(error, res));
  }

  getRepairById = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    this.repairService.getRepairById(id)
      .then(repair => res.json(repair))
      .catch(error => this.handleError(error, res));
  }

  updateRepair = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const [error, updateRepairDto] = UpdateRepairDto.create({ id, ...req.body });
    if (error) return res.status(400).json({ error });

    this.repairService.updateRepair(updateRepairDto!)
      .then(repair => res.json(repair))
      .catch(error => this.handleError(error, res));
  }

  deleteRepair = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    this.repairService.deleteRepair(id)
      .then(() => res.json({ message: 'Repair deleted successfully' }))
      .catch(error => this.handleError(error, res));
  }

  getRepairStatistics = (req: Request, res: Response, next: NextFunction) => {
    this.repairService.getRepairStatistics()
      .then(stats => res.json(stats))
      .catch(error => this.handleError(error, res));
  }
}