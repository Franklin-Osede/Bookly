export class Email {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = this.normalize(value);
  }

  get value(): string {
    return this._value;
  }

  private validate(email: string): void {
    if (!email || typeof email !== 'string') {
      throw new Error('Invalid email format');
    }

    if (email.length > 254) {
      throw new Error('Email is too long');
    }

    // More strict email validation - requires TLD
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Additional checks for edge cases
    if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
      throw new Error('Invalid email format');
    }

    if (email.includes('@.') || email.includes('.@')) {
      throw new Error('Invalid email format');
    }

    // Check that domain has at least one dot (TLD)
    const domain = email.split('@')[1];
    if (!domain || !domain.includes('.')) {
      throw new Error('Invalid email format');
    }
  }

  private normalize(email: string): string {
    return email.toLowerCase().trim();
  }

  equals(other: Email): boolean {
    if (!(other instanceof Email)) {
      return false;
    }
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
