import { BusinessRepository } from '../../../shared/application/repositories/business.repository';
import { TableRepository } from '../repositories/table.repository';
import { ReservationRepository } from '../../../shared/application/repositories/reservation.repository';
import { Business } from '../../../shared/domain/entities/business.entity';
import { Table, TableLocation } from '../../domain/entities/table.entity';
import { Reservation } from '../../../shared/domain/entities/reservation.entity';
import { REPOSITORY_TOKENS } from '../../../shared/application/tokens/repository.tokens';
import { Inject } from '@nestjs/common';

export interface CreateTableData {
  businessId: string;
  number: string;
  capacity: number;
  location: TableLocation;
  description?: string;
}

export interface UpdateTableData {
  capacity?: number;
  location?: TableLocation;
  description?: string;
  isActive?: boolean;
}

export class TableService {
  constructor(
    @Inject(REPOSITORY_TOKENS.BUSINESS_REPOSITORY)
    private readonly businessRepository: BusinessRepository,
    @Inject(REPOSITORY_TOKENS.TABLE_REPOSITORY)
    private readonly tableRepository: TableRepository,
    @Inject(REPOSITORY_TOKENS.RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepository
  ) {}

  async createTable(data: CreateTableData): Promise<Table> {
    // Validate business exists and is a restaurant
    const business = await this.businessRepository.findById(data.businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'RESTAURANT') {
      throw new Error('Business is not a restaurant');
    }

    // Check if table number already exists
    const existingTable = await this.tableRepository.findByNumber(data.businessId, data.number);
    if (existingTable) {
      throw new Error('Table number already exists for this business');
    }

    // Create table
    const table = Table.create({
      businessId: data.businessId,
      number: data.number,
      capacity: data.capacity,
      location: data.location,
      description: data.description,
      isActive: true
    });

    // Save table
    return await this.tableRepository.save(table);
  }

  async updateTable(tableId: string, data: UpdateTableData): Promise<Table> {
    const table = await this.tableRepository.findById(tableId);
    if (!table) {
      throw new Error('Table not found');
    }

    // Update table
    return await this.tableRepository.update(tableId, data);
  }

  async activateTable(tableId: string): Promise<Table> {
    const table = await this.tableRepository.findById(tableId);
    if (!table) {
      throw new Error('Table not found');
    }

    return await this.tableRepository.update(tableId, { isActive: true });
  }

  async deactivateTable(tableId: string): Promise<Table> {
    const table = await this.tableRepository.findById(tableId);
    if (!table) {
      throw new Error('Table not found');
    }

    return await this.tableRepository.update(tableId, { isActive: false });
  }

  async getTablesByBusiness(businessId: string): Promise<Table[]> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'RESTAURANT') {
      throw new Error('Business is not a restaurant');
    }

    return await this.tableRepository.findByBusinessId(businessId);
  }

  async getAvailableTables(businessId: string, startDate: Date, endDate: Date): Promise<Table[]> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'RESTAURANT') {
      throw new Error('Business is not a restaurant');
    }

    // Get all tables for the business
    const allTables = await this.tableRepository.findByBusinessId(businessId);
    
    // Get overlapping reservations
    const overlappingReservations = await this.reservationRepository.findOverlappingReservations(
      businessId,
      startDate,
      endDate
    );

    // Filter out tables that have overlapping reservations
    const availableTables = allTables.filter(table => 
      !overlappingReservations.some(reservation => 
        reservation.businessId === businessId
      )
    );

    return availableTables;
  }

  async getTablesByLocation(businessId: string, location: 'INDOOR' | 'OUTDOOR' | 'PATIO' | 'BAR'): Promise<Table[]> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'RESTAURANT') {
      throw new Error('Business is not a restaurant');
    }

    return await this.tableRepository.findByLocation(businessId, location);
  }

  async getTablesByCapacity(businessId: string, minCapacity: number): Promise<Table[]> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'RESTAURANT') {
      throw new Error('Business is not a restaurant');
    }

    return await this.tableRepository.findByCapacity(businessId, minCapacity);
  }

  async getActiveTables(businessId: string): Promise<Table[]> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'RESTAURANT') {
      throw new Error('Business is not a restaurant');
    }

    return await this.tableRepository.findActiveTables(businessId);
  }

  async deleteTable(tableId: string): Promise<boolean> {
    const table = await this.tableRepository.findById(tableId);
    if (!table) {
      throw new Error('Table not found');
    }

    return await this.tableRepository.delete(tableId);
  }

  async getTableById(tableId: string): Promise<Table> {
    const table = await this.tableRepository.findById(tableId);
    if (!table) {
      throw new Error('Table not found');
    }

    return table;
  }

  async getAllTables(): Promise<Table[]> {
    return await this.tableRepository.findAll();
  }

  async getTableByNumber(businessId: string, number: string): Promise<Table> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'RESTAURANT') {
      throw new Error('Business is not a restaurant');
    }

    const table = await this.tableRepository.findByNumber(businessId, number);
    if (!table) {
      throw new Error('Table not found');
    }

    return table;
  }

  async checkTableAvailability(tableId: string, startDate: Date, endDate: Date): Promise<boolean> {
    const table = await this.tableRepository.findById(tableId);
    if (!table) {
      throw new Error('Table not found');
    }

    if (!table.isActive) {
      return false;
    }

    // Check for overlapping reservations
    const overlappingReservations = await this.reservationRepository.findOverlappingReservations(
      table.businessId,
      startDate,
      endDate
    );

    return overlappingReservations.length === 0;
  }

  async getTableOccupancyRate(businessId: string, startDate: Date, endDate: Date): Promise<number> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'RESTAURANT') {
      throw new Error('Business is not a restaurant');
    }

    const allTables = await this.tableRepository.findByBusinessId(businessId);
    const overlappingReservations = await this.reservationRepository.findOverlappingReservations(
      businessId,
      startDate,
      endDate
    );

    if (allTables.length === 0) {
      return 0;
    }

    const occupiedTables = overlappingReservations.length;
    return (occupiedTables / allTables.length) * 100;
  }

  async getTablesByLocationAndCapacity(
    businessId: string, 
    location: 'INDOOR' | 'OUTDOOR' | 'PATIO' | 'BAR',
    minCapacity: number
  ): Promise<Table[]> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'RESTAURANT') {
      throw new Error('Business is not a restaurant');
    }

    // Get tables by location first
    const tablesByLocation = await this.tableRepository.findByLocation(businessId, location);
    
    // Filter by capacity
    return tablesByLocation.filter(table => table.capacity >= minCapacity);
  }

  async getOutdoorTables(businessId: string): Promise<Table[]> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'RESTAURANT') {
      throw new Error('Business is not a restaurant');
    }

    const allTables = await this.tableRepository.findByBusinessId(businessId);
    return allTables.filter(table => table.isOutdoor());
  }

  async getIndoorTables(businessId: string): Promise<Table[]> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'RESTAURANT') {
      throw new Error('Business is not a restaurant');
    }

    const allTables = await this.tableRepository.findByBusinessId(businessId);
    return allTables.filter(table => table.isIndoor());
  }

  async getBarAreaTables(businessId: string): Promise<Table[]> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'RESTAURANT') {
      throw new Error('Business is not a restaurant');
    }

    const allTables = await this.tableRepository.findByBusinessId(businessId);
    return allTables.filter(table => table.isInBarArea());
  }

  async getTablesByCapacityCategory(
    businessId: string, 
    category: 'SMALL' | 'MEDIUM' | 'LARGE'
  ): Promise<Table[]> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'RESTAURANT') {
      throw new Error('Business is not a restaurant');
    }

    const allTables = await this.tableRepository.findByBusinessId(businessId);
    return allTables.filter(table => table.getCapacityCategory() === category);
  }

  async getTableStatistics(businessId: string): Promise<{
    totalTables: number;
    activeTables: number;
    inactiveTables: number;
    tablesByLocation: Record<string, number>;
    tablesByCapacity: Record<string, number>;
  }> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'RESTAURANT') {
      throw new Error('Business is not a restaurant');
    }

    const allTables = await this.tableRepository.findByBusinessId(businessId);
    const activeTables = allTables.filter(table => table.isActive);
    const inactiveTables = allTables.filter(table => !table.isActive);

    const tablesByLocation = allTables.reduce((acc, table) => {
      acc[table.location] = (acc[table.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tablesByCapacity = allTables.reduce((acc, table) => {
      const category = table.getCapacityCategory();
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalTables: allTables.length,
      activeTables: activeTables.length,
      inactiveTables: inactiveTables.length,
      tablesByLocation,
      tablesByCapacity
    };
  }
}
