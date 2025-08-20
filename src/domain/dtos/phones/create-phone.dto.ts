import { PhoneCondition } from '../../../data/mysql/entities/phone.entity';
import { Validators } from '../../../config';

export class CreatePhoneDto {
  private constructor(
    public readonly customerId: string,
    public readonly brand: string,
    public readonly model: string,
    public readonly imei: string,
    public readonly condition: PhoneCondition,
    public readonly color?: string,
    public readonly purchaseDate?: Date,
    public readonly warrantyExpiry?: Date,
    public readonly notes?: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, CreatePhoneDto?] {
    const { customerId, brand, model, imei, condition, color, purchaseDate, warrantyExpiry, notes } = object;

    if (!customerId) return ['Missing customerId'];
    if (!Validators.isUUID(customerId)) return ['Invalid customerId'];

    if (!brand) return ['Missing brand'];
    if (brand.length < 2 || brand.length > 50) return ['Brand must be between 2 and 50 characters'];

    if (!model) return ['Missing model'];
    if (model.length < 2 || model.length > 100) return ['Model must be between 2 and 100 characters'];

    if (!imei) return ['Missing imei'];
    if (imei.length !== 15) return ['IMEI must be exactly 15 characters'];

    if (!condition) return ['Missing condition'];
    if (!Object.values(PhoneCondition).includes(condition)) return ['Invalid condition'];

    if (color && color.length > 30) return ['Color cannot exceed 30 characters'];
    if (notes && notes.length > 1000) return ['Notes cannot exceed 1000 characters'];

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

    return [undefined, new CreatePhoneDto(customerId, brand, model, imei, condition, color, parsedPurchaseDate, parsedWarrantyExpiry, notes)];
  }
}