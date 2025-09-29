import { ReservationService } from '../../../../src/shared/application/services/reservation.service';
import { Email } from '../../../../src/shared/domain/value-objects/email';
import { TableLocation } from '../../../../src/restaurant/domain/entities/table.entity';
import { UserRepository } from '../../../../src/shared/application/repositories/user.repository';
import { BusinessRepository } from '../../../../src/shared/application/repositories/business.repository';
import { ReservationRepository } from '../../../../src/shared/application/repositories/reservation.repository';
import { RoomRepository } from '../../../../src/hotel/application/repositories/room.repository';
import { TableRepository } from '../../../../src/restaurant/application/repositories/table.repository';
import { User } from '../../../../src/shared/domain/entities/user.entity';
import { Business } from '../../../../src/shared/domain/entities/business.entity';
import { Reservation } from '../../../../src/shared/domain/entities/reservation.entity';
import { Room, RoomType } from '../../../../src/hotel/domain/entities/room.entity';
import { Table } from '../../../../src/restaurant/domain/entities/table.entity';
import { Money } from '../../../../src/shared/domain/value-objects/money';
import { PhoneNumber } from '../../../../src/shared/domain/value-objects/phone-number';
import { Address } from '../../../../src/shared/domain/value-objects/address';

describe('ReservationService', () => {
  let reservationService: ReservationService;
  let userRepository: jest.Mocked<UserRepository>;
  let businessRepository: jest.Mocked<BusinessRepository>;
  let reservationRepository: jest.Mocked<ReservationRepository>;
  let roomRepository: jest.Mocked<RoomRepository>;
  let tableRepository: jest.Mocked<TableRepository>;

  // Helper functions
  const createTestUser = (overrides: Partial<{
    email: string;
    password: string;
    role: 'CUSTOMER' | 'BUSINESS_OWNER' | 'ADMIN';
  }> = {}) => {
    const defaults = {
      email: 'user@test.com',
      password: 'password123',
      role: 'CUSTOMER' as const
    };
    const data = { ...defaults, ...overrides };
    return User.create({
      name: 'Test User',
      email: new Email(data.email),
      password: data.password,
      role: data.role
    });
  };

  const createTestBusiness = (overrides: Partial<{
    name: string;
    type: 'HOTEL' | 'RESTAURANT';
    email: string;
    phone: string;
    ownerId: string;
  }> = {}) => {
    const defaults = {
      name: 'Test Business',
      type: 'HOTEL' as const,
      email: 'business@test.com',
      phone: '+1234567890',
      ownerId: 'owner-123'
    };
    const data = { ...defaults, ...overrides };
    
    return Business.create({
      name: data.name,
      type: data.type,
      address: new Address({
        street: '123 Main St',
        city: 'Test City',
        state: 'CA',
        zipCode: '12345',
        country: 'USA'
      }),
      email: new Email(data.email),
      phone: new PhoneNumber(data.phone),
      ownerId: data.ownerId
    });
  };

  const createTestRoom = (overrides: Partial<{
    businessId: string;
    number: string;
    type: RoomType;
    capacity: number;
    price: number;
  }> = {}) => {
    const defaults = {
      businessId: 'business-123',
      number: '101',
      type: RoomType.DOUBLE as const,
      capacity: 2,
      price: 150
    };
    const data = { ...defaults, ...overrides };
    
    return Room.create({
      businessId: data.businessId,
      number: data.number,
      type: data.type,
      capacity: data.capacity,
      price: new Money(data.price, 'USD'),
      isActive: true
    });
  };

  const createTestTable = (overrides: Partial<{
    businessId: string;
    number: string;
    capacity: number;
    location: TableLocation.INDOOR | TableLocation.OUTDOOR | TableLocation.PATIO | TableLocation.BAR;
  }> = {}) => {
    const defaults = {
      businessId: 'business-123',
      number: 'T1',
      capacity: 4,
      location: TableLocation.INDOOR as const
    };
    const data = { ...defaults, ...overrides };
    
    return Table.create({
      businessId: data.businessId,
      number: data.number,
      capacity: data.capacity,
      location: data.location,
      isActive: true
    });
  };

  beforeEach(() => {
    // Create mock repositories
    userRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn()
    };

    businessRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByOwnerId: jest.fn(),
      findByType: jest.fn(),
      findByLocation: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn()
    };

    reservationRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findByBusinessId: jest.fn(),
      findByDateRange: jest.fn(),
      findByStatus: jest.fn(),
      findByType: jest.fn(),
      findOverlappingReservations: jest.fn(),
      findActiveReservations: jest.fn(),
      findUpcomingReservations: jest.fn(),
      countByStatus: jest.fn(),
      countByBusinessId: jest.fn(),
      getRevenueByBusinessId: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn()
    };

    roomRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByBusinessId: jest.fn(),
      findByNumber: jest.fn(),
      findByType: jest.fn(),
      findByCapacity: jest.fn(),
      findAvailableRooms: jest.fn(),
      findByPriceRange: jest.fn(),
      findActiveRooms: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn()
    };

    tableRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByBusinessId: jest.fn(),
      findByNumber: jest.fn(),
      findByLocation: jest.fn(),
      findByCapacity: jest.fn(),
      findAvailableTables: jest.fn(),
      findActiveTables: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn()
    };

    // Create service instance
    reservationService = new ReservationService(
      userRepository,
      businessRepository,
      reservationRepository,
      roomRepository,
      tableRepository
    );
  });

  describe('createHotelReservation', () => {
    it('should create a hotel reservation successfully', async () => {
      // Arrange
      const user = createTestUser({ email: 'customer@test.com' });
      const business = createTestBusiness({ type: 'HOTEL', name: 'Test Hotel' });
      const room = createTestRoom({ businessId: business.id, number: '101' });
      
      const reservationData = {
        userId: user.id,
        businessId: business.id,
        startDate: new Date('2024-06-01T15:00:00'),
        endDate: new Date('2024-06-03T11:00:00'),
        guests: 2,
        totalAmount: new Money(300, 'USD'),
        notes: 'Anniversary trip'
      };

      // Mock repository responses
      userRepository.findById.mockResolvedValue(user);
      businessRepository.findById.mockResolvedValue(business);
      roomRepository.findByBusinessId.mockResolvedValue([room]);
      reservationRepository.findOverlappingReservations.mockResolvedValue([]);
      reservationRepository.save.mockImplementation((reservation) => Promise.resolve(reservation));

      // Act
      const result = await reservationService.createHotelReservation(reservationData);

      // Assert
      expect(result).toBeInstanceOf(Reservation);
      expect(result.type).toBe('HOTEL');
      expect(result.userId).toBe(user.id);
      expect(result.businessId).toBe(business.id);
      expect(result.guests).toBe(2);
      expect(result.totalAmount.amount).toBe(300);
      expect(result.status).toBe('PENDING');
      expect(reservationRepository.save).toHaveBeenCalledWith(expect.any(Reservation));
    });

    it('should throw error when user not found', async () => {
      // Arrange
      const reservationData = {
        userId: 'non-existent-user',
        businessId: 'business-123',
        startDate: new Date('2024-06-01T15:00:00'),
        endDate: new Date('2024-06-03T11:00:00'),
        guests: 2,
        totalAmount: new Money(300, 'USD')
      };

      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(reservationService.createHotelReservation(reservationData))
        .rejects.toThrow('User not found');
    });

    it('should throw error when business not found', async () => {
      // Arrange
      const user = createTestUser();
      const reservationData = {
        userId: user.id,
        businessId: 'non-existent-business',
        startDate: new Date('2024-06-01T15:00:00'),
        endDate: new Date('2024-06-03T11:00:00'),
        guests: 2,
        totalAmount: new Money(300, 'USD')
      };

      userRepository.findById.mockResolvedValue(user);
      businessRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(reservationService.createHotelReservation(reservationData))
        .rejects.toThrow('Business not found');
    });

    it('should throw error when business is not a hotel', async () => {
      // Arrange
      const user = createTestUser();
      const business = createTestBusiness({ type: 'RESTAURANT' });
      const reservationData = {
        userId: user.id,
        businessId: business.id,
        startDate: new Date('2024-06-01T15:00:00'),
        endDate: new Date('2024-06-03T11:00:00'),
        guests: 2,
        totalAmount: new Money(300, 'USD')
      };

      userRepository.findById.mockResolvedValue(user);
      businessRepository.findById.mockResolvedValue(business);

      // Act & Assert
      await expect(reservationService.createHotelReservation(reservationData))
        .rejects.toThrow('Business is not a hotel');
    });

    it('should throw error when no rooms available', async () => {
      // Arrange
      const user = createTestUser();
      const business = createTestBusiness({ type: 'HOTEL' });
      const reservationData = {
        userId: user.id,
        businessId: business.id,
        startDate: new Date('2024-06-01T15:00:00'),
        endDate: new Date('2024-06-03T11:00:00'),
        guests: 2,
        totalAmount: new Money(300, 'USD')
      };

      userRepository.findById.mockResolvedValue(user);
      businessRepository.findById.mockResolvedValue(business);
      roomRepository.findByBusinessId.mockResolvedValue([]);

      // Act & Assert
      await expect(reservationService.createHotelReservation(reservationData))
        .rejects.toThrow('No rooms available for this business');
    });

    it('should throw error when rooms are not available for the date range', async () => {
      // Arrange
      const user = createTestUser();
      const business = createTestBusiness({ type: 'HOTEL' });
      const room = createTestRoom({ businessId: business.id });
      const existingReservation = Reservation.create({
        userId: 'other-user',
        businessId: business.id,
        startDate: new Date('2024-06-01T15:00:00'),
        endDate: new Date('2024-06-03T11:00:00'),
        guests: 2,
        totalAmount: new Money(300, 'USD'),
        type: 'HOTEL'
      });

      const reservationData = {
        userId: user.id,
        businessId: business.id,
        startDate: new Date('2024-06-01T15:00:00'),
        endDate: new Date('2024-06-03T11:00:00'),
        guests: 2,
        totalAmount: new Money(300, 'USD')
      };

      userRepository.findById.mockResolvedValue(user);
      businessRepository.findById.mockResolvedValue(business);
      roomRepository.findByBusinessId.mockResolvedValue([room]);
      reservationRepository.findOverlappingReservations.mockResolvedValue([existingReservation]);

      // Act & Assert
      await expect(reservationService.createHotelReservation(reservationData))
        .rejects.toThrow('No rooms available for the selected date range');
    });
  });

  describe('createRestaurantReservation', () => {
    it('should create a restaurant reservation successfully', async () => {
      // Arrange
      const user = createTestUser({ email: 'customer@test.com' });
      const business = createTestBusiness({ type: 'RESTAURANT', name: 'Test Restaurant' });
      const table = createTestTable({ businessId: business.id, number: 'T1' });
      
      const reservationData = {
        userId: user.id,
        businessId: business.id,
        startDate: new Date('2024-06-01T19:00:00'),
        endDate: new Date('2024-06-01T21:00:00'),
        guests: 4,
        totalAmount: new Money(150, 'USD'),
        notes: 'Birthday dinner'
      };

      // Mock repository responses
      userRepository.findById.mockResolvedValue(user);
      businessRepository.findById.mockResolvedValue(business);
      tableRepository.findByBusinessId.mockResolvedValue([table]);
      reservationRepository.findOverlappingReservations.mockResolvedValue([]);
      reservationRepository.save.mockImplementation((reservation) => Promise.resolve(reservation));

      // Act
      const result = await reservationService.createRestaurantReservation(reservationData);

      // Assert
      expect(result).toBeInstanceOf(Reservation);
      expect(result.type).toBe('RESTAURANT');
      expect(result.userId).toBe(user.id);
      expect(result.businessId).toBe(business.id);
      expect(result.guests).toBe(4);
      expect(result.totalAmount.amount).toBe(150);
      expect(result.status).toBe('PENDING');
      expect(reservationRepository.save).toHaveBeenCalledWith(expect.any(Reservation));
    });

    it('should throw error when business is not a restaurant', async () => {
      // Arrange
      const user = createTestUser();
      const business = createTestBusiness({ type: 'HOTEL' });
      const reservationData = {
        userId: user.id,
        businessId: business.id,
        startDate: new Date('2024-06-01T19:00:00'),
        endDate: new Date('2024-06-01T21:00:00'),
        guests: 4,
        totalAmount: new Money(150, 'USD')
      };

      userRepository.findById.mockResolvedValue(user);
      businessRepository.findById.mockResolvedValue(business);

      // Act & Assert
      await expect(reservationService.createRestaurantReservation(reservationData))
        .rejects.toThrow('Business is not a restaurant');
    });

    it('should throw error when no tables available', async () => {
      // Arrange
      const user = createTestUser();
      const business = createTestBusiness({ type: 'RESTAURANT' });
      const reservationData = {
        userId: user.id,
        businessId: business.id,
        startDate: new Date('2024-06-01T19:00:00'),
        endDate: new Date('2024-06-01T21:00:00'),
        guests: 4,
        totalAmount: new Money(150, 'USD')
      };

      userRepository.findById.mockResolvedValue(user);
      businessRepository.findById.mockResolvedValue(business);
      tableRepository.findByBusinessId.mockResolvedValue([]);

      // Act & Assert
      await expect(reservationService.createRestaurantReservation(reservationData))
        .rejects.toThrow('No tables available for this business');
    });
  });

  describe('confirmReservation', () => {
    it('should confirm a pending reservation successfully', async () => {
      // Arrange
      const reservation = Reservation.create({
        userId: 'user-123',
        businessId: 'business-123',
        startDate: new Date('2024-06-01T15:00:00'),
        endDate: new Date('2024-06-03T11:00:00'),
        guests: 2,
        totalAmount: new Money(300, 'USD'),
        type: 'HOTEL',
        status: 'PENDING'
      });

      reservationRepository.findById.mockResolvedValue(reservation);
      reservationRepository.update.mockResolvedValue(reservation);

      // Act
      const result = await reservationService.confirmReservation(reservation.id);

      // Assert
      expect(result).toBeInstanceOf(Reservation);
      expect(result.status).toBe('CONFIRMED');
      expect(reservationRepository.update).toHaveBeenCalledWith(reservation.id, {
        status: 'CONFIRMED'
      });
    });

    it('should throw error when reservation not found', async () => {
      // Arrange
      reservationRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(reservationService.confirmReservation('non-existent-id'))
        .rejects.toThrow('Reservation not found');
    });

    it('should throw error when trying to confirm non-pending reservation', async () => {
      // Arrange
      const reservation = Reservation.create({
        userId: 'user-123',
        businessId: 'business-123',
        startDate: new Date('2024-06-01T15:00:00'),
        endDate: new Date('2024-06-03T11:00:00'),
        guests: 2,
        totalAmount: new Money(300, 'USD'),
        type: 'HOTEL',
        status: 'CONFIRMED'
      });

      reservationRepository.findById.mockResolvedValue(reservation);

      // Act & Assert
      await expect(reservationService.confirmReservation(reservation.id))
        .rejects.toThrow('Only pending reservations can be confirmed');
    });
  });

  describe('cancelReservation', () => {
    it('should cancel a reservation successfully', async () => {
      // Arrange
      const reservation = Reservation.create({
        userId: 'user-123',
        businessId: 'business-123',
        startDate: new Date('2024-06-01T15:00:00'),
        endDate: new Date('2024-06-03T11:00:00'),
        guests: 2,
        totalAmount: new Money(300, 'USD'),
        type: 'HOTEL',
        status: 'CONFIRMED'
      });

      reservationRepository.findById.mockResolvedValue(reservation);
      reservationRepository.update.mockResolvedValue(reservation);

      // Act
      const result = await reservationService.cancelReservation(reservation.id);

      // Assert
      expect(result).toBeInstanceOf(Reservation);
      expect(result.status).toBe('CANCELLED');
      expect(reservationRepository.update).toHaveBeenCalledWith(reservation.id, {
        status: 'CANCELLED'
      });
    });

    it('should throw error when trying to cancel completed reservation', async () => {
      // Arrange
      const reservation = Reservation.create({
        userId: 'user-123',
        businessId: 'business-123',
        startDate: new Date('2024-06-01T15:00:00'),
        endDate: new Date('2024-06-03T11:00:00'),
        guests: 2,
        totalAmount: new Money(300, 'USD'),
        type: 'HOTEL',
        status: 'COMPLETED'
      });

      reservationRepository.findById.mockResolvedValue(reservation);

      // Act & Assert
      await expect(reservationService.cancelReservation(reservation.id))
        .rejects.toThrow('Completed reservations cannot be cancelled');
    });
  });

  describe('getUserReservations', () => {
    it('should return user reservations successfully', async () => {
      // Arrange
      const user = createTestUser();
      const reservations = [
        Reservation.create({
          userId: user.id,
          businessId: 'business-1',
          startDate: new Date('2024-06-01T15:00:00'),
          endDate: new Date('2024-06-03T11:00:00'),
          guests: 2,
          totalAmount: new Money(300, 'USD'),
          type: 'HOTEL'
        }),
        Reservation.create({
          userId: user.id,
          businessId: 'business-2',
          startDate: new Date('2024-06-15T19:00:00'),
          endDate: new Date('2024-06-15T21:00:00'),
          guests: 4,
          totalAmount: new Money(150, 'USD'),
          type: 'RESTAURANT'
        })
      ];

      userRepository.findById.mockResolvedValue(user);
      reservationRepository.findByUserId.mockResolvedValue(reservations);

      // Act
      const result = await reservationService.getUserReservations(user.id);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Reservation);
      expect(result[1]).toBeInstanceOf(Reservation);
      expect(result[0].userId).toBe(user.id);
      expect(result[1].userId).toBe(user.id);
    });

    it('should throw error when user not found', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(reservationService.getUserReservations('non-existent-user'))
        .rejects.toThrow('User not found');
    });
  });

  describe('getBusinessReservations', () => {
    it('should return business reservations successfully', async () => {
      // Arrange
      const business = createTestBusiness();
      const reservations = [
        Reservation.create({
          userId: 'user-1',
          businessId: business.id,
          startDate: new Date('2024-06-01T15:00:00'),
          endDate: new Date('2024-06-03T11:00:00'),
          guests: 2,
          totalAmount: new Money(300, 'USD'),
          type: 'HOTEL'
        })
      ];

      businessRepository.findById.mockResolvedValue(business);
      reservationRepository.findByBusinessId.mockResolvedValue(reservations);

      // Act
      const result = await reservationService.getBusinessReservations(business.id);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Reservation);
      expect(result[0].businessId).toBe(business.id);
    });

    it('should throw error when business not found', async () => {
      // Arrange
      businessRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(reservationService.getBusinessReservations('non-existent-business'))
        .rejects.toThrow('Business not found');
    });
  });

  describe('checkAvailability', () => {
    it('should check hotel room availability successfully', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'HOTEL' });
      const room = createTestRoom({ businessId: business.id });
      const startDate = new Date('2024-06-01T15:00:00');
      const endDate = new Date('2024-06-03T11:00:00');

      businessRepository.findById.mockResolvedValue(business);
      roomRepository.findByBusinessId.mockResolvedValue([room]);
      reservationRepository.findOverlappingReservations.mockResolvedValue([]);

      // Act
      const result = await reservationService.checkAvailability(business.id, startDate, endDate);

      // Assert
      expect(result.isAvailable).toBe(true);
      expect(result.availableRooms).toHaveLength(1);
      expect(result.availableRooms[0]).toBeInstanceOf(Room);
    });

    it('should check restaurant table availability successfully', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'RESTAURANT' });
      const table = createTestTable({ businessId: business.id });
      const startDate = new Date('2024-06-01T19:00:00');
      const endDate = new Date('2024-06-01T21:00:00');

      businessRepository.findById.mockResolvedValue(business);
      tableRepository.findByBusinessId.mockResolvedValue([table]);
      reservationRepository.findOverlappingReservations.mockResolvedValue([]);

      // Act
      const result = await reservationService.checkAvailability(business.id, startDate, endDate);

      // Assert
      expect(result.isAvailable).toBe(true);
      expect(result.availableTables).toHaveLength(1);
      expect(result.availableTables[0]).toBeInstanceOf(Table);
    });

    it('should return not available when rooms are booked', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'HOTEL' });
      const room = createTestRoom({ businessId: business.id });
      const existingReservation = Reservation.create({
        userId: 'other-user',
        businessId: business.id,
        startDate: new Date('2024-06-01T15:00:00'),
        endDate: new Date('2024-06-03T11:00:00'),
        guests: 2,
        totalAmount: new Money(300, 'USD'),
        type: 'HOTEL'
      });
      const startDate = new Date('2024-06-01T15:00:00');
      const endDate = new Date('2024-06-03T11:00:00');

      businessRepository.findById.mockResolvedValue(business);
      roomRepository.findByBusinessId.mockResolvedValue([room]);
      reservationRepository.findOverlappingReservations.mockResolvedValue([existingReservation]);

      // Act
      const result = await reservationService.checkAvailability(business.id, startDate, endDate);

      // Assert
      expect(result.isAvailable).toBe(false);
      expect(result.availableRooms).toHaveLength(0);
    });
  });
});
