import { Injectable } from '@nestjs/common';
import { TableRepository } from '../../application/repositories/table.repository';
import { Table } from '../../domain/entities/table.entity';

@Injectable()
export class TableRepositoryImpl implements TableRepository {
  private tables: Table[] = [];

  async save(table: Table): Promise<Table> {
    this.tables.push(table);
    return table;
  }

  async findById(id: string): Promise<Table | null> {
    return this.tables.find(table => table.id === id) || null;
  }

  async findByBusinessId(businessId: string): Promise<Table[]> {
    return this.tables.filter(table => table.businessId === businessId);
  }

  async findByNumber(businessId: string, number: string): Promise<Table | null> {
    return this.tables.find(table => 
      table.businessId === businessId && table.number === number
    ) || null;
  }

  async findByLocation(businessId: string, location: string): Promise<Table[]> {
    return this.tables.filter(table => 
      table.businessId === businessId && table.location === location
    );
  }

  async findByCapacity(businessId: string, minCapacity: number): Promise<Table[]> {
    return this.tables.filter(table => 
      table.businessId === businessId && table.capacity >= minCapacity
    );
  }

  async findActiveTables(businessId: string): Promise<Table[]> {
    return this.tables.filter(table => 
      table.businessId === businessId && table.isActive
    );
  }

  async update(id: string, data: any): Promise<Table> {
    const tableIndex = this.tables.findIndex(table => table.id === id);
    if (tableIndex === -1) {
      throw new Error('Table not found');
    }

    const table = this.tables[tableIndex];
    table.updateInfo(data);
    this.tables[tableIndex] = table;
    return table;
  }

  async delete(id: string): Promise<boolean> {
    const tableIndex = this.tables.findIndex(table => table.id === id);
    if (tableIndex === -1) {
      return false;
    }

    this.tables.splice(tableIndex, 1);
    return true;
  }

  async findAll(): Promise<Table[]> {
    return [...this.tables];
  }

  async findAvailableTables(businessId: string, startDate: Date, endDate: Date): Promise<Table[]> {
    // This method is implemented in the service layer
    // Repository just returns all tables, service filters by availability
    return this.findByBusinessId(businessId);
  }

  async exists(id: string): Promise<boolean> {
    return this.tables.some(table => table.id === id);
  }
}
