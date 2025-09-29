import { RoomService } from '../../../../src/hotel/application/services/room.service';
import { BusinessRepository } from '../../../../src/shared/application/repositories/business.repository';
import { RoomRepository } from '../../../../src/hotel/application/repositories/room.repository';
import { ReservationRepository } from '../../../../src/shared/application/repositories/reservation.repository';
import { Business } from '../../../../src/shared/domain/entities/business.entity';
import { Room, RoomType } from '../../../../src/hotel/domain/entities/room.entity';
import { Reservation } from '../../../../src/shared/domain/entities/reservation.entity';
import { Money } from '../../../../src/shared/domain/value-objects/money';
import { Email } from '../../../../src/shared/domain/value-objects/email';
import { PhoneNumber } from '../../../../src/shared/domain/value-objects/phone-number';
import { Address } from '../../../../src/shared/domain/value-objects/address';

describe('RoomService', () => {
  let roomService: RoomService;
  let businessRepository: jest.Mocked<BusinessRepository>;
  let roomRepository: jest.Mocked<RoomRepository>;
  let reservationRepository: jest.Mocked<ReservationRepository>;

  // Helper functions
  const createTestBusiness = (overrides: Partial<{
    name: string;
    type: 'HOTEL' | 'RESTAURANT';
    email: string;
    phone: string;
    ownerId: string;
  }> = {}) => {
    const defaults = {
      name: 'Test Hotel',
      type: 'HOTEL' as const,
      email: 'hotel@test.com',
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
    currency: string;
    isActive: boolean;
  }> = {}) => {
    const defaults = {
      businessId: 'business-123',
      number: '101',
      type: RoomType.DOUBLE as const,
      capacity: 2,
      price: 150,
      currency: 'USD',
      isActive: true
    };
    const data = { ...defaults, ...overrides };
    
    return Room.create({
      businessId: data.businessId,
      number: data.number,
      type: data.type,
      capacity: data.capacity,
      price: new Money(data.price, data.currency),
      isActive: data.isActive
    });
  };

  beforeEach(() => {
    // Create mock repositories
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

    // Create service instance
    roomService = new RoomService(
      businessRepository,
      roomRepository,
      reservationRepository
    );
  });

  describe('createRoom', () => {
    it('should create a room successfully', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'HOTEL', name: 'Test Hotel' });
      const roomData = {
        businessId: business.id,
        number: '101',
        type: RoomType.DOUBLE as const,
        capacity: 2,
        price: new Money(150, 'USD'),
        description: 'Comfortable double room'
      };

      businessRepository.findById.mockResolvedValue(business);
      roomRepository.findByNumber.mockResolvedValue(null);
      roomRepository.save.mockImplementation((room) => Promise.resolve(room));

      // Act
      const result = await roomService.createRoom(roomData);

      // Assert
      expect(result).toBeInstanceOf(Room);
      expect(result.businessId).toBe(business.id);
      expect(result.number).toBe('101');
      expect(result.type).toBe(RoomType.DOUBLE);
      expect(result.capacity).toBe(2);
      expect(result.price.amount).toBe(150);
      expect(result.isActive).toBe(true);
      expect(roomRepository.save).toHaveBeenCalledWith(expect.any(Room));
    });

    it('should throw error when business not found', async () => {
      // Arrange
      const roomData = {
        businessId: 'non-existent-business',
        number: '101',
        type: RoomType.DOUBLE as const,
        capacity: 2,
        price: new Money(150, 'USD')
      };

      businessRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(roomService.createRoom(roomData))
        .rejects.toThrow('Business not found');
    });

    it('should throw error when business is not a hotel', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'RESTAURANT' });
      const roomData = {
        businessId: business.id,
        number: '101',
        type: RoomType.DOUBLE as const,
        capacity: 2,
        price: new Money(150, 'USD')
      };

      businessRepository.findById.mockResolvedValue(business);

      // Act & Assert
      await expect(roomService.createRoom(roomData))
        .rejects.toThrow('Business is not a hotel');
    });

    it('should throw error when room number already exists', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'HOTEL' });
      const existingRoom = createTestRoom({ businessId: business.id, number: '101' });
      const roomData = {
        businessId: business.id,
        number: '101',
        type: RoomType.SINGLE,
        capacity: 1,
        price: new Money(100, 'USD')
      };

      businessRepository.findById.mockResolvedValue(business);
      roomRepository.findByNumber.mockResolvedValue(existingRoom);

      // Act & Assert
      await expect(roomService.createRoom(roomData))
        .rejects.toThrow('Room number already exists for this business');
    });
  });

  describe('updateRoom', () => {
    it('should update room successfully', async () => {
      // Arrange
      const room = createTestRoom({
        businessId: 'business-123',
        number: '101',
        price: 150
      });

      const updateData = {
        price: new Money(200, 'USD'),
        capacity: 3,
        description: 'Updated room description'
      };

      roomRepository.findById.mockResolvedValue(room);
      roomRepository.update.mockResolvedValue(room);

      // Act
      const result = await roomService.updateRoom(room.id, updateData);

      // Assert
      expect(result).toBeInstanceOf(Room);
      expect(roomRepository.update).toHaveBeenCalledWith(room.id, updateData);
    });

    it('should throw error when room not found', async () => {
      // Arrange
      const updateData = {
        price: new Money(200, 'USD')
      };

      roomRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(roomService.updateRoom('non-existent-id', updateData))
        .rejects.toThrow('Room not found');
    });
  });

  describe('activateRoom', () => {
    it('should activate room successfully', async () => {
      // Arrange
      const room = createTestRoom({
        businessId: 'business-123',
        number: '101',
        isActive: false
      });

      roomRepository.findById.mockResolvedValue(room);
      roomRepository.update.mockResolvedValue(room);

      // Act
      const result = await roomService.activateRoom(room.id);

      // Assert
      expect(result).toBeInstanceOf(Room);
      expect(roomRepository.update).toHaveBeenCalledWith(room.id, { isActive: true });
    });

    it('should throw error when room not found', async () => {
      // Arrange
      roomRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(roomService.activateRoom('non-existent-id'))
        .rejects.toThrow('Room not found');
    });
  });

  describe('deactivateRoom', () => {
    it('should deactivate room successfully', async () => {
      // Arrange
      const room = createTestRoom({
        businessId: 'business-123',
        number: '101',
        isActive: true
      });

      roomRepository.findById.mockResolvedValue(room);
      roomRepository.update.mockResolvedValue(room);

      // Act
      const result = await roomService.deactivateRoom(room.id);

      // Assert
      expect(result).toBeInstanceOf(Room);
      expect(roomRepository.update).toHaveBeenCalledWith(room.id, { isActive: false });
    });

    it('should throw error when room not found', async () => {
      // Arrange
      roomRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(roomService.deactivateRoom('non-existent-id'))
        .rejects.toThrow('Room not found');
    });
  });

  describe('getRoomsByBusiness', () => {
    it('should return rooms for business successfully', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'HOTEL' });
      const rooms = [
        createTestRoom({ businessId: business.id, number: '101' }),
        createTestRoom({ businessId: business.id, number: '102' })
      ];

      businessRepository.findById.mockResolvedValue(business);
      roomRepository.findByBusinessId.mockResolvedValue(rooms);

      // Act
      const result = await roomService.getRoomsByBusiness(business.id);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Room);
      expect(result[1]).toBeInstanceOf(Room);
      expect(result[0].businessId).toBe(business.id);
      expect(result[1].businessId).toBe(business.id);
    });

    it('should throw error when business not found', async () => {
      // Arrange
      businessRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(roomService.getRoomsByBusiness('non-existent-business'))
        .rejects.toThrow('Business not found');
    });

    it('should throw error when business is not a hotel', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'RESTAURANT' });
      businessRepository.findById.mockResolvedValue(business);

      // Act & Assert
      await expect(roomService.getRoomsByBusiness(business.id))
        .rejects.toThrow('Business is not a hotel');
    });
  });

  describe('getAvailableRooms', () => {
    it('should return available rooms for date range', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'HOTEL' });
      const rooms = [
        createTestRoom({ businessId: business.id, number: '101' }),
        createTestRoom({ businessId: business.id, number: '102' })
      ];
      const startDate = new Date('2024-06-01T15:00:00');
      const endDate = new Date('2024-06-03T11:00:00');

      businessRepository.findById.mockResolvedValue(business);
      roomRepository.findByBusinessId.mockResolvedValue(rooms);
      reservationRepository.findOverlappingReservations.mockResolvedValue([]);

      // Act
      const result = await roomService.getAvailableRooms(business.id, startDate, endDate);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Room);
      expect(result[1]).toBeInstanceOf(Room);
    });

    it('should return empty array when no rooms available', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'HOTEL' });
      const rooms = [
        createTestRoom({ businessId: business.id, number: '101' })
      ];
      const existingReservation = Reservation.create({
        userId: 'user-123',
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
      roomRepository.findByBusinessId.mockResolvedValue(rooms);
      reservationRepository.findOverlappingReservations.mockResolvedValue([existingReservation]);

      // Act
      const result = await roomService.getAvailableRooms(business.id, startDate, endDate);

      // Assert
      expect(result).toHaveLength(0);
    });

    it('should throw error when business not found', async () => {
      // Arrange
      const startDate = new Date('2024-06-01T15:00:00');
      const endDate = new Date('2024-06-03T11:00:00');

      businessRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(roomService.getAvailableRooms('non-existent-business', startDate, endDate))
        .rejects.toThrow('Business not found');
    });
  });

  describe('getRoomsByType', () => {
    it('should return rooms by type successfully', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'HOTEL' });
      const rooms = [
        createTestRoom({ businessId: business.id, type: RoomType.SUITE, number: '501' }),
        createTestRoom({ businessId: business.id, type: RoomType.SUITE, number: '502' })
      ];

      businessRepository.findById.mockResolvedValue(business);
      roomRepository.findByType.mockResolvedValue(rooms);

      // Act
      const result = await roomService.getRoomsByType(business.id, RoomType.SUITE);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].type).toBe(RoomType.SUITE);
      expect(result[1].type).toBe(RoomType.SUITE);
    });

    it('should throw error when business not found', async () => {
      // Arrange
      businessRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(roomService.getRoomsByType('non-existent-business', RoomType.SUITE))
        .rejects.toThrow('Business not found');
    });
  });

  describe('getRoomsByCapacity', () => {
    it('should return rooms by minimum capacity successfully', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'HOTEL' });
      const rooms = [
        createTestRoom({ businessId: business.id, capacity: 4, number: '201' }),
        createTestRoom({ businessId: business.id, capacity: 6, number: '202' })
      ];

      businessRepository.findById.mockResolvedValue(business);
      roomRepository.findByCapacity.mockResolvedValue(rooms);

      // Act
      const result = await roomService.getRoomsByCapacity(business.id, 4);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].capacity).toBeGreaterThanOrEqual(4);
      expect(result[1].capacity).toBeGreaterThanOrEqual(4);
    });

    it('should throw error when business not found', async () => {
      // Arrange
      businessRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(roomService.getRoomsByCapacity('non-existent-business', 4))
        .rejects.toThrow('Business not found');
    });
  });

  describe('getRoomsByPriceRange', () => {
    it('should return rooms by price range successfully', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'HOTEL' });
      const rooms = [
        createTestRoom({ businessId: business.id, price: 150, number: '101' }),
        createTestRoom({ businessId: business.id, price: 200, number: '102' })
      ];
      const minPrice = new Money(100, 'USD');
      const maxPrice = new Money(250, 'USD');

      businessRepository.findById.mockResolvedValue(business);
      roomRepository.findByPriceRange.mockResolvedValue(rooms);

      // Act
      const result = await roomService.getRoomsByPriceRange(business.id, minPrice, maxPrice);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Room);
      expect(result[1]).toBeInstanceOf(Room);
    });

    it('should throw error when business not found', async () => {
      // Arrange
      const minPrice = new Money(100, 'USD');
      const maxPrice = new Money(250, 'USD');

      businessRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(roomService.getRoomsByPriceRange('non-existent-business', minPrice, maxPrice))
        .rejects.toThrow('Business not found');
    });
  });

  describe('deleteRoom', () => {
    it('should delete room successfully', async () => {
      // Arrange
      const room = createTestRoom({ businessId: 'business-123', number: '101' });

      roomRepository.findById.mockResolvedValue(room);
      roomRepository.delete.mockResolvedValue(true);

      // Act
      const result = await roomService.deleteRoom(room.id);

      // Assert
      expect(result).toBe(true);
      expect(roomRepository.delete).toHaveBeenCalledWith(room.id);
    });

    it('should throw error when room not found', async () => {
      // Arrange
      roomRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(roomService.deleteRoom('non-existent-id'))
        .rejects.toThrow('Room not found');
    });
  });

  describe('getRoomById', () => {
    it('should return room by id successfully', async () => {
      // Arrange
      const room = createTestRoom({ businessId: 'business-123', number: '101' });

      roomRepository.findById.mockResolvedValue(room);

      // Act
      const result = await roomService.getRoomById(room.id);

      // Assert
      expect(result).toBeInstanceOf(Room);
      expect(result.id).toBe(room.id);
    });

    it('should throw error when room not found', async () => {
      // Arrange
      roomRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(roomService.getRoomById('non-existent-id'))
        .rejects.toThrow('Room not found');
    });
  });

  describe('Business logic', () => {
    it('should handle room capacity validation', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'HOTEL' });
      const room = createTestRoom({
        businessId: business.id,
        capacity: 2,
        number: '101'
      });

      businessRepository.findById.mockResolvedValue(business);
      roomRepository.findByBusinessId.mockResolvedValue([room]);

      // Act
      const result = await roomService.getRoomsByBusiness(business.id);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].canAccommodate(2)).toBe(true);
      expect(result[0].canAccommodate(3)).toBe(false);
    });

    it('should handle room price calculations', async () => {
      // Arrange
      const room = createTestRoom({
        businessId: 'business-123',
        capacity: 4,
        price: 200
      });

      roomRepository.findById.mockResolvedValue(room);

      // Act
      const result = await roomService.getRoomById(room.id);

      // Assert
      expect(result).toBeInstanceOf(Room);
      expect(result.getPricePerGuest().amount).toBe(50); // 200 / 4
    });

    it('should handle room type display names', async () => {
      // Arrange
      const room = createTestRoom({
        businessId: 'business-123',
        type: RoomType.SUITE,
        number: '501'
      });

      roomRepository.findById.mockResolvedValue(room);

      // Act
      const result = await roomService.getRoomById(room.id);

      // Assert
      expect(result).toBeInstanceOf(Room);
      expect(result.getTypeDisplayName()).toBe('Suite');
    });
  });
});
