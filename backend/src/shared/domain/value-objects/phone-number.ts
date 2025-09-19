export class PhoneNumber {
  private readonly _value: string;

  private static readonly MIN_LENGTH = 7;
  private static readonly MAX_LENGTH = 15;

  constructor(value: string) {
    this.validate(value);
    this._value = this.normalize(value);
  }

  get value(): string {
    return this._value;
  }

  get countryCode(): string {
    // Simple extraction for now - can be enhanced later
    if (this._value.startsWith('+1')) return '+1';
    if (this._value.startsWith('+44')) return '+44';
    if (this._value.startsWith('+33')) return '+33';
    
    // Fallback: extract first 1-3 digits after +
    const match = this._value.match(/^\+(\d{1,3})/);
    return match ? '+' + match[1] : '+1';
  }

  get nationalNumber(): string {
    const countryCode = this.countryCode;
    return this._value.substring(countryCode.length);
  }

  private validate(phoneNumber: string): void {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      throw new Error('Invalid phone number format');
    }

    if (!phoneNumber.startsWith('+')) {
      throw new Error('Phone number must include country code');
    }

    const normalized = this.normalize(phoneNumber);
    
    if (normalized.length < PhoneNumber.MIN_LENGTH) {
      throw new Error('Phone number is too short');
    }

    if (normalized.length > PhoneNumber.MAX_LENGTH) {
      throw new Error('Phone number is too long');
    }

    if (!/^\+[1-9]\d{6,14}$/.test(normalized)) {
      throw new Error('Invalid phone number format');
    }
  }

  private normalize(phoneNumber: string): string {
    // Remove all non-digit characters except the leading +
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    if (!cleaned.startsWith('+')) {
      throw new Error('Phone number must include country code');
    }

    return cleaned;
  }

  equals(other: PhoneNumber): boolean {
    if (!(other instanceof PhoneNumber)) {
      return false;
    }
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  toFormattedString(): string {
    const national = this.nationalNumber;
    
    // Simple formatting for US numbers (9 or 10 digits)
    if (this.countryCode === '+1' && national.length === 9) {
      return `+1 (${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`;
    }
    if (this.countryCode === '+1' && national.length === 10) {
      return `+1 (${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`;
    }
    
    // Default: return normalized value
    return this._value;
  }

  toInternationalFormat(): string {
    const national = this.nationalNumber;
    
    // Simple formatting for common countries
    if (this.countryCode === '+1' && national.length === 9) {
      return `+1 ${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`;
    }
    if (this.countryCode === '+1' && national.length === 10) {
      return `+1 ${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`;
    }
    
    if (this.countryCode === '+44' && national.length === 9) {
      return `+44 ${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`;
    }
    
    if (this.countryCode === '+33' && national.length === 9) {
      return `+33 ${national.slice(0, 1)} ${national.slice(1, 3)} ${national.slice(3, 5)} ${national.slice(5, 7)} ${national.slice(7)}`;
    }
    
    // Generic formatting: add spaces every 3 digits
    const formatted = national.replace(/(\d{3})(?=\d)/g, '$1 ');
    return `${this.countryCode} ${formatted}`;
  }

  isValidForCountry(countryCode: string): boolean {
    const national = this.nationalNumber;
    
    switch (countryCode) {
      case 'US':
        return this.countryCode === '+1' && (national.length === 9 || national.length === 10 || national.length === 11);
      case 'UK':
        return this.countryCode === '+44' && (national.length === 9 || national.length === 10);
      case 'FR':
        return this.countryCode === '+33' && national.length === 9;
      default:
        return false;
    }
  }
}