import { TableLocation } from '../../../../src/restaurant/domain/entities/table.entity';
import { Table } from '../../../../src/restaurant/domain/entities/table.entity';

describe('Table Entity', () => {
  describe('create', () => {
    it('should create a valid table', () => {
      // Arrange
      const tableData = {
        businessId: 'restaurant-123',
        number: 'T01',
        capacity: 4,
        location: TableLocation.INDOOR as const,
        description: 'Table near the window',
      };

      // Act
      const table = Table.create(tableData);

      // Assert
      expect(table).toBeDefined();
      expect(table.businessId).toBe('restaurant-123');
      expect(table.number).toBe('T01');
      expect(table.capacity).toBe(4);
      expect(table.location).toBe(TableLocation.INDOOR);
      expect(table.description).toBe('Table near the window');
      expect(table.isActive).toBe(true);
      expect(table.id).toBeDefined();
      expect(table.createdAt).toBeDefined();
      expect(table.updatedAt).toBeDefined();
    });

    it('should create a table without description', () => {
      // Arrange
      const tableData = {
        businessId: 'restaurant-123',
        number: 'T02',
        capacity: 2,
        location: TableLocation.OUTDOOR as const,
      };

      // Act
      const table = Table.create(tableData);

      // Assert
      expect(table.description).toBeUndefined();
      expect(table.location).toBe(TableLocation.OUTDOOR);
    });

    it('should create a VIP table', () => {
      // Arrange
      const tableData = {
        businessId: 'restaurant-123',
        number: 'VIP01',
        capacity: 6,
        location: TableLocation.PATIO as const,
        description: 'VIP table with exclusive service',
      };

      // Act
      const table = Table.create(tableData);

      // Assert
      expect(table.location).toBe(TableLocation.PATIO);
      expect(table.capacity).toBe(6);
    });
  });

  describe('validation', () => {
    it('should throw error for empty table number', () => {
      // Arrange
      const tableData = {
        businessId: 'restaurant-123',
        number: '',
        capacity: 4,
        location: TableLocation.INDOOR as const,
      };

      // Act & Assert
      expect(() => Table.create(tableData)).toThrow('Table number is required');
    });

    it('should throw error for zero or negative capacity', () => {
      // Arrange
      const tableData = {
        businessId: 'restaurant-123',
        number: 'T01',
        capacity: 0,
        location: TableLocation.INDOOR as const,
      };

      // Act & Assert
      expect(() => Table.create(tableData)).toThrow('Table capacity must be greater than 0');
    });

    it('should throw error for invalid location', () => {
      // Arrange
      const tableData = {
        businessId: 'restaurant-123',
        number: 'T01',
        capacity: 4,
        location: 'INVALID_LOCATION' as any,
      };

      // Act & Assert
      expect(() => Table.create(tableData)).toThrow('Invalid table location');
    });

    it('should throw error for empty business ID', () => {
      // Arrange
      const tableData = {
        businessId: '',
        number: 'T01',
        capacity: 4,
        location: TableLocation.INDOOR as const,
      };

      // Act & Assert
      expect(() => Table.create(tableData)).toThrow('Business ID is required');
    });
  });

  describe('table management', () => {
    it('should deactivate a table', () => {
      // Arrange
      const table = Table.create({
        businessId: 'restaurant-123',
        number: 'T01',
        capacity: 4,
        location: TableLocation.INDOOR as const,
      });

      // Act
      table.deactivate();

      // Assert
      expect(table.isActive).toBe(false);
      expect(table.updatedAt).toBeDefined();
    });

    it('should activate a table', () => {
      // Arrange
      const table = Table.create({
        businessId: 'restaurant-123',
        number: 'T01',
        capacity: 4,
        location: TableLocation.INDOOR as const,
      });
      table.deactivate();

      // Act
      table.activate();

      // Assert
      expect(table.isActive).toBe(true);
      expect(table.updatedAt).toBeDefined();
    });

    it('should update table information', () => {
      // Arrange
      const table = Table.create({
        businessId: 'restaurant-123',
        number: 'T01',
        capacity: 4,
        location: TableLocation.INDOOR as const,
        description: 'Old description',
      });

      // Act
      table.updateInfo({
        capacity: 6,
        location: TableLocation.OUTDOOR as const,
        description: 'New description',
      });

      // Assert
      expect(table.capacity).toBe(6);
      expect(table.location).toBe(TableLocation.OUTDOOR);
      expect(table.description).toBe('New description');
      expect(table.updatedAt).toBeDefined();
    });

    it('should not allow updating to invalid capacity', () => {
      // Arrange
      const table = Table.create({
        businessId: 'restaurant-123',
        number: 'T01',
        capacity: 4,
        location: TableLocation.INDOOR as const,
      });

      // Act & Assert
      expect(() => table.updateInfo({ capacity: 0 })).toThrow('Table capacity must be greater than 0');
    });

    it('should not allow updating to invalid location', () => {
      // Arrange
      const table = Table.create({
        businessId: 'restaurant-123',
        number: 'T01',
        capacity: 4,
        location: TableLocation.INDOOR as const,
      });

      // Act & Assert
      expect(() => table.updateInfo({ location: 'INVALID' as any })).toThrow('Invalid table location');
    });
  });

  describe('business logic', () => {
    it('should check if table can accommodate given guests', () => {
      // Arrange
      const table = Table.create({
        businessId: 'restaurant-123',
        number: 'T01',
        capacity: 4,
        location: TableLocation.INDOOR as const,
      });

      // Act & Assert
      expect(table.canAccommodate(2)).toBe(true);
      expect(table.canAccommodate(4)).toBe(true);
      expect(table.canAccommodate(5)).toBe(false);
    });

    it('should not be available if table is deactivated', () => {
      // Arrange
      const table = Table.create({
        businessId: 'restaurant-123',
        number: 'T01',
        capacity: 4,
        location: TableLocation.INDOOR as const,
      });
      table.deactivate();

      // Act & Assert
      expect(table.canAccommodate(2)).toBe(false);
    });

    it('should return location display name', () => {
      // Arrange
      const mainHallTable = Table.create({
        businessId: 'restaurant-123',
        number: 'T01',
        capacity: 4,
        location: TableLocation.INDOOR as const,
      });

      const terraceTable = Table.create({
        businessId: 'restaurant-123',
        number: 'T02',
        capacity: 2,
        location: TableLocation.OUTDOOR as const,
      });

      const privateTable = Table.create({
        businessId: 'restaurant-123',
        number: 'T03',
        capacity: 6,
        location: TableLocation.PATIO as const,
      });

      // Act & Assert
      expect(mainHallTable.getLocationDisplayName()).toBe('Indoor');
      expect(terraceTable.getLocationDisplayName()).toBe('Outdoor');
      expect(privateTable.getLocationDisplayName()).toBe('Patio');
    });

    it('should check if table is suitable for group size', () => {
      // Arrange
      const smallTable = Table.create({
        businessId: 'restaurant-123',
        number: 'T01',
        capacity: 2,
        location: TableLocation.INDOOR as const,
      });

      const largeTable = Table.create({
        businessId: 'restaurant-123',
        number: 'T02',
        capacity: 8,
        location: TableLocation.INDOOR as const,
      });

      // Act & Assert
      expect(smallTable.isSuitableForGroup(1)).toBe(true);
      expect(smallTable.isSuitableForGroup(2)).toBe(true);
      expect(smallTable.isSuitableForGroup(3)).toBe(false);

      expect(largeTable.isSuitableForGroup(6)).toBe(true);
      expect(largeTable.isSuitableForGroup(8)).toBe(true);
      expect(largeTable.isSuitableForGroup(9)).toBe(false);
    });

    it('should update table number', () => {
      // Arrange
      const table = Table.create({
        businessId: 'restaurant-123',
        number: 'T01',
        capacity: 4,
        location: TableLocation.INDOOR as const,
      });

      // Act
      table.updateNumber('T10');

      // Assert
      expect(table.number).toBe('T10');
      expect(table.updatedAt).toBeDefined();
    });

    it('should not allow updating to empty table number', () => {
      // Arrange
      const table = Table.create({
        businessId: 'restaurant-123',
        number: 'T01',
        capacity: 4,
        location: TableLocation.INDOOR as const,
      });

      // Act & Assert
      expect(() => table.updateNumber('')).toThrow('Table number is required');
    });
  });
});
