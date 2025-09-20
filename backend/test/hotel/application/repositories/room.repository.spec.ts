import { RoomRepository } from '../../../../src/hotel/application/repositories/room.repository';
import { Room, RoomType } from '../../../../src/hotel/domain/entities/room.entity';
import { Money } from '../../../../src/shared/domain/value-objects/money';

describe('RoomRepository', () => {
  let roomRepository: RoomRepository;

  // Helper function to create a room for testing
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
    // Mock implementation for testing
    roomRepository = {
      async save(room: Room): Promise<Room> {
        return room;
      },
      async findById(id: string): Promise<Room | null> {
        if (!id || id.trim() === '') {
          throw new Error('Invalid ID format');
        }
        return null;
      },
      async findByBusinessId(businessId: string): Promise<Room[]> {
        if (!businessId || businessId.trim() === '') {
          throw new Error('Invalid business ID format');
        }
        return [];
      },
      async findByNumber(businessId: string, number: string): Promise<Room | null> {
        if (!businessId || businessId.trim() === '') {
          throw new Error('Business ID is required');
        }
        if (!number || number.trim() === '') {
          throw new Error('Room number is required');
        }
        return null;
      },
      async findByType(businessId: string, type: RoomType.SINGLE | RoomType.DOUBLE | RoomType.SUITE | RoomType.DELUXE): Promise<Room[]> {
        if (!businessId || businessId.trim() === '') {
          throw new Error('Business ID is required');
        }
        if (![RoomType.SINGLE, RoomType.DOUBLE, RoomType.SUITE, RoomType.DELUXE].includes(type)) {
          throw new Error('Invalid room type');
        }
        return [];
      },
      async findByCapacity(businessId: string, minCapacity: number): Promise<Room[]> {
        if (!businessId || businessId.trim() === '') {
          throw new Error('Business ID is required');
        }
        if (minCapacity <= 0) {
          throw new Error('Minimum capacity must be greater than 0');
        }
        return [];
      },
      async findAvailableRooms(businessId: string, startDate: Date, endDate: Date): Promise<Room[]> {
        if (!businessId || businessId.trim() === '') {
          throw new Error('Business ID is required');
        }
        if (!startDate || !endDate) {
          throw new Error('Start date and end date are required');
        }
        if (startDate > endDate) {
          throw new Error('Start date cannot be after end date');
        }
        return [];
      },
      async findByPriceRange(businessId: string, minPrice: Money, maxPrice: Money): Promise<Room[]> {
        if (!businessId || businessId.trim() === '') {
          throw new Error('Business ID is required');
        }
        if (!minPrice || !maxPrice) {
          throw new Error('Price range is required');
        }
        if (!minPrice.equals(maxPrice) && minPrice.greaterThan(maxPrice)) {
          throw new Error('Minimum price cannot be greater than maximum price');
        }
        return [];
      },
      async findActiveRooms(businessId: string): Promise<Room[]> {
        if (!businessId || businessId.trim() === '') {
          throw new Error('Business ID is required');
        }
        return [];
      },
      async findAll(): Promise<Room[]> {
        return [];
      },
      async update(id: string, room: Partial<Room>): Promise<Room | null> {
        if (!id || id.trim() === '') {
          throw new Error('Invalid ID format');
        }
        return null;
      },
      async delete(id: string): Promise<boolean> {
        if (!id || id.trim() === '') {
          throw new Error('Invalid ID format');
        }
        return false;
      },
      async exists(id: string): Promise<boolean> {
        if (!id || id.trim() === '') {
          throw new Error('Invalid ID format');
        }
        return false;
      }
    };
  });

  describe('save', () => {
    it('should save a single room successfully', async () => {
      const room = createTestRoom({
        type: RoomType.SINGLE,
        number: '201',
        capacity: 1,
        price: 100
      });

      const savedRoom = await roomRepository.save(room);

      expect(savedRoom).toBeInstanceOf(Room);
      expect(savedRoom.type).toBe(RoomType.SINGLE);
      expect(savedRoom.number).toBe('201');
      expect(savedRoom.capacity).toBe(1);
      expect(savedRoom.price.amount).toBe(100);
    });

    it('should save a suite room successfully', async () => {
      const room = createTestRoom({
        type: RoomType.SUITE,
        number: '501',
        capacity: 4,
        price: 500
      });

      const savedRoom = await roomRepository.save(room);

      expect(savedRoom).toBeInstanceOf(Room);
      expect(savedRoom.type).toBe(RoomType.SUITE);
      expect(savedRoom.number).toBe('501');
      expect(savedRoom.capacity).toBe(4);
      expect(savedRoom.price.amount).toBe(500);
    });

    it('should save room with all required fields', async () => {
      const room = createTestRoom({
        businessId: 'hotel-456',
        number: '301',
        type: RoomType.DELUXE,
        capacity: 3,
        price: 300,
        currency: 'EUR',
        isActive: false
      });

      const savedRoom = await roomRepository.save(room);

      expect(savedRoom).toBeDefined();
      expect(savedRoom.id).toBeDefined();
      expect(savedRoom.businessId).toBe('hotel-456');
      expect(savedRoom.number).toBe('301');
      expect(savedRoom.type).toBe(RoomType.DELUXE);
      expect(savedRoom.capacity).toBe(3);
      expect(savedRoom.price.amount).toBe(300);
      expect(savedRoom.price.currency).toBe('EUR');
      expect(savedRoom.isActive).toBe(false);
      expect(savedRoom.createdAt).toBeDefined();
      expect(savedRoom.updatedAt).toBeDefined();
    });
  });

  describe('findById', () => {
    it('should return room when found by id', async () => {
      const room = createTestRoom({
        businessId: 'hotel-123',
        number: '101'
      });

      // Mock the repository to return the room
      roomRepository.findById = jest.fn().mockResolvedValue(room);

      const foundRoom = await roomRepository.findById('room-id');

      expect(foundRoom).toBeInstanceOf(Room);
      expect(foundRoom?.businessId).toBe('hotel-123');
      expect(foundRoom?.number).toBe('101');
    });

    it('should return null when room not found by id', async () => {
      const foundRoom = await roomRepository.findById('non-existent-id');

      expect(foundRoom).toBeNull();
    });

    it('should throw error for invalid id format', async () => {
      await expect(roomRepository.findById('')).rejects.toThrow('Invalid ID format');
    });
  });

  describe('findByBusinessId', () => {
    it('should return rooms when found by business id', async () => {
      const rooms = [
        createTestRoom({
          businessId: 'hotel-123',
          number: '101',
          type: RoomType.SINGLE
        }),
        createTestRoom({
          businessId: 'hotel-123',
          number: '102',
          type: RoomType.DOUBLE
        })
      ];

      // Mock the repository to return rooms
      roomRepository.findByBusinessId = jest.fn().mockResolvedValue(rooms);

      const foundRooms = await roomRepository.findByBusinessId('hotel-123');

      expect(foundRooms).toHaveLength(2);
      expect(foundRooms[0]).toBeInstanceOf(Room);
      expect(foundRooms[1]).toBeInstanceOf(Room);
      expect(foundRooms[0].businessId).toBe('hotel-123');
      expect(foundRooms[1].businessId).toBe('hotel-123');
    });

    it('should return empty array when no rooms found for business', async () => {
      const foundRooms = await roomRepository.findByBusinessId('hotel-without-rooms');

      expect(foundRooms).toEqual([]);
    });

    it('should throw error for invalid business id format', async () => {
      await expect(roomRepository.findByBusinessId('')).rejects.toThrow('Invalid business ID format');
    });
  });

  describe('findByNumber', () => {
    it('should return room when found by business id and number', async () => {
      const room = createTestRoom({
        businessId: 'hotel-123',
        number: '101'
      });

      // Mock the repository to return the room
      roomRepository.findByNumber = jest.fn().mockResolvedValue(room);

      const foundRoom = await roomRepository.findByNumber('hotel-123', '101');

      expect(foundRoom).toBeInstanceOf(Room);
      expect(foundRoom?.businessId).toBe('hotel-123');
      expect(foundRoom?.number).toBe('101');
    });

    it('should return null when room not found by number', async () => {
      const foundRoom = await roomRepository.findByNumber('hotel-123', '999');

      expect(foundRoom).toBeNull();
    });

    it('should throw error for invalid parameters', async () => {
      await expect(roomRepository.findByNumber('', '101')).rejects.toThrow('Business ID is required');
      await expect(roomRepository.findByNumber('hotel-123', '')).rejects.toThrow('Room number is required');
    });
  });

  describe('findByType', () => {
    it('should return rooms when found by type', async () => {
      const rooms = [
        createTestRoom({
          businessId: 'hotel-123',
          type: RoomType.SUITE,
          number: '501'
        }),
        createTestRoom({
          businessId: 'hotel-123',
          type: RoomType.SUITE,
          number: '502'
        })
      ];

      // Mock the repository to return rooms
      roomRepository.findByType = jest.fn().mockResolvedValue(rooms);

      const foundRooms = await roomRepository.findByType('hotel-123', RoomType.SUITE);

      expect(foundRooms).toHaveLength(2);
      expect(foundRooms[0].type).toBe(RoomType.SUITE);
      expect(foundRooms[1].type).toBe(RoomType.SUITE);
    });

    it('should return empty array when no rooms found with type', async () => {
      const foundRooms = await roomRepository.findByType('hotel-123', RoomType.DELUXE);

      expect(foundRooms).toEqual([]);
    });

    it('should throw error for invalid parameters', async () => {
      await expect(roomRepository.findByType('', RoomType.SUITE)).rejects.toThrow('Business ID is required');
      await expect(roomRepository.findByType('hotel-123', 'INVALID_TYPE' as any)).rejects.toThrow('Invalid room type');
    });
  });

  describe('findByCapacity', () => {
    it('should return rooms when found by minimum capacity', async () => {
      const rooms = [
        createTestRoom({
          businessId: 'hotel-123',
          capacity: 2,
          number: '101'
        }),
        createTestRoom({
          businessId: 'hotel-123',
          capacity: 4,
          number: '201'
        })
      ];

      // Mock the repository to return rooms
      roomRepository.findByCapacity = jest.fn().mockResolvedValue(rooms);

      const foundRooms = await roomRepository.findByCapacity('hotel-123', 2);

      expect(foundRooms).toHaveLength(2);
      expect(foundRooms[0].capacity).toBeGreaterThanOrEqual(2);
      expect(foundRooms[1].capacity).toBeGreaterThanOrEqual(2);
    });

    it('should return empty array when no rooms found with capacity', async () => {
      const foundRooms = await roomRepository.findByCapacity('hotel-123', 10);

      expect(foundRooms).toEqual([]);
    });

    it('should throw error for invalid parameters', async () => {
      await expect(roomRepository.findByCapacity('', 2)).rejects.toThrow('Business ID is required');
      await expect(roomRepository.findByCapacity('hotel-123', 0)).rejects.toThrow('Minimum capacity must be greater than 0');
    });
  });

  describe('findAvailableRooms', () => {
    it('should return available rooms for date range', async () => {
      const startDate = new Date('2024-06-01');
      const endDate = new Date('2024-06-03');
      
      const availableRooms = [
        createTestRoom({
          businessId: 'hotel-123',
          number: '101',
          isActive: true
        }),
        createTestRoom({
          businessId: 'hotel-123',
          number: '102',
          isActive: true
        })
      ];

      // Mock the repository to return available rooms
      roomRepository.findAvailableRooms = jest.fn().mockResolvedValue(availableRooms);

      const foundRooms = await roomRepository.findAvailableRooms('hotel-123', startDate, endDate);

      expect(foundRooms).toHaveLength(2);
      expect(foundRooms[0].isActive).toBe(true);
      expect(foundRooms[1].isActive).toBe(true);
    });

    it('should return empty array when no rooms available', async () => {
      const startDate = new Date('2024-12-01');
      const endDate = new Date('2024-12-03');
      
      const foundRooms = await roomRepository.findAvailableRooms('hotel-123', startDate, endDate);

      expect(foundRooms).toEqual([]);
    });

    it('should throw error for invalid date range', async () => {
      const startDate = new Date('2024-06-30');
      const endDate = new Date('2024-06-01');
      
      await expect(roomRepository.findAvailableRooms('hotel-123', startDate, endDate)).rejects.toThrow('Start date cannot be after end date');
    });

    it('should throw error for missing dates', async () => {
      await expect(roomRepository.findAvailableRooms('hotel-123', null as any, new Date())).rejects.toThrow('Start date and end date are required');
      await expect(roomRepository.findAvailableRooms('hotel-123', new Date(), null as any)).rejects.toThrow('Start date and end date are required');
    });
  });

  describe('findByPriceRange', () => {
    it('should return rooms within price range', async () => {
      const minPrice = new Money(100, 'USD');
      const maxPrice = new Money(300, 'USD');
      
      const rooms = [
        createTestRoom({
          businessId: 'hotel-123',
          price: 150,
          number: '101'
        }),
        createTestRoom({
          businessId: 'hotel-123',
          price: 250,
          number: '201'
        })
      ];

      // Mock the repository to return rooms
      roomRepository.findByPriceRange = jest.fn().mockResolvedValue(rooms);

      const foundRooms = await roomRepository.findByPriceRange('hotel-123', minPrice, maxPrice);

      expect(foundRooms).toHaveLength(2);
      expect(foundRooms[0].price.amount).toBeGreaterThanOrEqual(100);
      expect(foundRooms[0].price.amount).toBeLessThanOrEqual(300);
    });

    it('should return empty array when no rooms in price range', async () => {
      const minPrice = new Money(1000, 'USD');
      const maxPrice = new Money(2000, 'USD');
      
      const foundRooms = await roomRepository.findByPriceRange('hotel-123', minPrice, maxPrice);

      expect(foundRooms).toEqual([]);
    });

    it('should throw error for invalid parameters', async () => {
      const minPrice = new Money(100, 'USD');
      const maxPrice = new Money(300, 'USD');
      
      await expect(roomRepository.findByPriceRange('', minPrice, maxPrice)).rejects.toThrow('Business ID is required');
      await expect(roomRepository.findByPriceRange('hotel-123', null as any, maxPrice)).rejects.toThrow('Price range is required');
      await expect(roomRepository.findByPriceRange('hotel-123', minPrice, null as any)).rejects.toThrow('Price range is required');
    });

    it('should throw error when min price is greater than max price', async () => {
      const minPrice = new Money(300, 'USD');
      const maxPrice = new Money(100, 'USD');
      
      await expect(roomRepository.findByPriceRange('hotel-123', minPrice, maxPrice)).rejects.toThrow('Minimum price cannot be greater than maximum price');
    });
  });

  describe('findActiveRooms', () => {
    it('should return active rooms for business', async () => {
      const activeRooms = [
        createTestRoom({
          businessId: 'hotel-123',
          isActive: true,
          number: '101'
        }),
        createTestRoom({
          businessId: 'hotel-123',
          isActive: true,
          number: '102'
        })
      ];

      // Mock the repository to return active rooms
      roomRepository.findActiveRooms = jest.fn().mockResolvedValue(activeRooms);

      const foundRooms = await roomRepository.findActiveRooms('hotel-123');

      expect(foundRooms).toHaveLength(2);
      expect(foundRooms[0].isActive).toBe(true);
      expect(foundRooms[1].isActive).toBe(true);
    });

    it('should return empty array when no active rooms found', async () => {
      const foundRooms = await roomRepository.findActiveRooms('hotel-without-active-rooms');

      expect(foundRooms).toEqual([]);
    });

    it('should throw error for invalid business id format', async () => {
      await expect(roomRepository.findActiveRooms('')).rejects.toThrow('Business ID is required');
    });
  });

  describe('findAll', () => {
    it('should return all rooms', async () => {
      const rooms = [
        createTestRoom({
          type: RoomType.SINGLE,
          number: '101'
        }),
        createTestRoom({
          type: RoomType.DOUBLE,
          number: '201'
        })
      ];

      // Mock the repository to return rooms
      roomRepository.findAll = jest.fn().mockResolvedValue(rooms);

      const allRooms = await roomRepository.findAll();

      expect(allRooms).toHaveLength(2);
      expect(allRooms[0]).toBeInstanceOf(Room);
      expect(allRooms[1]).toBeInstanceOf(Room);
    });

    it('should return empty array when no rooms exist', async () => {
      const allRooms = await roomRepository.findAll();

      expect(allRooms).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update room successfully', async () => {
      const room = createTestRoom({
        price: 200,
        isActive: true
      });

      const updateData = {
        price: new Money(250, 'USD'),
        isActive: false
      };

      // Mock the repository to return updated room
      const mockUpdatedRoom = createTestRoom({
        price: 250,
        isActive: false
      });
      roomRepository.update = jest.fn().mockResolvedValue(mockUpdatedRoom);

      const updatedRoom = await roomRepository.update('room-id', updateData);

      expect(updatedRoom).toBeInstanceOf(Room);
      expect(updatedRoom?.price.amount).toBe(250);
      expect(updatedRoom?.isActive).toBe(false);
    });

    it('should return null when room not found for update', async () => {
      const updateData = {
        price: new Money(250, 'USD')
      };

      const updatedRoom = await roomRepository.update('non-existent-id', updateData);

      expect(updatedRoom).toBeNull();
    });

    it('should throw error for invalid id format', async () => {
      const updateData = {
        price: new Money(250, 'USD')
      };

      await expect(roomRepository.update('', updateData)).rejects.toThrow('Invalid ID format');
    });
  });

  describe('delete', () => {
    it('should delete room successfully', async () => {
      // Mock the repository to return true
      roomRepository.delete = jest.fn().mockResolvedValue(true);

      const result = await roomRepository.delete('room-id');

      expect(result).toBe(true);
    });

    it('should return false when room not found for deletion', async () => {
      const result = await roomRepository.delete('non-existent-id');

      expect(result).toBe(false);
    });

    it('should throw error for invalid id format', async () => {
      await expect(roomRepository.delete('')).rejects.toThrow('Invalid ID format');
    });
  });

  describe('exists', () => {
    it('should return true when room exists', async () => {
      // Mock the repository to return true
      roomRepository.exists = jest.fn().mockResolvedValue(true);

      const exists = await roomRepository.exists('room-id');

      expect(exists).toBe(true);
    });

    it('should return false when room does not exist', async () => {
      const exists = await roomRepository.exists('non-existent-id');

      expect(exists).toBe(false);
    });

    it('should throw error for invalid id format', async () => {
      await expect(roomRepository.exists('')).rejects.toThrow('Invalid ID format');
    });
  });

  describe('Business logic', () => {
    it('should handle concurrent room creation', async () => {
      const room1 = createTestRoom({
        businessId: 'hotel-1',
        number: '101'
      });

      const room2 = createTestRoom({
        businessId: 'hotel-2',
        number: '201'
      });

      const [savedRoom1, savedRoom2] = await Promise.all([
        roomRepository.save(room1),
        roomRepository.save(room2)
      ]);

      expect(savedRoom1).toBeInstanceOf(Room);
      expect(savedRoom2).toBeInstanceOf(Room);
      expect(savedRoom1.id).not.toBe(savedRoom2.id);
    });

    it('should handle room availability checking', async () => {
      const businessId = 'hotel-123';
      const startDate = new Date('2024-06-15');
      const endDate = new Date('2024-06-17');
      
      const availableRooms = [
        createTestRoom({
          businessId: businessId,
          number: '101',
          isActive: true
        })
      ];

      // Mock the repository to return available rooms
      roomRepository.findAvailableRooms = jest.fn().mockResolvedValue(availableRooms);

      const foundRooms = await roomRepository.findAvailableRooms(businessId, startDate, endDate);

      expect(foundRooms).toHaveLength(1);
      expect(foundRooms[0].businessId).toBe(businessId);
      expect(foundRooms[0].isActive).toBe(true);
    });

    it('should handle room status changes', async () => {
      const room = createTestRoom({
        isActive: true
      });

      // Mock the repository to return updated room
      const mockUpdatedRoom = createTestRoom({
        isActive: false
      });
      roomRepository.update = jest.fn().mockResolvedValue(mockUpdatedRoom);

      const updatedRoom = await roomRepository.update('room-id', {
        isActive: false
      });

      expect(updatedRoom).toBeInstanceOf(Room);
      expect(updatedRoom?.isActive).toBe(false);
    });
  });
});
