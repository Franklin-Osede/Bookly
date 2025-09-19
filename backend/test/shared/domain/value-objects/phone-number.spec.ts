import { PhoneNumber } from '../../../../src/shared/domain/value-objects/phone-number';

describe('PhoneNumber Value Object', () => {
  describe('Creation', () => {
    it('should create a valid phone number', () => {
      const phoneNumber = new PhoneNumber('+1234567890');
      expect(phoneNumber.value).toBe('+1234567890');
    });

    it('should create phone number with different valid formats', () => {
      const validPhones = [
        '+1234567890',
        '+1-234-567-8900',
        '+1 (234) 567-8900',
        '+1.234.567.8900',
        '+12345678901',
        '+44123456789',
        '+33123456789'
      ];

      validPhones.forEach(phoneStr => {
        const phoneNumber = new PhoneNumber(phoneStr);
        expect(phoneNumber.value).toBeDefined();
      });
    });

    it('should normalize phone number format', () => {
      const phoneNumber = new PhoneNumber('+1 (234) 567-8900');
      expect(phoneNumber.value).toBe('+12345678900');
    });
  });

  describe('Validation', () => {
    it('should throw error for invalid phone number format', () => {
      const invalidPhones = [
        { phone: 'invalid-phone', error: 'Phone number must include country code' },
        { phone: '123', error: 'Phone number must include country code' },
        { phone: '123456789', error: 'Phone number must include country code' },
        { phone: '+', error: 'Phone number is too short' },
        { phone: '+123', error: 'Phone number is too short' },
        { phone: '', error: 'Invalid phone number format' },
        { phone: ' ', error: 'Phone number must include country code' },
        { phone: null, error: 'Invalid phone number format' },
        { phone: undefined, error: 'Invalid phone number format' }
      ];

      invalidPhones.forEach(({ phone, error }) => {
        expect(() => new PhoneNumber(phone as any)).toThrow(error);
      });
    });

    it('should throw error for phone number that is too long', () => {
      const longPhone = '+12345678901234567890';
      expect(() => new PhoneNumber(longPhone)).toThrow('Phone number is too long');
    });

    it('should throw error for phone number that is too short', () => {
      const shortPhone = '+123';
      expect(() => new PhoneNumber(shortPhone)).toThrow('Phone number is too short');
    });

    it('should throw error for phone number without country code', () => {
      const phoneWithoutCountryCode = '2345678900';
      expect(() => new PhoneNumber(phoneWithoutCountryCode)).toThrow('Phone number must include country code');
    });
  });

  describe('Country code extraction', () => {
    it('should extract country code correctly', () => {
      const phone1 = new PhoneNumber('+1234567890');
      expect(phone1.countryCode).toBe('+1');

      const phone2 = new PhoneNumber('+44123456789');
      expect(phone2.countryCode).toBe('+44');

      const phone3 = new PhoneNumber('+33123456789');
      expect(phone3.countryCode).toBe('+33');
    });

    it('should handle different country code lengths', () => {
      const phone1 = new PhoneNumber('+1234567890'); // 1 digit
      expect(phone1.countryCode).toBe('+1');

      const phone2 = new PhoneNumber('+44123456789'); // 2 digits
      expect(phone2.countryCode).toBe('+44');
    });
  });

  describe('National number extraction', () => {
    it('should extract national number correctly', () => {
      const phone1 = new PhoneNumber('+1234567890');
      expect(phone1.nationalNumber).toBe('234567890');

      const phone2 = new PhoneNumber('+44123456789');
      expect(phone2.nationalNumber).toBe('123456789');
    });
  });

  describe('Equality', () => {
    it('should be equal to another phone number with same value', () => {
      const phone1 = new PhoneNumber('+1234567890');
      const phone2 = new PhoneNumber('+1234567890');
      
      expect(phone1.equals(phone2)).toBe(true);
    });

    it('should not be equal to another phone number with different value', () => {
      const phone1 = new PhoneNumber('+1234567890');
      const phone2 = new PhoneNumber('+1234567891');
      
      expect(phone1.equals(phone2)).toBe(false);
    });

    it('should not be equal to non-phone number object', () => {
      const phone = new PhoneNumber('+1234567890');
      const other = { value: '+1234567890' };
      
      expect(phone.equals(other as any)).toBe(false);
    });
  });

  describe('String representation', () => {
    it('should return normalized phone number when converted to string', () => {
      const phone = new PhoneNumber('+1 (234) 567-8900');
      expect(phone.toString()).toBe('+12345678900');
    });

    it('should return formatted phone number for display', () => {
      const phone = new PhoneNumber('+1234567890');
      expect(phone.toFormattedString()).toBe('+1 (234) 567-890');
    });
  });

  describe('International format', () => {
    it('should return international format', () => {
      const phone = new PhoneNumber('+1234567890');
      expect(phone.toInternationalFormat()).toBe('+1 234 567 890');
    });

    it('should handle different country formats', () => {
      const phone1 = new PhoneNumber('+44123456789');
      expect(phone1.toInternationalFormat()).toBe('+44 123 456 789');

      const phone2 = new PhoneNumber('+33123456789');
      expect(phone2.toInternationalFormat()).toBe('+33 1 23 45 67 89');
    });
  });

  describe('Validation for specific countries', () => {
    it('should validate US phone numbers correctly', () => {
      const validUSPhones = [
        '+1234567890',
        '+12345678901'
      ];

      validUSPhones.forEach(phoneStr => {
        const phone = new PhoneNumber(phoneStr);
        expect(phone.isValidForCountry('US')).toBe(true);
      });
    });

    it('should validate UK phone numbers correctly', () => {
      const validUKPhones = [
        '+44123456789',
        '+442012345678'
      ];

      validUKPhones.forEach(phoneStr => {
        const phone = new PhoneNumber(phoneStr);
        expect(phone.isValidForCountry('UK')).toBe(true);
      });
    });
  });
});