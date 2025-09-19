import { v4 as uuidv4 } from 'uuid';

export class UUID {
  private readonly _value: string;

  constructor(value?: string) {
    if (value !== undefined) {
      this.validate(value);
      this._value = value;
    } else {
      // For now, we'll use v4 but with a custom format that looks like v6
      // In production, you would use a proper UUID v6 library
      this._value = this.generateV6Like();
    }
  }

  get value(): string {
    return this._value;
  }

  private generateV6Like(): string {
    // Generate a UUID that looks like v6 for demonstration
    // In production, use a proper UUID v6 library
    const timestamp = Date.now().toString(16).padStart(12, '0');
    const random1 = Math.random().toString(16).substring(2, 8).padStart(6, '0');
    const random2 = Math.random().toString(16).substring(2, 8).padStart(6, '0');
    const random3 = Math.random().toString(16).substring(2, 8).padStart(6, '0');
    
    return `${timestamp.substring(0, 8)}-${timestamp.substring(8, 12)}-6${random1.substring(0, 3)}-${(8 + Math.floor(Math.random() * 4)).toString(16)}${random2.substring(0, 3)}-${random3}`;
  }

  private validate(uuid: string): void {
    if (!uuid || typeof uuid !== 'string' || uuid.trim() === '') {
      throw new Error('Invalid UUID v6 format');
    }

    // UUID v6 format validation
    const uuidv6Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-6[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuidv6Regex.test(uuid)) {
      throw new Error('Invalid UUID v6 format');
    }
  }

  equals(other: UUID): boolean {
    if (!(other instanceof UUID)) {
      return false;
    }
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  // Static method to generate new UUID v6
  static generate(): UUID {
    return new UUID();
  }

  // Static method to create from string
  static fromString(value: string): UUID {
    return new UUID(value);
  }
}