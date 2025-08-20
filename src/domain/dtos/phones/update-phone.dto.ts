import { PhoneCondition } from '../../../data/mysql/entities/phone.entity';

export class UpdatePhoneDto {
  private constructor(
    public readonly id: string,
    public readonly brand?: string,
    public readonly model?: string,
    public readonly condition?: PhoneCondition,
    public readonly color?: string,
    public readonly purchaseDate?: Date,
    public readonly warrantyExpiry?: Date,
    public readonly notes?: string,
    public readonly isActive?: boolean,
  ) {}

  static create(object: { [key: string]: any }): [string?, UpdatePhoneDto?] {
    const { id, brand, model, condition, color, purchaseDate, warrantyExpiry, notes, isActive } = object;

    if (!id) return ['Missing id'];

    if (brand !== undefined && (brand.length < 2 || brand.length > 50)) {
      return ['Brand must be between 2 and 50 characters'];
    }

    if (model !== undefined && (model.length < 2 || model.length > 100)) {
      return ['Model must be between 2 and 100 characters'];
    }

    if (condition !== undefined && !Object.values(PhoneCondition).includes(condition)) {
      return ['Invalid condition'];
    }

    if (color !== undefined && color.length > 30) {
      return ['Color cannot exceed 30 characters'];
    }

    if (notes !== undefined && notes.length > 1000) {
      return ['Notes cannot exceed 1000 characters'];
    }

    // Validar fechas si se proporcionan
    let parsedPurchaseDate: Date | undefined;
    let parsedWarrantyExpiry: Date | undefined;

    if (purchaseDate) {
      parsedPurchaseDate = new Date(purchaseDate);
      if (isNaN(parsedPurchaseDate.getTime())) return ['Invalid purchaseDate'];
    }

    if (warrantyExpiry) {
      parsedWarrantyExpiry = new Date(warrantyExpiry);
      if (isNaN(parsedWarrantyExpiry.getTime())) return ['Invalid warrantyExpiry'];
    }

    return [undefined, new UpdatePhoneDto(id, brand, model, condition, color, parsedPurchaseDate, parsedWarrantyExpiry, notes, isActive)];
  }
}