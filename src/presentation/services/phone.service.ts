import { Repository } from 'typeorm';
import { CustomerEntity, MySQLDatabase, PhoneEntity } from '../../data';
import { CreatePhoneDto, CustomError, UpdatePhoneDto } from '../../domain';

export class PhoneService {

  private phoneRepository: Repository<PhoneEntity>;
  private customerRepository: Repository<CustomerEntity>;

  constructor() {
    this.phoneRepository = MySQLDatabase.connection.getRepository(PhoneEntity);
    this.customerRepository = MySQLDatabase.connection.getRepository(CustomerEntity);
  }

  async createPhone(createPhoneDto: CreatePhoneDto) {
    const customer = await this.customerRepository.findOne({
      where: { id: createPhoneDto.customerId }
    });
    if (!customer) throw CustomError.badRequest('Customer not found');

    const existingPhone = await this.phoneRepository.findOne({
      where: { imei: createPhoneDto.imei }
    });
    if (existingPhone) throw CustomError.badRequest('IMEI already exists');

    try {
      const phone = new PhoneEntity();
      phone.customerId = createPhoneDto.customerId;
      phone.brand = createPhoneDto.brand;
      phone.model = createPhoneDto.model;
      phone.imei = createPhoneDto.imei;
      phone.condition = createPhoneDto.condition;
      phone.color = createPhoneDto.color;
      phone.purchaseDate = createPhoneDto.purchaseDate;
      phone.warrantyExpiry = createPhoneDto.warrantyExpiry;
      phone.notes = createPhoneDto.notes;
      phone.isActive = true;

      const savedPhone = await this.phoneRepository.save(phone);
      return savedPhone;

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getPhonesByCustomerId(customerId: string) {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId }
    });
    if (!customer) throw CustomError.notFound('Customer not found');

    try {
      const phones = await this.phoneRepository.find({
        where: { customerId },
        relations: ['customer', 'repairs'],
        order: { createdAt: 'DESC' }
      });

      return phones;

    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async getPhoneById(id: string) {
    try {
      const phone = await this.phoneRepository.findOne({
        where: { id },
        relations: ['customer', 'repairs']
      });

      if (!phone) throw CustomError.notFound('Phone not found');
      
      if (phone.repairs) {
        phone.repairs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      return phone;

    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async getAllPhones() {
    try {
      const phones = await this.phoneRepository.find({
        relations: ['customer'],
        order: { createdAt: 'DESC' }
      });

      return phones;

    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async updatePhone(updatePhoneDto: UpdatePhoneDto) {
    const { id, ...updateData } = updatePhoneDto;

    try {
      const phone = await this.phoneRepository.findOne({ where: { id } });
      if (!phone) throw CustomError.notFound('Phone not found');

      Object.assign(phone, updateData);
      const updatedPhone = await this.phoneRepository.save(phone);
      return updatedPhone;

    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async deletePhone(id: string) {
    try {
      const phone = await this.phoneRepository.findOne({
        where: { id },
        relations: ['repairs']
      });

      if (!phone) throw CustomError.notFound('Phone not found');

      const hasActiveRepairs = phone.repairs.some(repair => 
        repair.status === 'pending' || repair.status === 'in_progress'
      );
      if (hasActiveRepairs) {
        throw CustomError.badRequest('Cannot delete phone with active repairs');
      }

      await this.phoneRepository.remove(phone);
      return true;

    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer('Internal Server Error');
    }
  }
}