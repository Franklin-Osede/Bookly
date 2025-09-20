import { Room, RoomType } from '../../../../src/hotel/domain/entities/room.entity';
import { Money } from '../../../../src/shared/domain/value-objects/money';

describe('Room Entity', () => {
  describe('create', () => {
    it('should create a valid room', () => {
      // Arrange
      const roomData = {
        businessId: 'hotel-123',
        number: '101',
        type: RoomType.SINGLE as const,
        capacity: 2,
        price: new Money(150.00, 'USD'),
        description: 'Standard room with city view',
      };

      // Act
      const room = Room.create(roomData);

      // Assert
      expect(room).toBeDefined();
      expect(room.businessId).toBe('hotel-123');
      expect(room.number).toBe('101');
      expect(room.type).toBe(RoomType.SINGLE);
      expect(room.capacity).toBe(2);
      expect(room.price.amount).toBe(150.00);
      expect(room.description).toBe('Standard room with city view');
      expect(room.isActive).toBe(true);
      expect(room.id).toBeDefined();
      expect(room.createdAt).toBeDefined();
      expect(room.updatedAt).toBeDefined();
    });

    it('should create a suite room', () => {
      // Arrange
      const roomData = {
        businessId: 'hotel-123',
        number: '201',
        type: RoomType.SUITE as const,
        capacity: 4,
        price: new Money(300.00, 'USD'),
        description: 'Luxury suite with ocean view',
      };

      // Act
      const room = Room.create(roomData);

      // Assert
      expect(room.type).toBe(RoomType.SUITE);
      expect(room.capacity).toBe(4);
      expect(room.price.amount).toBe(300.00);
    });

    it('should create a room without description', () => {
      // Arrange
      const roomData = {
        businessId: 'hotel-123',
        number: '301',
        type: RoomType.DELUXE as const,
        capacity: 3,
        price: new Money(200.00, 'USD'),
      };

      // Act
      const room = Room.create(roomData);

      // Assert
      expect(room.description).toBeUndefined();
      expect(room.type).toBe(RoomType.DELUXE);
    });
  });

  describe('validation', () => {
    it('should throw error for empty room number', () => {
      // Arrange
      const roomData = {
        businessId: 'hotel-123',
        number: '',
        type: RoomType.SINGLE as const,
        capacity: 2,
        price: new Money(150.00, 'USD'),
      };

      // Act & Assert
      expect(() => Room.create(roomData)).toThrow('Room number is required');
    });

    it('should throw error for zero or negative capacity', () => {
      // Arrange
      const roomData = {
        businessId: 'hotel-123',
        number: '101',
        type: RoomType.SINGLE as const,
        capacity: 0,
        price: new Money(150.00, 'USD'),
      };

      // Act & Assert
      expect(() => Room.create(roomData)).toThrow('Room capacity must be greater than 0');
    });

    it('should throw error for negative price', () => {
      // Act & Assert
      // The error is thrown in the Money constructor, not in Room.create
      expect(() => new Money(-50.00, 'USD')).toThrow('Amount cannot be negative');
    });

    it('should throw error for invalid room type', () => {
      // Arrange
      const roomData = {
        businessId: 'hotel-123',
        number: '101',
        type: 'INVALID_TYPE' as any,
        capacity: 2,
        price: new Money(150.00, 'USD'),
      };

      // Act & Assert
      expect(() => Room.create(roomData)).toThrow('Invalid room type');
    });
  });

  describe('room management', () => {
    it('should deactivate a room', () => {
      // Arrange
      const room = Room.create({
        businessId: 'hotel-123',
        number: '101',
        type: RoomType.SINGLE as const,
        capacity: 2,
        price: new Money(150.00, 'USD'),
      });

      // Act
      room.deactivate();

      // Assert
      expect(room.isActive).toBe(false);
      expect(room.updatedAt).toBeDefined();
    });

    it('should activate a room', () => {
      // Arrange
      const room = Room.create({
        businessId: 'hotel-123',
        number: '101',
        type: RoomType.SINGLE as const,
        capacity: 2,
        price: new Money(150.00, 'USD'),
      });
      room.deactivate();

      // Act
      room.activate();

      // Assert
      expect(room.isActive).toBe(true);
      expect(room.updatedAt).toBeDefined();
    });

    it('should update room information', () => {
      // Arrange
      const room = Room.create({
        businessId: 'hotel-123',
        number: '101',
        type: RoomType.SINGLE as const,
        capacity: 2,
        price: new Money(150.00, 'USD'),
        description: 'Old description',
      });

      // Act
      room.updateInfo({
        type: RoomType.DELUXE as const,
        capacity: 3,
        price: new Money(200.00, 'USD'),
        description: 'New description',
      });

      // Assert
      expect(room.type).toBe(RoomType.DELUXE);
      expect(room.capacity).toBe(3);
      expect(room.price.amount).toBe(200.00);
      expect(room.description).toBe('New description');
      expect(room.updatedAt).toBeDefined();
    });

    it('should not allow updating to invalid capacity', () => {
      // Arrange
      const room = Room.create({
        businessId: 'hotel-123',
        number: '101',
        type: RoomType.SINGLE as const,
        capacity: 2,
        price: new Money(150.00, 'USD'),
      });

      // Act & Assert
      expect(() => room.updateInfo({ capacity: 0 })).toThrow('Room capacity must be greater than 0');
    });

    it('should not allow updating to invalid price', () => {
      // Arrange
      const room = Room.create({
        businessId: 'hotel-123',
        number: '101',
        type: RoomType.SINGLE as const,
        capacity: 2,
        price: new Money(150.00, 'USD'),
      });

      // Act & Assert
      expect(() => room.updateInfo({ price: new Money(-100, 'USD') })).toThrow('Amount cannot be negative');
    });
  });

  describe('business logic', () => {
    it('should check if room is available for given guests', () => {
      // Arrange
      const room = Room.create({
        businessId: 'hotel-123',
        number: '101',
        type: RoomType.SINGLE as const,
        capacity: 2,
        price: new Money(150.00, 'USD'),
      });

      // Act & Assert
      expect(room.canAccommodate(1)).toBe(true);
      expect(room.canAccommodate(2)).toBe(true);
      expect(room.canAccommodate(3)).toBe(false);
    });

    it('should not be available if room is deactivated', () => {
      // Arrange
      const room = Room.create({
        businessId: 'hotel-123',
        number: '101',
        type: RoomType.SINGLE as const,
        capacity: 2,
        price: new Money(150.00, 'USD'),
      });
      room.deactivate();

      // Act & Assert
      expect(room.canAccommodate(1)).toBe(false);
    });

    it('should calculate price per guest', () => {
      // Arrange
      const room = Room.create({
        businessId: 'hotel-123',
        number: '101',
        type: RoomType.SINGLE as const,
        capacity: 2,
        price: new Money(150.00, 'USD'),
      });

      // Act
      const pricePerGuest = room.getPricePerGuest();

      // Assert
      expect(pricePerGuest.amount).toBe(75.00);
    });

    it('should return room type display name', () => {
      // Arrange
      const standardRoom = Room.create({
        businessId: 'hotel-123',
        number: '101',
        type: RoomType.SINGLE as const,
        capacity: 2,
        price: new Money(150.00, 'USD'),
      });

      const suiteRoom = Room.create({
        businessId: 'hotel-123',
        number: '201',
        type: RoomType.SUITE as const,
        capacity: 4,
        price: new Money(300.00, 'USD'),
      });

      // Act & Assert
      expect(standardRoom.getTypeDisplayName()).toBe('Single Room');
      expect(suiteRoom.getTypeDisplayName()).toBe('Suite');
    });
  });
});
