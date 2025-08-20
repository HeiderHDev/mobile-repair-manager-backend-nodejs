import { Repository } from 'typeorm';
import { CustomerEntity, MySQLDatabase } from '../../data';
import { CreateCustomerDto, CustomError, PaginationDto, UpdateCustomerDto } from '../../domain';

export class CustomerService {

  private customerRepository: Repository<CustomerEntity>;

  constructor() {
    this.customerRepository = MySQLDatabase.connection.getRepository(CustomerEntity);
  }

  async createCustomer(createCustomerDto: CreateCustomerDto) {
    // Verificar si el email ya existe
    const existCustomerByEmail = await this.customerRepository.findOne({ 
      where: { email: createCustomerDto.email } 
    });
    if (existCustomerByEmail) throw CustomError.badRequest('Email already exists');

    // Verificar si el número de documento ya existe
    const existCustomerByDocument = await this.customerRepository.findOne({ 
      where: { documentNumber: createCustomerDto.documentNumber } 
    });
    if (existCustomerByDocument) throw CustomError.badRequest('Document number already exists');

    try {
      const customer = new CustomerEntity();
      customer.firstName = createCustomerDto.firstName;
      customer.lastName = createCustomerDto.lastName;
      customer.email = createCustomerDto.email;
      customer.phone = createCustomerDto.phone;
      customer.documentType = createCustomerDto.documentType;
      customer.documentNumber = createCustomerDto.documentNumber;
      customer.address = createCustomerDto.address;
      customer.notes = createCustomerDto.notes;
      customer.isActive = true;

      const savedCustomer = await this.customerRepository.save(customer);
      return savedCustomer;

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getCustomers(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [customers, total] = await Promise.all([
        this.customerRepository.find({
          skip: (page - 1) * limit,
          take: limit,
          order: { createdAt: 'DESC' }
        }),
        this.customerRepository.count()
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/customers?page=${page + 1}&limit=${limit}`,
        prev: (page - 1 > 0) ? `/api/customers?page=${page - 1}&limit=${limit}` : null,
        customers: customers
      };

    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async getCustomerById(id: string) {
    try {
      const customer = await this.customerRepository.findOne({
        where: { id },
        relations: ['phones', 'phones.repairs']
      });

      if (!customer) throw CustomError.notFound('Customer not found');
      return customer;

    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async updateCustomer(updateCustomerDto: UpdateCustomerDto) {
    const { id, ...updateData } = updateCustomerDto;

    try {
      const customer = await this.customerRepository.findOne({ where: { id } });
      if (!customer) throw CustomError.notFound('Customer not found');

      if (updateData.email && updateData.email !== customer.email) {
        const existCustomer = await this.customerRepository.findOne({ 
          where: { email: updateData.email } 
        });
        if (existCustomer) throw CustomError.badRequest('Email already exists');
      }

      if (updateData.documentNumber && updateData.documentNumber !== customer.documentNumber) {
        const existCustomer = await this.customerRepository.findOne({ 
          where: { documentNumber: updateData.documentNumber } 
        });
        if (existCustomer) throw CustomError.badRequest('Document number already exists');
      }

      Object.assign(customer, updateData);
      const updatedCustomer = await this.customerRepository.save(customer);
      return updatedCustomer;

    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async deleteCustomer(id: string) {
    try {
      const customer = await this.customerRepository.findOne({ 
        where: { id },
        relations: ['phones']
      });
      
      if (!customer) throw CustomError.notFound('Customer not found');

      const hasActivePhones = customer.phones.some(phone => phone.isActive);
      if (hasActivePhones) {
        throw CustomError.badRequest('Cannot delete customer with active phones');
      }

      await this.customerRepository.remove(customer);
      return true;

    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async toggleCustomerStatus(id: string) {
    try {
      const customer = await this.customerRepository.findOne({ where: { id } });
      if (!customer) throw CustomError.notFound('Customer not found');

      customer.isActive = !customer.isActive;
      const updatedCustomer = await this.customerRepository.save(customer);
      return updatedCustomer;

    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer('Internal Server Error');
    }
  }
}