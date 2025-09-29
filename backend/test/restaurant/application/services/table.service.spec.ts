import { TableLocation } from '../../../../src/restaurant/domain/entities/table.entity';
import { TableService } from '../../../../src/restaurant/application/services/table.service';
import { BusinessRepository } from '../../../../src/shared/application/repositories/business.repository';
import { TableRepository } from '../../../../src/restaurant/application/repositories/table.repository';
import { ReservationRepository } from '../../../../src/shared/application/repositories/reservation.repository';
import { Business } from '../../../../src/shared/domain/entities/business.entity';
import { Table } from '../../../../src/restaurant/domain/entities/table.entity';
import { Reservation } from '../../../../src/shared/domain/entities/reservation.entity';
import { Money } from '../../../../src/shared/domain/value-objects/money';
import { Email } from '../../../../src/shared/domain/value-objects/email';
import { PhoneNumber } from '../../../../src/shared/domain/value-objects/phone-number';
import { Address } from '../../../../src/shared/domain/value-objects/address';

describe('TableService', () => {
  let tableService: TableService;
  let businessRepository: jest.Mocked<BusinessRepository>;
  let tableRepository: jest.Mocked<TableRepository>;
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
      name: 'Test Restaurant',
      type: 'RESTAURANT' as const,
      email: 'restaurant@test.com',
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

  const createTestTable = (overrides: Partial<{
    businessId: string;
    number: string;
    capacity: number;
    location: TableLocation.INDOOR | TableLocation.OUTDOOR | TableLocation.PATIO | TableLocation.BAR;
    isActive: boolean;
  }> = {}) => {
    const defaults = {
      businessId: 'business-123',
      number: 'T1',
      capacity: 4,
      location: TableLocation.INDOOR as const,
      isActive: true
    };
    const data = { ...defaults, ...overrides };
    
    return Table.create({
      businessId: data.businessId,
      number: data.number,
      capacity: data.capacity,
      location: data.location,
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
    tableService = new TableService(
      businessRepository,
      tableRepository,
      reservationRepository
    );
  });

  describe('createTable', () => {
    it('should create a table successfully', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'RESTAURANT', name: 'Test Restaurant' });
      const tableData = {
        businessId: business.id,
        number: 'T1',
        capacity: 4,
        location: TableLocation.INDOOR as const,
        description: 'Comfortable indoor table'
      };

      businessRepository.findById.mockResolvedValue(business);
      tableRepository.findByNumber.mockResolvedValue(null);
      tableRepository.save.mockImplementation((table) => Promise.resolve(table));

      // Act
      const result = await tableService.createTable(tableData);

      // Assert
      expect(result).toBeInstanceOf(Table);
      expect(result.businessId).toBe(business.id);
      expect(result.number).toBe('T1');
      expect(result.capacity).toBe(4);
      expect(result.location).toBe(TableLocation.INDOOR);
      expect(result.isActive).toBe(true);
      expect(tableRepository.save).toHaveBeenCalledWith(expect.any(Table));
    });

    it('should throw error when business not found', async () => {
      // Arrange
      const tableData = {
        businessId: 'non-existent-business',
        number: 'T1',
        capacity: 4,
        location: TableLocation.INDOOR as const
      };

      businessRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(tableService.createTable(tableData))
        .rejects.toThrow('Business not found');
    });

    it('should throw error when business is not a restaurant', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'HOTEL' });
      const tableData = {
        businessId: business.id,
        number: 'T1',
        capacity: 4,
        location: TableLocation.INDOOR as const
      };

      businessRepository.findById.mockResolvedValue(business);

      // Act & Assert
      await expect(tableService.createTable(tableData))
        .rejects.toThrow('Business is not a restaurant');
    });

    it('should throw error when table number already exists', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'RESTAURANT' });
      const existingTable = createTestTable({ businessId: business.id, number: 'T1' });
      const tableData = {
        businessId: business.id,
        number: 'T1',
        capacity: 2,
        location: TableLocation.OUTDOOR as const
      };

      businessRepository.findById.mockResolvedValue(business);
      tableRepository.findByNumber.mockResolvedValue(existingTable);

      // Act & Assert
      await expect(tableService.createTable(tableData))
        .rejects.toThrow('Table number already exists for this business');
    });
  });

  describe('updateTable', () => {
    it('should update table successfully', async () => {
      // Arrange
      const table = createTestTable({
        businessId: 'business-123',
        number: 'T1',
        capacity: 4
      });

      const updateData = {
        capacity: 6,
        location: TableLocation.OUTDOOR as const,
        description: 'Updated table description'
      };

      tableRepository.findById.mockResolvedValue(table);
      tableRepository.update.mockResolvedValue(table);

      // Act
      const result = await tableService.updateTable(table.id, updateData);

      // Assert
      expect(result).toBeInstanceOf(Table);
      expect(tableRepository.update).toHaveBeenCalledWith(table.id, updateData);
    });

    it('should throw error when table not found', async () => {
      // Arrange
      const updateData = {
        capacity: 6
      };

      tableRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(tableService.updateTable('non-existent-id', updateData))
        .rejects.toThrow('Table not found');
    });
  });

  describe('activateTable', () => {
    it('should activate table successfully', async () => {
      // Arrange
      const table = createTestTable({
        businessId: 'business-123',
        number: 'T1',
        isActive: false
      });

      tableRepository.findById.mockResolvedValue(table);
      tableRepository.update.mockResolvedValue(table);

      // Act
      const result = await tableService.activateTable(table.id);

      // Assert
      expect(result).toBeInstanceOf(Table);
      expect(tableRepository.update).toHaveBeenCalledWith(table.id, { isActive: true });
    });

    it('should throw error when table not found', async () => {
      // Arrange
      tableRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(tableService.activateTable('non-existent-id'))
        .rejects.toThrow('Table not found');
    });
  });

  describe('deactivateTable', () => {
    it('should deactivate table successfully', async () => {
      // Arrange
      const table = createTestTable({
        businessId: 'business-123',
        number: 'T1',
        isActive: true
      });

      tableRepository.findById.mockResolvedValue(table);
      tableRepository.update.mockResolvedValue(table);

      // Act
      const result = await tableService.deactivateTable(table.id);

      // Assert
      expect(result).toBeInstanceOf(Table);
      expect(tableRepository.update).toHaveBeenCalledWith(table.id, { isActive: false });
    });

    it('should throw error when table not found', async () => {
      // Arrange
      tableRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(tableService.deactivateTable('non-existent-id'))
        .rejects.toThrow('Table not found');
    });
  });

  describe('getTablesByBusiness', () => {
    it('should return tables for business successfully', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'RESTAURANT' });
      const tables = [
        createTestTable({ businessId: business.id, number: 'T1' }),
        createTestTable({ businessId: business.id, number: 'T2' })
      ];

      businessRepository.findById.mockResolvedValue(business);
      tableRepository.findByBusinessId.mockResolvedValue(tables);

      // Act
      const result = await tableService.getTablesByBusiness(business.id);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Table);
      expect(result[1]).toBeInstanceOf(Table);
      expect(result[0].businessId).toBe(business.id);
      expect(result[1].businessId).toBe(business.id);
    });

    it('should throw error when business not found', async () => {
      // Arrange
      businessRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(tableService.getTablesByBusiness('non-existent-business'))
        .rejects.toThrow('Business not found');
    });

    it('should throw error when business is not a restaurant', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'HOTEL' });
      businessRepository.findById.mockResolvedValue(business);

      // Act & Assert
      await expect(tableService.getTablesByBusiness(business.id))
        .rejects.toThrow('Business is not a restaurant');
    });
  });

  describe('getAvailableTables', () => {
    it('should return available tables for date range', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'RESTAURANT' });
      const tables = [
        createTestTable({ businessId: business.id, number: 'T1' }),
        createTestTable({ businessId: business.id, number: 'T2' })
      ];
      const startDate = new Date('2024-06-01T19:00:00');
      const endDate = new Date('2024-06-01T21:00:00');

      businessRepository.findById.mockResolvedValue(business);
      tableRepository.findByBusinessId.mockResolvedValue(tables);
      reservationRepository.findOverlappingReservations.mockResolvedValue([]);

      // Act
      const result = await tableService.getAvailableTables(business.id, startDate, endDate);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Table);
      expect(result[1]).toBeInstanceOf(Table);
    });

    it('should return empty array when no tables available', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'RESTAURANT' });
      const tables = [
        createTestTable({ businessId: business.id, number: 'T1' })
      ];
      const existingReservation = Reservation.create({
        userId: 'user-123',
        businessId: business.id,
        startDate: new Date('2024-06-01T19:00:00'),
        endDate: new Date('2024-06-01T21:00:00'),
        guests: 4,
        totalAmount: new Money(150, 'USD'),
        type: 'RESTAURANT'
      });
      const startDate = new Date('2024-06-01T19:00:00');
      const endDate = new Date('2024-06-01T21:00:00');

      businessRepository.findById.mockResolvedValue(business);
      tableRepository.findByBusinessId.mockResolvedValue(tables);
      reservationRepository.findOverlappingReservations.mockResolvedValue([existingReservation]);

      // Act
      const result = await tableService.getAvailableTables(business.id, startDate, endDate);

      // Assert
      expect(result).toHaveLength(0);
    });

    it('should throw error when business not found', async () => {
      // Arrange
      const startDate = new Date('2024-06-01T19:00:00');
      const endDate = new Date('2024-06-01T21:00:00');

      businessRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(tableService.getAvailableTables('non-existent-business', startDate, endDate))
        .rejects.toThrow('Business not found');
    });
  });

  describe('getTablesByLocation', () => {
    it('should return tables by location successfully', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'RESTAURANT' });
      const tables = [
        createTestTable({ businessId: business.id, location: TableLocation.OUTDOOR, number: 'T10' }),
        createTestTable({ businessId: business.id, location: TableLocation.OUTDOOR, number: 'T11' })
      ];

      businessRepository.findById.mockResolvedValue(business);
      tableRepository.findByLocation.mockResolvedValue(tables);

      // Act
      const result = await tableService.getTablesByLocation(business.id, TableLocation.OUTDOOR);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].location).toBe(TableLocation.OUTDOOR);
      expect(result[1].location).toBe(TableLocation.OUTDOOR);
    });

    it('should throw error when business not found', async () => {
      // Arrange
      businessRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(tableService.getTablesByLocation('non-existent-business', TableLocation.OUTDOOR))
        .rejects.toThrow('Business not found');
    });
  });

  describe('getTablesByCapacity', () => {
    it('should return tables by minimum capacity successfully', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'RESTAURANT' });
      const tables = [
        createTestTable({ businessId: business.id, capacity: 4, number: 'T1' }),
        createTestTable({ businessId: business.id, capacity: 6, number: 'T2' })
      ];

      businessRepository.findById.mockResolvedValue(business);
      tableRepository.findByCapacity.mockResolvedValue(tables);

      // Act
      const result = await tableService.getTablesByCapacity(business.id, 4);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].capacity).toBeGreaterThanOrEqual(4);
      expect(result[1].capacity).toBeGreaterThanOrEqual(4);
    });

    it('should throw error when business not found', async () => {
      // Arrange
      businessRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(tableService.getTablesByCapacity('non-existent-business', 4))
        .rejects.toThrow('Business not found');
    });
  });

  describe('getActiveTables', () => {
    it('should return active tables for business', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'RESTAURANT' });
      const tables = [
        createTestTable({ businessId: business.id, isActive: true, number: 'T1' }),
        createTestTable({ businessId: business.id, isActive: true, number: 'T2' })
      ];

      businessRepository.findById.mockResolvedValue(business);
      tableRepository.findActiveTables.mockResolvedValue(tables);

      // Act
      const result = await tableService.getActiveTables(business.id);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].isActive).toBe(true);
      expect(result[1].isActive).toBe(true);
    });

    it('should throw error when business not found', async () => {
      // Arrange
      businessRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(tableService.getActiveTables('non-existent-business'))
        .rejects.toThrow('Business not found');
    });
  });

  describe('deleteTable', () => {
    it('should delete table successfully', async () => {
      // Arrange
      const table = createTestTable({ businessId: 'business-123', number: 'T1' });

      tableRepository.findById.mockResolvedValue(table);
      tableRepository.delete.mockResolvedValue(true);

      // Act
      const result = await tableService.deleteTable(table.id);

      // Assert
      expect(result).toBe(true);
      expect(tableRepository.delete).toHaveBeenCalledWith(table.id);
    });

    it('should throw error when table not found', async () => {
      // Arrange
      tableRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(tableService.deleteTable('non-existent-id'))
        .rejects.toThrow('Table not found');
    });
  });

  describe('getTableById', () => {
    it('should return table by id successfully', async () => {
      // Arrange
      const table = createTestTable({ businessId: 'business-123', number: 'T1' });

      tableRepository.findById.mockResolvedValue(table);

      // Act
      const result = await tableService.getTableById(table.id);

      // Assert
      expect(result).toBeInstanceOf(Table);
      expect(result.id).toBe(table.id);
    });

    it('should throw error when table not found', async () => {
      // Arrange
      tableRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(tableService.getTableById('non-existent-id'))
        .rejects.toThrow('Table not found');
    });
  });

  describe('getTableByNumber', () => {
    it('should return table by number successfully', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'RESTAURANT' });
      const table = createTestTable({ businessId: business.id, number: 'T1' });

      businessRepository.findById.mockResolvedValue(business);
      tableRepository.findByNumber.mockResolvedValue(table);

      // Act
      const result = await tableService.getTableByNumber(business.id, 'T1');

      // Assert
      expect(result).toBeInstanceOf(Table);
      expect(result.number).toBe('T1');
    });

    it('should throw error when business not found', async () => {
      // Arrange
      businessRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(tableService.getTableByNumber('non-existent-business', 'T1'))
        .rejects.toThrow('Business not found');
    });

    it('should throw error when table not found', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'RESTAURANT' });
      businessRepository.findById.mockResolvedValue(business);
      tableRepository.findByNumber.mockResolvedValue(null);

      // Act & Assert
      await expect(tableService.getTableByNumber(business.id, 'T999'))
        .rejects.toThrow('Table not found');
    });
  });

  describe('checkTableAvailability', () => {
    it('should return true when table is available', async () => {
      // Arrange
      const table = createTestTable({
        businessId: 'business-123',
        number: 'T1',
        isActive: true
      });
      const startDate = new Date('2024-06-01T19:00:00');
      const endDate = new Date('2024-06-01T21:00:00');

      tableRepository.findById.mockResolvedValue(table);
      reservationRepository.findOverlappingReservations.mockResolvedValue([]);

      // Act
      const result = await tableService.checkTableAvailability(table.id, startDate, endDate);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when table is not active', async () => {
      // Arrange
      const table = createTestTable({
        businessId: 'business-123',
        number: 'T1',
        isActive: false
      });
      const startDate = new Date('2024-06-01T19:00:00');
      const endDate = new Date('2024-06-01T21:00:00');

      tableRepository.findById.mockResolvedValue(table);

      // Act
      const result = await tableService.checkTableAvailability(table.id, startDate, endDate);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when table has overlapping reservations', async () => {
      // Arrange
      const table = createTestTable({
        businessId: 'business-123',
        number: 'T1',
        isActive: true
      });
      const existingReservation = Reservation.create({
        userId: 'user-123',
        businessId: 'business-123',
        startDate: new Date('2024-06-01T19:00:00'),
        endDate: new Date('2024-06-01T21:00:00'),
        guests: 4,
        totalAmount: new Money(150, 'USD'),
        type: 'RESTAURANT'
      });
      const startDate = new Date('2024-06-01T19:00:00');
      const endDate = new Date('2024-06-01T21:00:00');

      tableRepository.findById.mockResolvedValue(table);
      reservationRepository.findOverlappingReservations.mockResolvedValue([existingReservation]);

      // Act
      const result = await tableService.checkTableAvailability(table.id, startDate, endDate);

      // Assert
      expect(result).toBe(false);
    });

    it('should throw error when table not found', async () => {
      // Arrange
      const startDate = new Date('2024-06-01T19:00:00');
      const endDate = new Date('2024-06-01T21:00:00');

      tableRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(tableService.checkTableAvailability('non-existent-id', startDate, endDate))
        .rejects.toThrow('Table not found');
    });
  });

  describe('Business logic', () => {
    it('should handle table capacity validation', async () => {
      // Arrange
      const business = createTestBusiness({ type: 'RESTAURANT' });
      const table = createTestTable({
        businessId: business.id,
        capacity: 4,
        number: 'T1'
      });

      businessRepository.findById.mockResolvedValue(business);
      tableRepository.findByBusinessId.mockResolvedValue([table]);

      // Act
      const result = await tableService.getTablesByBusiness(business.id);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].canAccommodate(4)).toBe(true);
      expect(result[0].canAccommodate(5)).toBe(false);
    });

    it('should handle table location display names', async () => {
      // Arrange
      const table = createTestTable({
        businessId: 'business-123',
        location: TableLocation.OUTDOOR,
        number: 'T10'
      });

      tableRepository.findById.mockResolvedValue(table);

      // Act
      const result = await tableService.getTableById(table.id);

      // Assert
      expect(result).toBeInstanceOf(Table);
      expect(result.getLocationDisplayName()).toBe('Outdoor');
    });

    it('should handle table capacity categories', async () => {
      // Arrange
      const table = createTestTable({
        businessId: 'business-123',
        capacity: 2,
        number: 'T1'
      });

      tableRepository.findById.mockResolvedValue(table);

      // Act
      const result = await tableService.getTableById(table.id);

      // Assert
      expect(result).toBeInstanceOf(Table);
      expect(result.getCapacityCategory()).toBe('SMALL');
    });

    it('should handle outdoor table detection', async () => {
      // Arrange
      const table = createTestTable({
        businessId: 'business-123',
        location: TableLocation.PATIO,
        number: 'T10'
      });

      tableRepository.findById.mockResolvedValue(table);

      // Act
      const result = await tableService.getTableById(table.id);

      // Assert
      expect(result).toBeInstanceOf(Table);
      expect(result.isOutdoor()).toBe(true);
    });
  });
});
