import { Reservation } from '../../../../src/shared/domain/entities/reservation.entity';

describe('Reservation Entity', () => {
  describe('create', () => {
    it('should create a valid hotel reservation', () => {
      // Arrange
      const reservationData = {
        businessId: 'business-123',
        customerId: 'customer-456',
        type: 'HOTEL' as const,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-17'),
        guests: 2,
        totalAmount: 200.00,
        notes: 'Anniversary trip',
      };

      // Act
      const reservation = Reservation.create(reservationData);

      // Assert
      expect(reservation).toBeDefined();
      expect(reservation.businessId).toBe('business-123');
      expect(reservation.customerId).toBe('customer-456');
      expect(reservation.type).toBe('HOTEL');
      expect(reservation.status).toBe('PENDING');
      expect(reservation.guests).toBe(2);
      expect(reservation.totalAmount).toBe(200.00);
      expect(reservation.notes).toBe('Anniversary trip');
      expect(reservation.id).toBeDefined();
      expect(reservation.createdAt).toBeDefined();
      expect(reservation.updatedAt).toBeDefined();
    });

    it('should create a valid restaurant reservation', () => {
      // Arrange
      const reservationData = {
        businessId: 'restaurant-789',
        customerId: 'customer-456',
        type: 'RESTAURANT' as const,
        startDate: new Date('2024-01-15T19:00:00'),
        endDate: new Date('2024-01-15T21:00:00'),
        guests: 4,
        totalAmount: 150.00,
      };

      // Act
      const reservation = Reservation.create(reservationData);

      // Assert
      expect(reservation.type).toBe('RESTAURANT');
      expect(reservation.guests).toBe(4);
      expect(reservation.totalAmount).toBe(150.00);
    });
  });

  describe('validation', () => {
    it('should throw error for end date before start date', () => {
      // Arrange
      const reservationData = {
        businessId: 'business-123',
        customerId: 'customer-456',
        type: 'HOTEL' as const,
        startDate: new Date('2024-01-17'),
        endDate: new Date('2024-01-15'),
        guests: 2,
        totalAmount: 200.00,
      };

      // Act & Assert
      expect(() => Reservation.create(reservationData)).toThrow('End date must be after start date');
    });

    it('should throw error for zero or negative guests', () => {
      // Arrange
      const reservationData = {
        businessId: 'business-123',
        customerId: 'customer-456',
        type: 'HOTEL' as const,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-17'),
        guests: 0,
        totalAmount: 200.00,
      };

      // Act & Assert
      expect(() => Reservation.create(reservationData)).toThrow('Number of guests must be greater than 0');
    });

    it('should throw error for negative total amount', () => {
      // Arrange
      const reservationData = {
        businessId: 'business-123',
        customerId: 'customer-456',
        type: 'HOTEL' as const,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-17'),
        guests: 2,
        totalAmount: -100.00,
      };

      // Act & Assert
      expect(() => Reservation.create(reservationData)).toThrow('Total amount must be greater than 0');
    });

    it('should throw error for invalid reservation type', () => {
      // Arrange
      const reservationData = {
        businessId: 'business-123',
        customerId: 'customer-456',
        type: 'INVALID_TYPE' as any,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-17'),
        guests: 2,
        totalAmount: 200.00,
      };

      // Act & Assert
      expect(() => Reservation.create(reservationData)).toThrow('Invalid reservation type');
    });
  });

  describe('status management', () => {
    it('should confirm a pending reservation', () => {
      // Arrange
      const reservation = Reservation.create({
        businessId: 'business-123',
        customerId: 'customer-456',
        type: 'HOTEL' as const,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-17'),
        guests: 2,
        totalAmount: 200.00,
      });

      // Act
      reservation.confirm();

      // Assert
      expect(reservation.status).toBe('CONFIRMED');
      expect(reservation.updatedAt).toBeDefined();
    });

    it('should cancel a reservation', () => {
      // Arrange
      const reservation = Reservation.create({
        businessId: 'business-123',
        customerId: 'customer-456',
        type: 'HOTEL' as const,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-17'),
        guests: 2,
        totalAmount: 200.00,
      });

      // Act
      reservation.cancel();

      // Assert
      expect(reservation.status).toBe('CANCELLED');
      expect(reservation.updatedAt).toBeDefined();
    });

    it('should complete a confirmed reservation', () => {
      // Arrange
      const reservation = Reservation.create({
        businessId: 'business-123',
        customerId: 'customer-456',
        type: 'HOTEL' as const,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-17'),
        guests: 2,
        totalAmount: 200.00,
      });
      reservation.confirm();

      // Act
      reservation.complete();

      // Assert
      expect(reservation.status).toBe('COMPLETED');
      expect(reservation.updatedAt).toBeDefined();
    });

    it('should not allow completing a non-confirmed reservation', () => {
      // Arrange
      const reservation = Reservation.create({
        businessId: 'business-123',
        customerId: 'customer-456',
        type: 'HOTEL' as const,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-17'),
        guests: 2,
        totalAmount: 200.00,
      });

      // Act & Assert
      expect(() => reservation.complete()).toThrow('Only confirmed reservations can be completed');
    });
  });

  describe('business logic', () => {
    it('should calculate duration in days for hotel reservation', () => {
      // Arrange
      const reservation = Reservation.create({
        businessId: 'business-123',
        customerId: 'customer-456',
        type: 'HOTEL' as const,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-17'),
        guests: 2,
        totalAmount: 200.00,
      });

      // Act
      const duration = reservation.getDurationInDays();

      // Assert
      expect(duration).toBe(2);
    });

    it('should calculate duration in hours for restaurant reservation', () => {
      // Arrange
      const reservation = Reservation.create({
        businessId: 'restaurant-789',
        customerId: 'customer-456',
        type: 'RESTAURANT' as const,
        startDate: new Date('2024-01-15T19:00:00'),
        endDate: new Date('2024-01-15T21:00:00'),
        guests: 4,
        totalAmount: 150.00,
      });

      // Act
      const duration = reservation.getDurationInHours();

      // Assert
      expect(duration).toBe(2);
    });

    it('should check if reservation is active', () => {
      // Arrange
      const reservation = Reservation.create({
        businessId: 'business-123',
        customerId: 'customer-456',
        type: 'HOTEL' as const,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-17'),
        guests: 2,
        totalAmount: 200.00,
      });

      // Act & Assert
      expect(reservation.isActive()).toBe(true);
      
      reservation.cancel();
      expect(reservation.isActive()).toBe(false);
    });
  });
});
