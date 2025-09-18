import { Business } from './business.entity';

describe('Business Entity', () => {
  describe('create', () => {
    it('should create a valid hotel business', () => {
      // Arrange
      const businessData = {
        name: 'Hotel Paradise',
        type: 'HOTEL' as const,
        description: 'Luxury hotel in the city center',
        address: '123 Main St, City',
        phone: '+1234567890',
        email: 'info@hotelparadise.com',
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
        address: '456 Food Ave, City',
        phone: '+1234567891',
        email: 'info@restaurantdeluxe.com',
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
        address: '123 Main St',
        phone: '+1234567890',
        email: 'test@hotel.com',
        ownerId: 'owner-123',
      };

      // Act & Assert
      expect(() => Business.create(businessData)).toThrow('Business name is required');
    });

    it('should throw error for invalid email', () => {
      // Arrange
      const businessData = {
        name: 'Test Hotel',
        type: 'HOTEL' as const,
        description: 'Test hotel',
        address: '123 Main St',
        phone: '+1234567890',
        email: 'invalid-email',
        ownerId: 'owner-123',
      };

      // Act & Assert
      expect(() => Business.create(businessData)).toThrow('Invalid email format');
    });

    it('should throw error for invalid phone', () => {
      // Arrange
      const businessData = {
        name: 'Test Hotel',
        type: 'HOTEL' as const,
        description: 'Test hotel',
        address: '123 Main St',
        phone: 'invalid-phone',
        email: 'test@hotel.com',
        ownerId: 'owner-123',
      };

      // Act & Assert
      expect(() => Business.create(businessData)).toThrow('Invalid phone format');
    });
  });

  describe('update', () => {
    it('should update business information', () => {
      // Arrange
      const business = Business.create({
        name: 'Old Hotel',
        type: 'HOTEL' as const,
        description: 'Old description',
        address: 'Old Address',
        phone: '+1234567890',
        email: 'old@hotel.com',
        ownerId: 'owner-123',
      });

      // Act
      business.updateInfo({
        name: 'New Hotel',
        description: 'New description',
        address: 'New Address',
      });

      // Assert
      expect(business.name).toBe('New Hotel');
      expect(business.description).toBe('New description');
      expect(business.address).toBe('New Address');
      expect(business.updatedAt).toBeDefined();
    });
  });
});
