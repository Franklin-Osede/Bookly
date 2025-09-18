export class Money {
  private readonly _amount: number;
  private readonly _currency: string;

  private static readonly SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
  private static readonly MAX_AMOUNT = 999999999;
  private static readonly DECIMAL_PLACES = 2;

  constructor(amount: number, currency: string) {
    this.validate(amount, currency);
    this._amount = this.roundAmount(amount);
    this._currency = currency.toUpperCase();
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  private validate(amount: number, currency: string): void {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new Error('Amount must be a number');
    }

    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }

    if (amount > Money.MAX_AMOUNT) {
      throw new Error('Amount is too large');
    }

    if (!currency || typeof currency !== 'string') {
      throw new Error('Invalid currency');
    }

    if (!Money.SUPPORTED_CURRENCIES.includes(currency.toUpperCase())) {
      throw new Error('Invalid currency');
    }
  }

  private roundAmount(amount: number): number {
    return Math.round(amount * 100) / 100;
  }

  add(other: Money): Money {
    this.validateSameCurrencyForOperation(other);
    return new Money(this._amount + other._amount, this._currency);
  }

  subtract(other: Money): Money {
    this.validateSameCurrencyForOperation(other);
    const result = this._amount - other._amount;
    if (result < 0) {
      throw new Error('Result cannot be negative');
    }
    return new Money(result, this._currency);
  }

  multiply(factor: number): Money {
    if (typeof factor !== 'number' || isNaN(factor)) {
      throw new Error('Factor must be a number');
    }
    return new Money(this._amount * factor, this._currency);
  }

  divide(divisor: number): Money {
    if (typeof divisor !== 'number' || isNaN(divisor)) {
      throw new Error('Divisor must be a number');
    }
    if (divisor === 0) {
      throw new Error('Cannot divide by zero');
    }
    return new Money(this._amount / divisor, this._currency);
  }

  greaterThan(other: Money): boolean {
    this.validateSameCurrencyForComparison(other);
    return this._amount > other._amount;
  }

  lessThan(other: Money): boolean {
    this.validateSameCurrencyForComparison(other);
    return this._amount < other._amount;
  }

  equals(other: Money): boolean {
    if (!(other instanceof Money)) {
      return false;
    }
    return this._amount === other._amount && this._currency === other._currency;
  }

  private validateSameCurrencyForOperation(other: Money): void {
    if (this._currency !== other._currency) {
      throw new Error('Cannot perform operation with different currencies');
    }
  }

  private validateSameCurrencyForComparison(other: Money): void {
    if (this._currency !== other._currency) {
      throw new Error('Cannot compare different currencies');
    }
  }

  toString(): string {
    const currencySymbols: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$'
    };

    const symbol = currencySymbols[this._currency] || this._currency;
    
    // For JPY, don't show decimal places
    if (this._currency === 'JPY') {
      return `${symbol}${Math.round(this._amount)}`;
    }
    
    return `${symbol}${this._amount.toFixed(Money.DECIMAL_PLACES)}`;
  }
}
