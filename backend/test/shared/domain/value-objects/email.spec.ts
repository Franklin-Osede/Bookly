import { Email } from '../../../../src/shared/domain/value-objects/email';

describe('Email Value Object', () => {
  describe('Creation', () => {
    it('should create a valid email', () => {
      const email = new Email('test@example.com');
      expect(email.value).toBe('test@example.com');
    });

    it('should create email with different valid formats', () => {
      const emails = [
        'user@domain.com',
        'user.name@domain.co.uk',
        'user+tag@domain.org',
        'user123@domain123.net'
      ];

      emails.forEach(emailStr => {
        const email = new Email(emailStr);
        expect(email.value).toBe(emailStr);
      });
    });
  });

  describe('Validation', () => {
    it('should throw error for invalid email format', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user@domain',
        'user..name@domain.com',
        'user@domain..com',
        '',
        ' ',
        null,
        undefined
      ];

      invalidEmails.forEach(invalidEmail => {
        expect(() => new Email(invalidEmail as any)).toThrow('Invalid email format');
      });
    });

    it('should throw error for email that is too long', () => {
      const longEmail = 'a'.repeat(250) + '@domain.com';
      expect(() => new Email(longEmail)).toThrow('Email is too long');
    });
  });

  describe('Equality', () => {
    it('should be equal to another email with same value', () => {
      const email1 = new Email('test@example.com');
      const email2 = new Email('test@example.com');
      
      expect(email1.equals(email2)).toBe(true);
    });

    it('should not be equal to another email with different value', () => {
      const email1 = new Email('test@example.com');
      const email2 = new Email('other@example.com');
      
      expect(email1.equals(email2)).toBe(false);
    });

    it('should not be equal to non-email object', () => {
      const email = new Email('test@example.com');
      const other = { value: 'test@example.com' };
      
      expect(email.equals(other as any)).toBe(false);
    });
  });

  describe('String representation', () => {
    it('should return email value when converted to string', () => {
      const email = new Email('test@example.com');
      expect(email.toString()).toBe('test@example.com');
    });
  });

  describe('Case sensitivity', () => {
    it('should treat emails as case insensitive for equality', () => {
      const email1 = new Email('Test@Example.COM');
      const email2 = new Email('test@example.com');
      
      expect(email1.equals(email2)).toBe(true);
    });

    it('should normalize email to lowercase', () => {
      const email = new Email('Test@Example.COM');
      expect(email.value).toBe('test@example.com');
    });
  });
});
