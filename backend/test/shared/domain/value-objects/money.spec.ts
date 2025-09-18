import { Money } from '../../../../src/shared/domain/value-objects/money';

describe('Money Value Object', () => {
  describe('Creation', () => {
    it('should create money with valid amount and currency', () => {
      const money = new Money(100.50, 'USD');
      expect(money.amount).toBe(100.50);
      expect(money.currency).toBe('USD');
    });

    it('should create money with integer amount', () => {
      const money = new Money(100, 'EUR');
      expect(money.amount).toBe(100);
      expect(money.currency).toBe('EUR');
    });

    it('should create money with zero amount', () => {
      const money = new Money(0, 'USD');
      expect(money.amount).toBe(0);
      expect(money.currency).toBe('USD');
    });

    it('should support different currencies', () => {
      const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
      
      currencies.forEach(currency => {
        const money = new Money(50, currency);
        expect(money.currency).toBe(currency);
      });
    });
  });

  describe('Validation', () => {
    it('should throw error for negative amount', () => {
      expect(() => new Money(-10, 'USD')).toThrow('Amount cannot be negative');
    });

    it('should throw error for invalid currency', () => {
      expect(() => new Money(100, 'INVALID')).toThrow('Invalid currency');
    });

    it('should throw error for empty currency', () => {
      expect(() => new Money(100, '')).toThrow('Invalid currency');
    });

    it('should throw error for null/undefined currency', () => {
      expect(() => new Money(100, null as any)).toThrow('Invalid currency');
      expect(() => new Money(100, undefined as any)).toThrow('Invalid currency');
    });

    it('should throw error for amount that is too large', () => {
      const largeAmount = 999999999999;
      expect(() => new Money(largeAmount, 'USD')).toThrow('Amount is too large');
    });

    it('should throw error for invalid amount type', () => {
      expect(() => new Money('invalid' as any, 'USD')).toThrow('Amount must be a number');
    });
  });

  describe('Arithmetic operations', () => {
    it('should add two money objects with same currency', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(50, 'USD');
      const result = money1.add(money2);
      
      expect(result.amount).toBe(150);
      expect(result.currency).toBe('USD');
    });

    it('should subtract two money objects with same currency', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(30, 'USD');
      const result = money1.subtract(money2);
      
      expect(result.amount).toBe(70);
      expect(result.currency).toBe('USD');
    });

    it('should multiply money by a number', () => {
      const money = new Money(100, 'USD');
      const result = money.multiply(2.5);
      
      expect(result.amount).toBe(250);
      expect(result.currency).toBe('USD');
    });

    it('should divide money by a number', () => {
      const money = new Money(100, 'USD');
      const result = money.divide(4);
      
      expect(result.amount).toBe(25);
      expect(result.currency).toBe('USD');
    });

    it('should throw error when adding different currencies', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(50, 'EUR');
      
      expect(() => money1.add(money2)).toThrow('Cannot perform operation with different currencies');
    });

    it('should throw error when subtracting different currencies', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(50, 'EUR');
      
      expect(() => money1.subtract(money2)).toThrow('Cannot perform operation with different currencies');
    });
  });

  describe('Comparison operations', () => {
    it('should compare two money objects correctly', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(50, 'USD');
      const money3 = new Money(100, 'USD');
      
      expect(money1.greaterThan(money2)).toBe(true);
      expect(money2.lessThan(money1)).toBe(true);
      expect(money1.equals(money3)).toBe(true);
    });

    it('should throw error when comparing different currencies', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(100, 'EUR');
      
      expect(() => money1.greaterThan(money2)).toThrow('Cannot compare different currencies');
    });
  });

  describe('Equality', () => {
    it('should be equal to another money with same amount and currency', () => {
      const money1 = new Money(100.50, 'USD');
      const money2 = new Money(100.50, 'USD');
      
      expect(money1.equals(money2)).toBe(true);
    });

    it('should not be equal to another money with different amount', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(200, 'USD');
      
      expect(money1.equals(money2)).toBe(false);
    });

    it('should not be equal to another money with different currency', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(100, 'EUR');
      
      expect(money1.equals(money2)).toBe(false);
    });

    it('should not be equal to non-money object', () => {
      const money = new Money(100, 'USD');
      const other = { amount: 100, currency: 'USD' };
      
      expect(money.equals(other as any)).toBe(false);
    });
  });

  describe('String representation', () => {
    it('should return formatted string representation', () => {
      const money = new Money(100.50, 'USD');
      expect(money.toString()).toBe('$100.50');
    });

    it('should format different currencies correctly', () => {
      const usd = new Money(100.50, 'USD');
      const eur = new Money(100.50, 'EUR');
      const jpy = new Money(100, 'JPY');
      
      expect(usd.toString()).toBe('$100.50');
      expect(eur.toString()).toBe('€100.50');
      expect(jpy.toString()).toBe('¥100');
    });
  });

  describe('Precision handling', () => {
    it('should handle decimal precision correctly', () => {
      const money = new Money(100.123, 'USD');
      expect(money.amount).toBe(100.12); // Rounded to 2 decimal places
    });

    it('should handle very small amounts', () => {
      const money = new Money(0.01, 'USD');
      expect(money.amount).toBe(0.01);
    });
  });
});
