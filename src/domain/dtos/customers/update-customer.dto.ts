import { DocumentType } from '../../../data/mysql/entities/customer.entity';
import { regularExps } from '../../../config';

export class UpdateCustomerDto {
  private constructor(
    public readonly id: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly email?: string,
    public readonly phone?: string,
    public readonly documentType?: DocumentType,
    public readonly documentNumber?: string,
    public readonly address?: string,
    public readonly notes?: string,
    public readonly isActive?: boolean,
  ) {}

  static create(object: { [key: string]: any }): [string?, UpdateCustomerDto?] {
    const { id, firstName, lastName, email, phone, documentType, documentNumber, address, notes, isActive } = object;

    if (!id) return ['Missing id'];

    if (firstName !== undefined && (firstName.length < 2 || firstName.length > 100)) {
      return ['firstName must be between 2 and 100 characters'];
    }

    if (lastName !== undefined && (lastName.length < 2 || lastName.length > 100)) {
      return ['lastName must be between 2 and 100 characters'];
    }

    if (email !== undefined && !regularExps.email.test(email)) {
      return ['Email is not valid'];
    }

    if (phone !== undefined && (phone.length < 10 || phone.length > 20)) {
      return ['Phone must be between 10 and 20 characters'];
    }

    if (documentType !== undefined && !Object.values(DocumentType).includes(documentType)) {
      return ['Invalid documentType'];
    }

    if (documentNumber !== undefined && (documentNumber.length < 5 || documentNumber.length > 50)) {
      return ['documentNumber must be between 5 and 50 characters'];
    }

    if (address !== undefined && address.length > 255) {
      return ['address cannot exceed 255 characters'];
    }

    if (notes !== undefined && notes.length > 1000) {
      return ['notes cannot exceed 1000 characters'];
    }

    return [undefined, new UpdateCustomerDto(id, firstName, lastName, email, phone, documentType, documentNumber, address, notes, isActive)];
  }
}