import { DocumentType } from '../../../data/mysql/entities/customer.entity';
import { regularExps } from '../../../config';

export class CreateCustomerDto {
  private constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly documentType: DocumentType,
    public readonly documentNumber: string,
    public readonly address?: string,
    public readonly notes?: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateCustomerDto?] {
    const { firstName, lastName, email, phone, documentType, documentNumber, address, notes } = object;

    if (!firstName) return ['Missing firstName'];
    if (firstName.length < 2 || firstName.length > 100) return ['firstName must be between 2 and 100 characters'];

    if (!lastName) return ['Missing lastName'];
    if (lastName.length < 2 || lastName.length > 100) return ['lastName must be between 2 and 100 characters'];

    if (!email) return ['Missing email'];
    if (!regularExps.email.test(email)) return ['Email is not valid'];

    if (!phone) return ['Missing phone'];
    if (phone.length < 10 || phone.length > 20) return ['Phone must be between 10 and 20 characters'];

    if (!documentType) return ['Missing documentType'];
    if (!Object.values(DocumentType).includes(documentType)) return ['Invalid documentType'];

    if (!documentNumber) return ['Missing documentNumber'];
    if (documentNumber.length < 5 || documentNumber.length > 50) return ['documentNumber must be between 5 and 50 characters'];

    if (address && address.length > 255) return ['address cannot exceed 255 characters'];
    if (notes && notes.length > 1000) return ['notes cannot exceed 1000 characters'];

    return [undefined, new CreateCustomerDto(firstName, lastName, email, phone, documentType, documentNumber, address, notes)];
  }
}