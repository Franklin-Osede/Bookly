import { Table } from '../../domain/entities/table.entity';

export interface TableRepository {
  /**
   * Save a table to the repository
   * @param table - The table to save
   * @returns Promise<Table> - The saved table
   */
  save(table: Table): Promise<Table>;

  /**
   * Find a table by ID
   * @param id - The table ID
   * @returns Promise<Table | null> - The table if found, null otherwise
   */
  findById(id: string): Promise<Table | null>;

  /**
   * Find tables by business ID
   * @param businessId - The business ID
   * @returns Promise<Table[]> - Array of tables for the business
   */
  findByBusinessId(businessId: string): Promise<Table[]>;

  /**
   * Find a table by business ID and table number
   * @param businessId - The business ID
   * @param number - The table number
   * @returns Promise<Table | null> - The table if found, null otherwise
   */
  findByNumber(businessId: string, number: string): Promise<Table | null>;

  /**
   * Find tables by location within a business
   * @param businessId - The business ID
   * @param location - The table location
   * @returns Promise<Table[]> - Array of tables in the specified location
   */
  findByLocation(businessId: string, location: 'INDOOR' | 'OUTDOOR' | 'PATIO' | 'BAR'): Promise<Table[]>;

  /**
   * Find tables by minimum capacity within a business
   * @param businessId - The business ID
   * @param minCapacity - The minimum capacity required
   * @returns Promise<Table[]> - Array of tables with at least the specified capacity
   */
  findByCapacity(businessId: string, minCapacity: number): Promise<Table[]>;

  /**
   * Find available tables for a date range within a business
   * @param businessId - The business ID
   * @param startDate - The start date
   * @param endDate - The end date
   * @returns Promise<Table[]> - Array of available tables
   */
  findAvailableTables(businessId: string, startDate: Date, endDate: Date): Promise<Table[]>;

  /**
   * Find active tables within a business
   * @param businessId - The business ID
   * @returns Promise<Table[]> - Array of active tables
   */
  findActiveTables(businessId: string): Promise<Table[]>;

  /**
   * Find all tables
   * @returns Promise<Table[]> - Array of all tables
   */
  findAll(): Promise<Table[]>;

  /**
   * Update a table by ID
   * @param id - The table ID
   * @param table - Partial table data to update
   * @returns Promise<Table | null> - The updated table if found, null otherwise
   */
  update(id: string, table: Partial<Table>): Promise<Table | null>;

  /**
   * Delete a table by ID
   * @param id - The table ID
   * @returns Promise<boolean> - True if deleted, false if not found
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if a table exists by ID
   * @param id - The table ID
   * @returns Promise<boolean> - True if exists, false otherwise
   */
  exists(id: string): Promise<boolean>;
}


