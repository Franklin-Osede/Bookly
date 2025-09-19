import { Business } from '../../../../src/shared/domain/entities/business.entity';
import { Address } from '../../../../src/shared/domain/value-objects/address';
import { PhoneNumber } from '../../../../src/shared/domain/value-objects/phone-number';
import { Email } from '../../../../src/shared/domain/value-objects/email';

describe('Business Entity', () => {
  describe('create', () => {
    it('should create a valid hotel business', () => {
      // Arrange
      const businessData = {
        name: 'Hotel Paradise',
        type: 'HOTEL' as const,
        description: 'Luxury hotel in the city center',
        address: new Address({
          street: '123 Main St',
          city: 'City',
          state: 'State',
          zipCode: '12345',
          country: 'Country'
        }),
        phone: new PhoneNumber('+1234567890'),
        email: new Email('info@hotelparadise.com'),
        ownerId: 'owner-123',
      };

      // Act
      const business = Business.create(businessData);

      // Assert
      expect(business).toBeDefined();
      expect(business.name).toBe('Hotel Paradise');
      expect(business.type).toBe('HOTEL');
      expect(business.ownerId).toBe('owner-123');
      expect(business.id).toBeDefined();
      expect(business.createdAt).toBeDefined();
      expect(business.updatedAt).toBeDefined();
    });

    it('should create a valid restaurant business', () => {
      // Arrange
      const businessData = {
        name: 'Restaurant Deluxe',
        type: 'RESTAURANT' as const,
        description: 'Fine dining restaurant',
        address: new Address({
          street: '456 Food Ave',
          city: 'City',
          state: 'State',
          zipCode: '12345',
          country: 'Country'
        }),
        phone: new PhoneNumber('+1234567891'),
        email: new Email('info@restaurantdeluxe.com'),
        ownerId: 'owner-456',
      };

      // Act
      const business = Business.create(businessData);

      // Assert
      expect(business.type).toBe('RESTAURANT');
      expect(business.name).toBe('Restaurant Deluxe');
    });
  });

  describe('validation', () => {
    it('should throw error for empty name', () => {
      // Arrange
      const businessData = {
        name: '',
        type: 'HOTEL' as const,
        description: 'Test hotel',
        address: new Address({
          street: '123 Main St',
          city: 'City',
          state: 'State',
          zipCode: '12345',
          country: 'Country'
        }),
        phone: new PhoneNumber('+1234567890'),
        email: new Email('test@hotel.com'),
        ownerId: 'owner-123',
      };

      // Act & Assert
      expect(() => Business.create(businessData)).toThrow('Business name is required');
    });

    it('should throw error for invalid email', () => {
      // Act & Assert
      // The error is thrown in the Email constructor, not in Business.create
      expect(() => new Email('invalid-email')).toThrow('Invalid email format');
    });

    it('should throw error for invalid phone', () => {
      // Act & Assert
      // The error is thrown in the PhoneNumber constructor, not in Business.create
      expect(() => new PhoneNumber('invalid-phone')).toThrow('Phone number must include country code');
    });
  });

  describe('update', () => {
    it('should update business information', () => {
      // Arrange
      const business = Business.create({
        name: 'Old Hotel',
        type: 'HOTEL' as const,
        description: 'Old description',
        address: new Address({
          street: 'Old Address',
          city: 'City',
          state: 'State',
          zipCode: '12345',
          country: 'Country'
        }),
        phone: new PhoneNumber('+1234567890'),
        email: new Email('old@hotel.com'),
        ownerId: 'owner-123',
      });

      // Act
      business.updateInfo({
        name: 'New Hotel',
        description: 'New description',
        address: new Address({
          street: 'New Address',
          city: 'City',
          state: 'State',
          zipCode: '12345',
          country: 'Country'
        }),
      });

      // Assert
      expect(business.name).toBe('New Hotel');
      expect(business.description).toBe('New description');
      expect(business.address.street).toBe('New Address');
      expect(business.updatedAt).toBeDefined();
    });
  });
});
