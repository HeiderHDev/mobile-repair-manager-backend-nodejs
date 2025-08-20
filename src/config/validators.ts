export class Validators {

    static isUUID(id: string): boolean {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(id);
    }
  
    static isPositiveInteger(id: string | number): boolean {
      const num = typeof id === 'string' ? parseInt(id, 10) : id;
      return Number.isInteger(num) && num > 0;
    }

    static isEmail(email: string): boolean {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    }
}