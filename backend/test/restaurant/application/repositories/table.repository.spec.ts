import { TableRepository } from '../../../../src/restaurant/application/repositories/table.repository';
import { Table } from '../../../../src/restaurant/domain/entities/table.entity';

describe('TableRepository', () => {
  let tableRepository: TableRepository;

  // Helper function to create a table for testing
  const createTestTable = (overrides: Partial<{
    businessId: string;
    number: string;
    capacity: number;
    location: 'INDOOR' | 'OUTDOOR' | 'PATIO' | 'BAR';
    isActive: boolean;
  }> = {}) => {
    const defaults = {
      businessId: 'business-123',
      number: 'T1',
      capacity: 4,
      location: 'INDOOR' as const,
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
    // Mock implementation for testing
    tableRepository = {
      async save(table: Table): Promise<Table> {
        return table;
      },
      async findById(id: string): Promise<Table | null> {
        if (!id || id.trim() === '') {
          throw new Error('Invalid ID format');
        }
        return null;
      },
      async findByBusinessId(businessId: string): Promise<Table[]> {
        if (!businessId || businessId.trim() === '') {
          throw new Error('Invalid business ID format');
        }
        return [];
      },
      async findByNumber(businessId: string, number: string): Promise<Table | null> {
        if (!businessId || businessId.trim() === '') {
          throw new Error('Business ID is required');
        }
        if (!number || number.trim() === '') {
          throw new Error('Table number is required');
        }
        return null;
      },
      async findByLocation(businessId: string, location: 'INDOOR' | 'OUTDOOR' | 'PATIO' | 'BAR'): Promise<Table[]> {
        if (!businessId || businessId.trim() === '') {
          throw new Error('Business ID is required');
        }
        if (!['INDOOR', 'OUTDOOR', 'PATIO', 'BAR'].includes(location)) {
          throw new Error('Invalid table location');
        }
        return [];
      },
      async findByCapacity(businessId: string, minCapacity: number): Promise<Table[]> {
        if (!businessId || businessId.trim() === '') {
          throw new Error('Business ID is required');
        }
        if (minCapacity <= 0) {
          throw new Error('Minimum capacity must be greater than 0');
        }
        return [];
      },
      async findAvailableTables(businessId: string, startDate: Date, endDate: Date): Promise<Table[]> {
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
      async findActiveTables(businessId: string): Promise<Table[]> {
        if (!businessId || businessId.trim() === '') {
          throw new Error('Business ID is required');
        }
        return [];
      },
      async findAll(): Promise<Table[]> {
        return [];
      },
      async update(id: string, table: Partial<Table>): Promise<Table | null> {
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
    it('should save an indoor table successfully', async () => {
      const table = createTestTable({
        location: 'INDOOR',
        number: 'T1',
        capacity: 4
      });

      const savedTable = await tableRepository.save(table);

      expect(savedTable).toBeInstanceOf(Table);
      expect(savedTable.location).toBe('INDOOR');
      expect(savedTable.number).toBe('T1');
      expect(savedTable.capacity).toBe(4);
    });

    it('should save an outdoor table successfully', async () => {
      const table = createTestTable({
        location: 'OUTDOOR',
        number: 'T10',
        capacity: 6
      });

      const savedTable = await tableRepository.save(table);

      expect(savedTable).toBeInstanceOf(Table);
      expect(savedTable.location).toBe('OUTDOOR');
      expect(savedTable.number).toBe('T10');
      expect(savedTable.capacity).toBe(6);
    });

    it('should save table with all required fields', async () => {
      const table = createTestTable({
        businessId: 'restaurant-456',
        number: 'T5',
        capacity: 2,
        location: 'BAR',
        isActive: false
      });

      const savedTable = await tableRepository.save(table);

      expect(savedTable).toBeDefined();
      expect(savedTable.id).toBeDefined();
      expect(savedTable.businessId).toBe('restaurant-456');
      expect(savedTable.number).toBe('T5');
      expect(savedTable.capacity).toBe(2);
      expect(savedTable.location).toBe('BAR');
      expect(savedTable.isActive).toBe(false);
      expect(savedTable.createdAt).toBeDefined();
      expect(savedTable.updatedAt).toBeDefined();
    });
  });

  describe('findById', () => {
    it('should return table when found by id', async () => {
      const table = createTestTable({
        businessId: 'restaurant-123',
        number: 'T1'
      });

      // Mock the repository to return the table
      tableRepository.findById = jest.fn().mockResolvedValue(table);

      const foundTable = await tableRepository.findById('table-id');

      expect(foundTable).toBeInstanceOf(Table);
      expect(foundTable?.businessId).toBe('restaurant-123');
      expect(foundTable?.number).toBe('T1');
    });

    it('should return null when table not found by id', async () => {
      const foundTable = await tableRepository.findById('non-existent-id');

      expect(foundTable).toBeNull();
    });

    it('should throw error for invalid id format', async () => {
      await expect(tableRepository.findById('')).rejects.toThrow('Invalid ID format');
    });
  });

  describe('findByBusinessId', () => {
    it('should return tables when found by business id', async () => {
      const tables = [
        createTestTable({
          businessId: 'restaurant-123',
          number: 'T1',
          location: 'INDOOR'
        }),
        createTestTable({
          businessId: 'restaurant-123',
          number: 'T2',
          location: 'OUTDOOR'
        })
      ];

      // Mock the repository to return tables
      tableRepository.findByBusinessId = jest.fn().mockResolvedValue(tables);

      const foundTables = await tableRepository.findByBusinessId('restaurant-123');

      expect(foundTables).toHaveLength(2);
      expect(foundTables[0]).toBeInstanceOf(Table);
      expect(foundTables[1]).toBeInstanceOf(Table);
      expect(foundTables[0].businessId).toBe('restaurant-123');
      expect(foundTables[1].businessId).toBe('restaurant-123');
    });

    it('should return empty array when no tables found for business', async () => {
      const foundTables = await tableRepository.findByBusinessId('restaurant-without-tables');

      expect(foundTables).toEqual([]);
    });

    it('should throw error for invalid business id format', async () => {
      await expect(tableRepository.findByBusinessId('')).rejects.toThrow('Invalid business ID format');
    });
  });

  describe('findByNumber', () => {
    it('should return table when found by business id and number', async () => {
      const table = createTestTable({
        businessId: 'restaurant-123',
        number: 'T1'
      });

      // Mock the repository to return the table
      tableRepository.findByNumber = jest.fn().mockResolvedValue(table);

      const foundTable = await tableRepository.findByNumber('restaurant-123', 'T1');

      expect(foundTable).toBeInstanceOf(Table);
      expect(foundTable?.businessId).toBe('restaurant-123');
      expect(foundTable?.number).toBe('T1');
    });

    it('should return null when table not found by number', async () => {
      const foundTable = await tableRepository.findByNumber('restaurant-123', 'T999');

      expect(foundTable).toBeNull();
    });

    it('should throw error for invalid parameters', async () => {
      await expect(tableRepository.findByNumber('', 'T1')).rejects.toThrow('Business ID is required');
      await expect(tableRepository.findByNumber('restaurant-123', '')).rejects.toThrow('Table number is required');
    });
  });

  describe('findByLocation', () => {
    it('should return tables when found by location', async () => {
      const tables = [
        createTestTable({
          businessId: 'restaurant-123',
          location: 'OUTDOOR',
          number: 'T10'
        }),
        createTestTable({
          businessId: 'restaurant-123',
          location: 'OUTDOOR',
          number: 'T11'
        })
      ];

      // Mock the repository to return tables
      tableRepository.findByLocation = jest.fn().mockResolvedValue(tables);

      const foundTables = await tableRepository.findByLocation('restaurant-123', 'OUTDOOR');

      expect(foundTables).toHaveLength(2);
      expect(foundTables[0].location).toBe('OUTDOOR');
      expect(foundTables[1].location).toBe('OUTDOOR');
    });

    it('should return empty array when no tables found with location', async () => {
      const foundTables = await tableRepository.findByLocation('restaurant-123', 'BAR');

      expect(foundTables).toEqual([]);
    });

    it('should throw error for invalid parameters', async () => {
      await expect(tableRepository.findByLocation('', 'OUTDOOR')).rejects.toThrow('Business ID is required');
      await expect(tableRepository.findByLocation('restaurant-123', 'INVALID_LOCATION' as any)).rejects.toThrow('Invalid table location');
    });
  });

  describe('findByCapacity', () => {
    it('should return tables when found by minimum capacity', async () => {
      const tables = [
        createTestTable({
          businessId: 'restaurant-123',
          capacity: 4,
          number: 'T1'
        }),
        createTestTable({
          businessId: 'restaurant-123',
          capacity: 6,
          number: 'T2'
        })
      ];

      // Mock the repository to return tables
      tableRepository.findByCapacity = jest.fn().mockResolvedValue(tables);

      const foundTables = await tableRepository.findByCapacity('restaurant-123', 4);

      expect(foundTables).toHaveLength(2);
      expect(foundTables[0].capacity).toBeGreaterThanOrEqual(4);
      expect(foundTables[1].capacity).toBeGreaterThanOrEqual(4);
    });

    it('should return empty array when no tables found with capacity', async () => {
      const foundTables = await tableRepository.findByCapacity('restaurant-123', 20);

      expect(foundTables).toEqual([]);
    });

    it('should throw error for invalid parameters', async () => {
      await expect(tableRepository.findByCapacity('', 4)).rejects.toThrow('Business ID is required');
      await expect(tableRepository.findByCapacity('restaurant-123', 0)).rejects.toThrow('Minimum capacity must be greater than 0');
    });
  });

  describe('findAvailableTables', () => {
    it('should return available tables for date range', async () => {
      const startDate = new Date('2024-06-01T19:00:00');
      const endDate = new Date('2024-06-01T21:00:00');
      
      const availableTables = [
        createTestTable({
          businessId: 'restaurant-123',
          number: 'T1',
          isActive: true
        }),
        createTestTable({
          businessId: 'restaurant-123',
          number: 'T2',
          isActive: true
        })
      ];

      // Mock the repository to return available tables
      tableRepository.findAvailableTables = jest.fn().mockResolvedValue(availableTables);

      const foundTables = await tableRepository.findAvailableTables('restaurant-123', startDate, endDate);

      expect(foundTables).toHaveLength(2);
      expect(foundTables[0].isActive).toBe(true);
      expect(foundTables[1].isActive).toBe(true);
    });

    it('should return empty array when no tables available', async () => {
      const startDate = new Date('2024-12-01T19:00:00');
      const endDate = new Date('2024-12-01T21:00:00');
      
      const foundTables = await tableRepository.findAvailableTables('restaurant-123', startDate, endDate);

      expect(foundTables).toEqual([]);
    });

    it('should throw error for invalid date range', async () => {
      const startDate = new Date('2024-06-01T21:00:00');
      const endDate = new Date('2024-06-01T19:00:00');
      
      await expect(tableRepository.findAvailableTables('restaurant-123', startDate, endDate)).rejects.toThrow('Start date cannot be after end date');
    });

    it('should throw error for missing dates', async () => {
      await expect(tableRepository.findAvailableTables('restaurant-123', null as any, new Date())).rejects.toThrow('Start date and end date are required');
      await expect(tableRepository.findAvailableTables('restaurant-123', new Date(), null as any)).rejects.toThrow('Start date and end date are required');
    });
  });

  describe('findActiveTables', () => {
    it('should return active tables for business', async () => {
      const activeTables = [
        createTestTable({
          businessId: 'restaurant-123',
          isActive: true,
          number: 'T1'
        }),
        createTestTable({
          businessId: 'restaurant-123',
          isActive: true,
          number: 'T2'
        })
      ];

      // Mock the repository to return active tables
      tableRepository.findActiveTables = jest.fn().mockResolvedValue(activeTables);

      const foundTables = await tableRepository.findActiveTables('restaurant-123');

      expect(foundTables).toHaveLength(2);
      expect(foundTables[0].isActive).toBe(true);
      expect(foundTables[1].isActive).toBe(true);
    });

    it('should return empty array when no active tables found', async () => {
      const foundTables = await tableRepository.findActiveTables('restaurant-without-active-tables');

      expect(foundTables).toEqual([]);
    });

    it('should throw error for invalid business id format', async () => {
      await expect(tableRepository.findActiveTables('')).rejects.toThrow('Business ID is required');
    });
  });

  describe('findAll', () => {
    it('should return all tables', async () => {
      const tables = [
        createTestTable({
          location: 'INDOOR',
          number: 'T1'
        }),
        createTestTable({
          location: 'OUTDOOR',
          number: 'T10'
        })
      ];

      // Mock the repository to return tables
      tableRepository.findAll = jest.fn().mockResolvedValue(tables);

      const allTables = await tableRepository.findAll();

      expect(allTables).toHaveLength(2);
      expect(allTables[0]).toBeInstanceOf(Table);
      expect(allTables[1]).toBeInstanceOf(Table);
    });

    it('should return empty array when no tables exist', async () => {
      const allTables = await tableRepository.findAll();

      expect(allTables).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update table successfully', async () => {
      const table = createTestTable({
        capacity: 4,
        isActive: true
      });

      const updateData = {
        capacity: 6,
        isActive: false
      };

      // Mock the repository to return updated table
      const mockUpdatedTable = createTestTable({
        capacity: 6,
        isActive: false
      });
      tableRepository.update = jest.fn().mockResolvedValue(mockUpdatedTable);

      const updatedTable = await tableRepository.update('table-id', updateData);

      expect(updatedTable).toBeInstanceOf(Table);
      expect(updatedTable?.capacity).toBe(6);
      expect(updatedTable?.isActive).toBe(false);
    });

    it('should return null when table not found for update', async () => {
      const updateData = {
        capacity: 6
      };

      const updatedTable = await tableRepository.update('non-existent-id', updateData);

      expect(updatedTable).toBeNull();
    });

    it('should throw error for invalid id format', async () => {
      const updateData = {
        capacity: 6
      };

      await expect(tableRepository.update('', updateData)).rejects.toThrow('Invalid ID format');
    });
  });

  describe('delete', () => {
    it('should delete table successfully', async () => {
      // Mock the repository to return true
      tableRepository.delete = jest.fn().mockResolvedValue(true);

      const result = await tableRepository.delete('table-id');

      expect(result).toBe(true);
    });

    it('should return false when table not found for deletion', async () => {
      const result = await tableRepository.delete('non-existent-id');

      expect(result).toBe(false);
    });

    it('should throw error for invalid id format', async () => {
      await expect(tableRepository.delete('')).rejects.toThrow('Invalid ID format');
    });
  });

  describe('exists', () => {
    it('should return true when table exists', async () => {
      // Mock the repository to return true
      tableRepository.exists = jest.fn().mockResolvedValue(true);

      const exists = await tableRepository.exists('table-id');

      expect(exists).toBe(true);
    });

    it('should return false when table does not exist', async () => {
      const exists = await tableRepository.exists('non-existent-id');

      expect(exists).toBe(false);
    });

    it('should throw error for invalid id format', async () => {
      await expect(tableRepository.exists('')).rejects.toThrow('Invalid ID format');
    });
  });

  describe('Business logic', () => {
    it('should handle concurrent table creation', async () => {
      const table1 = createTestTable({
        businessId: 'restaurant-1',
        number: 'T1'
      });

      const table2 = createTestTable({
        businessId: 'restaurant-2',
        number: 'T2'
      });

      const [savedTable1, savedTable2] = await Promise.all([
        tableRepository.save(table1),
        tableRepository.save(table2)
      ]);

      expect(savedTable1).toBeInstanceOf(Table);
      expect(savedTable2).toBeInstanceOf(Table);
      expect(savedTable1.id).not.toBe(savedTable2.id);
    });

    it('should handle table availability checking', async () => {
      const businessId = 'restaurant-123';
      const startDate = new Date('2024-06-15T19:00:00');
      const endDate = new Date('2024-06-15T21:00:00');
      
      const availableTables = [
        createTestTable({
          businessId: businessId,
          number: 'T1',
          isActive: true
        })
      ];

      // Mock the repository to return available tables
      tableRepository.findAvailableTables = jest.fn().mockResolvedValue(availableTables);

      const foundTables = await tableRepository.findAvailableTables(businessId, startDate, endDate);

      expect(foundTables).toHaveLength(1);
      expect(foundTables[0].businessId).toBe(businessId);
      expect(foundTables[0].isActive).toBe(true);
    });

    it('should handle table status changes', async () => {
      const table = createTestTable({
        isActive: true
      });

      // Mock the repository to return updated table
      const mockUpdatedTable = createTestTable({
        isActive: false
      });
      tableRepository.update = jest.fn().mockResolvedValue(mockUpdatedTable);

      const updatedTable = await tableRepository.update('table-id', {
        isActive: false
      });

      expect(updatedTable).toBeInstanceOf(Table);
      expect(updatedTable?.isActive).toBe(false);
    });
  });
});
