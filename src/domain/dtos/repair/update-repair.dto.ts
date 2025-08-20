import { RepairStatus, RepairPriority } from '../../../data/mysql/entities/repair.entity';

export class UpdateRepairDto {
  private constructor(
    public readonly id: string,
    public readonly issue?: string,
    public readonly description?: string,
    public readonly status?: RepairStatus,
    public readonly priority?: RepairPriority,
    public readonly estimatedCost?: number,
    public readonly finalCost?: number,
    public readonly estimatedDuration?: number,
    public readonly actualDuration?: number,
    public readonly completionDate?: Date,
    public readonly technicianNotes?: string,
    public readonly clientNotes?: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, UpdateRepairDto?] {
    const { 
      id, issue, description, status, priority, estimatedCost, finalCost, 
      estimatedDuration, actualDuration, completionDate, technicianNotes, clientNotes 
    } = object;

    if (!id) return ['Missing id'];

    if (issue !== undefined && (issue.length < 5 || issue.length > 255)) {
      return ['Issue must be between 5 and 255 characters'];
    }

    if (description !== undefined && description.length < 10) {
      return ['Description must be at least 10 characters'];
    }

    if (status !== undefined && !Object.values(RepairStatus).includes(status)) {
      return ['Invalid status'];
    }

    if (priority !== undefined && !Object.values(RepairPriority).includes(priority)) {
      return ['Invalid priority'];
    }

    if (estimatedCost !== undefined && (typeof estimatedCost !== 'number' || estimatedCost < 0)) {
      return ['EstimatedCost must be a positive number'];
    }

    if (finalCost !== undefined && (typeof finalCost !== 'number' || finalCost < 0)) {
      return ['FinalCost must be a positive number'];
    }

    if (estimatedDuration !== undefined && (typeof estimatedDuration !== 'number' || estimatedDuration <= 0)) {
      return ['EstimatedDuration must be a positive number'];
    }

    if (actualDuration !== undefined && (typeof actualDuration !== 'number' || actualDuration < 0)) {
      return ['ActualDuration must be a positive number'];
    }

    if (technicianNotes !== undefined && technicianNotes.length > 1000) {
      return ['TechnicianNotes cannot exceed 1000 characters'];
    }

    if (clientNotes !== undefined && clientNotes.length > 1000) {
      return ['ClientNotes cannot exceed 1000 characters'];
    }

    let parsedCompletionDate: Date | undefined;
    if (completionDate) {
      parsedCompletionDate = new Date(completionDate);
      if (isNaN(parsedCompletionDate.getTime())) return ['Invalid completionDate'];
    }

    return [undefined, new UpdateRepairDto(
      id, issue, description, status, priority, estimatedCost, finalCost,
      estimatedDuration, actualDuration, parsedCompletionDate, technicianNotes, clientNotes
    )];
  }
}