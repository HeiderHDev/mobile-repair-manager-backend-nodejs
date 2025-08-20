import { RepairPriority } from '../../../data/mysql/entities/repair.entity';
import { Validators } from '../../../config';

export class CreateRepairDto {
  private constructor(
    public readonly phoneId: string,
    public readonly customerId: string,
    public readonly issue: string,
    public readonly description: string,
    public readonly priority: RepairPriority,
    public readonly estimatedCost: number,
    public readonly estimatedDuration: number,
    public readonly technicianNotes?: string,
    public readonly clientNotes?: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateRepairDto?] {
    const { phoneId, customerId, issue, description, priority, estimatedCost, estimatedDuration, technicianNotes, clientNotes } = object;

    if (!phoneId) return ['Missing phoneId'];
    if (!Validators.isUUID(phoneId)) return ['Invalid phoneId'];

    if (!customerId) return ['Missing customerId'];
    if (!Validators.isUUID(customerId)) return ['Invalid customerId'];

    if (!issue) return ['Missing issue'];
    if (issue.length < 5 || issue.length > 255) return ['Issue must be between 5 and 255 characters'];

    if (!description) return ['Missing description'];
    if (description.length < 10) return ['Description must be at least 10 characters'];

    if (!priority) return ['Missing priority'];
    if (!Object.values(RepairPriority).includes(priority)) return ['Invalid priority'];

    if (estimatedCost === undefined || estimatedCost === null) return ['Missing estimatedCost'];
    if (typeof estimatedCost !== 'number' || estimatedCost < 0) return ['EstimatedCost must be a positive number'];

    if (estimatedDuration === undefined || estimatedDuration === null) return ['Missing estimatedDuration'];
    if (typeof estimatedDuration !== 'number' || estimatedDuration <= 0) return ['EstimatedDuration must be a positive number'];

    if (technicianNotes && technicianNotes.length > 1000) return ['TechnicianNotes cannot exceed 1000 characters'];
    if (clientNotes && clientNotes.length > 1000) return ['ClientNotes cannot exceed 1000 characters'];

    return [undefined, new CreateRepairDto(phoneId, customerId, issue, description, priority, estimatedCost, estimatedDuration, technicianNotes, clientNotes)];
  }
}