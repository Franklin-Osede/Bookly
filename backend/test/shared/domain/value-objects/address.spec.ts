import { Address } from '../../../../src/shared/domain/value-objects/address';

describe('Address Value Object', () => {
  describe('Creation', () => {
    it('should create a valid address', () => {
      const address = new Address({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      });
      
      expect(address.street).toBe('123 Main St');
      expect(address.city).toBe('New York');
      expect(address.state).toBe('NY');
      expect(address.zipCode).toBe('10001');
      expect(address.country).toBe('USA');
    });

    it('should create address with optional fields', () => {
      const address = new Address({
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA',
        apartment: 'Apt 2B',
        neighborhood: 'Beverly Hills'
      });
      
      expect(address.apartment).toBe('Apt 2B');
      expect(address.neighborhood).toBe('Beverly Hills');
    });
  });

  describe('Validation', () => {
    it('should throw error for missing required fields', () => {
      expect(() => new Address({
        street: '',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      })).toThrow('Street is required');

      expect(() => new Address({
        street: '123 Main St',
        city: '',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      })).toThrow('City is required');

      expect(() => new Address({
        street: '123 Main St',
        city: 'New York',
        state: '',
        zipCode: '10001',
        country: 'USA'
      })).toThrow('State is required');

      expect(() => new Address({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '',
        country: 'USA'
      })).toThrow('Zip code is required');

      expect(() => new Address({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: ''
      })).toThrow('Country is required');
    });

    it('should throw error for invalid zip code format', () => {
      expect(() => new Address({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: 'invalid',
        country: 'USA'
      })).toThrow('Invalid zip code format');
    });

    it('should throw error for invalid state format', () => {
      expect(() => new Address({
        street: '123 Main St',
        city: 'New York',
        state: 'INVALID_STATE',
        zipCode: '10001',
        country: 'USA'
      })).toThrow('Invalid state format');
    });

    it('should throw error for invalid country format', () => {
      expect(() => new Address({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'INVALID_COUNTRY'
      })).toThrow('Invalid country format');
    });
  });

  describe('Equality', () => {
    it('should be equal to another address with same values', () => {
      const address1 = new Address({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      });
      
      const address2 = new Address({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      });
      
      expect(address1.equals(address2)).toBe(true);
    });

    it('should not be equal to another address with different values', () => {
      const address1 = new Address({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      });
      
      const address2 = new Address({
        street: '456 Oak Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      });
      
      expect(address1.equals(address2)).toBe(false);
    });

    it('should not be equal to non-address object', () => {
      const address = new Address({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      });
      
      const other = { street: '123 Main St' };
      
      expect(address.equals(other as any)).toBe(false);
    });
  });

  describe('String representation', () => {
    it('should return formatted address string', () => {
      const address = new Address({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      });
      
      expect(address.toString()).toBe('123 Main St, New York, NY 10001, USA');
    });

    it('should include apartment in formatted string', () => {
      const address = new Address({
        street: '123 Main St',
        apartment: 'Apt 2B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      });
      
      expect(address.toString()).toBe('123 Main St, Apt 2B, New York, NY 10001, USA');
    });

    it('should include neighborhood in formatted string', () => {
      const address = new Address({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        neighborhood: 'Manhattan'
      });
      
      expect(address.toString()).toBe('123 Main St, New York, NY 10001, Manhattan, USA');
    });
  });

  describe('Geographic information', () => {
    it('should return full address for geocoding', () => {
      const address = new Address({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      });
      
      expect(address.getFullAddress()).toBe('123 Main St, New York, NY 10001, USA');
    });

    it('should return city and state for location identification', () => {
      const address = new Address({
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      });
      
      expect(address.getLocation()).toBe('New York, NY');
    });
  });

  describe('International addresses', () => {
    it('should handle international addresses', () => {
      const address = new Address({
        street: '10 Downing Street',
        city: 'London',
        state: 'England',
        zipCode: 'SW1A 2AA',
        country: 'UK'
      });
      
      expect(address.country).toBe('UK');
      expect(address.toString()).toBe('10 Downing Street, London, England SW1A 2AA, UK');
    });

    it('should validate international zip codes', () => {
      const address = new Address({
        street: '10 Downing Street',
        city: 'London',
        state: 'England',
        zipCode: 'SW1A 2AA',
        country: 'UK'
      });
      
      expect(address.zipCode).toBe('SW1A 2AA');
    });
  });
});

