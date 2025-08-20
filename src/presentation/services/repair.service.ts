import { Repository } from 'typeorm';
import { MySQLDatabase, PhoneEntity, RepairEntity, RepairStatus } from '../../data';
import { CreateRepairDto, CustomError, PaginationDto, UpdateRepairDto } from '../../domain';

export class RepairService {

  private repairRepository: Repository<RepairEntity>;
  private phoneRepository: Repository<PhoneEntity>;

  constructor() {
    this.repairRepository = MySQLDatabase.connection.getRepository(RepairEntity);
    this.phoneRepository = MySQLDatabase.connection.getRepository(PhoneEntity);
  }

  async createRepair(createRepairDto: CreateRepairDto) {
    const phone = await this.phoneRepository.findOne({
      where: { id: createRepairDto.phoneId },
      relations: ['customer']
    });
    if (!phone) throw CustomError.badRequest('Phone not found');

    if (phone.customerId !== createRepairDto.customerId) {
      throw CustomError.badRequest('Customer ID does not match phone owner');
    }

    try {
      const repair = new RepairEntity();
      repair.phoneId = createRepairDto.phoneId;
      repair.customerId = createRepairDto.customerId;
      repair.issue = createRepairDto.issue;
      repair.description = createRepairDto.description;
      repair.priority = createRepairDto.priority;
      repair.estimatedCost = createRepairDto.estimatedCost;
      repair.estimatedDuration = createRepairDto.estimatedDuration;
      repair.technicianNotes = createRepairDto.technicianNotes;
      repair.clientNotes = createRepairDto.clientNotes;
      repair.status = RepairStatus.PENDING;
      repair.startDate = new Date();
      
      const workingHoursPerDay = 8;
      const daysNeeded = Math.ceil(createRepairDto.estimatedDuration / workingHoursPerDay);
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + daysNeeded);
      repair.estimatedCompletionDate = estimatedDate;

      const savedRepair = await this.repairRepository.save(repair);
      return savedRepair;

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getAllRepairs(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [repairs, total] = await Promise.all([
        this.repairRepository.find({
          relations: ['phone', 'customer'],
          skip: (page - 1) * limit,
          take: limit,
          order: { createdAt: 'DESC' }
        }),
        this.repairRepository.count()
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/repairs?page=${page + 1}&limit=${limit}`,
        prev: (page - 1 > 0) ? `/api/repairs?page=${page - 1}&limit=${limit}` : null,
        repairs: repairs
      };

    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async getRepairsByPhoneId(phoneId: string) {
    const phone = await this.phoneRepository.findOne({
      where: { id: phoneId }
    });
    if (!phone) throw CustomError.notFound('Phone not found');

    try {
      const repairs = await this.repairRepository.find({
        where: { phoneId },
        relations: ['phone', 'customer'],
        order: { createdAt: 'DESC' }
      });

      return repairs;

    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async getRepairsByCustomerId(customerId: string) {
    try {
      const repairs = await this.repairRepository.find({
        where: { customerId },
        relations: ['phone', 'customer'],
        order: { createdAt: 'DESC' }
      });

      return repairs;

    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async getRepairById(id: string) {
    try {
      const repair = await this.repairRepository.findOne({
        where: { id },
        relations: ['phone', 'customer']
      });

      if (!repair) throw CustomError.notFound('Repair not found');
      return repair;

    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async updateRepair(updateRepairDto: UpdateRepairDto) {
    const { id, ...updateData } = updateRepairDto;

    try {
      const repair = await this.repairRepository.findOne({ where: { id } });
      if (!repair) throw CustomError.notFound('Repair not found');

      if (updateData.status === RepairStatus.COMPLETED && !updateData.completionDate && !repair.completionDate) {
        updateData.completionDate = new Date();
      }

      Object.assign(repair, updateData);
      const updatedRepair = await this.repairRepository.save(repair);
      return updatedRepair;

    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async deleteRepair(id: string) {
    try {
      const repair = await this.repairRepository.findOne({ where: { id } });
      if (!repair) throw CustomError.notFound('Repair not found');

      if (repair.status === RepairStatus.IN_PROGRESS || repair.status === RepairStatus.COMPLETED) {
        throw CustomError.badRequest('Cannot delete active or completed repairs');
      }

      await this.repairRepository.remove(repair);
      return true;

    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async getRepairStatistics() {
    try {
      const totalRepairs = await this.repairRepository.count();
      const pendingRepairs = await this.repairRepository.count({
        where: { status: RepairStatus.PENDING }
      });
      const inProgressRepairs = await this.repairRepository.count({
        where: { status: RepairStatus.IN_PROGRESS }
      });
      const completedRepairs = await this.repairRepository.count({
        where: { status: RepairStatus.COMPLETED }
      });

      return {
        total: totalRepairs,
        pending: pendingRepairs,
        inProgress: inProgressRepairs,
        completed: completedRepairs
      };

    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }
}