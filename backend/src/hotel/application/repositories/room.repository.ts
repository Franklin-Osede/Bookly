import { Room } from '../../domain/entities/room.entity';
import { Money } from '../../../shared/domain/value-objects/money';

export interface RoomRepository {
  /**
   * Save a room to the repository
   * @param room - The room to save
   * @returns Promise<Room> - The saved room
   */
  save(room: Room): Promise<Room>;

  /**
   * Find a room by ID
   * @param id - The room ID
   * @returns Promise<Room | null> - The room if found, null otherwise
   */
  findById(id: string): Promise<Room | null>;

  /**
   * Find rooms by business ID
   * @param businessId - The business ID
   * @returns Promise<Room[]> - Array of rooms for the business
   */
  findByBusinessId(businessId: string): Promise<Room[]>;

  /**
   * Find a room by business ID and room number
   * @param businessId - The business ID
   * @param number - The room number
   * @returns Promise<Room | null> - The room if found, null otherwise
   */
  findByNumber(businessId: string, number: string): Promise<Room | null>;

  /**
   * Find rooms by type within a business
   * @param businessId - The business ID
   * @param type - The room type
   * @returns Promise<Room[]> - Array of rooms of the specified type
   */
  findByType(businessId: string, type: 'SINGLE' | 'DOUBLE' | 'SUITE' | 'DELUXE'): Promise<Room[]>;

  /**
   * Find rooms by minimum capacity within a business
   * @param businessId - The business ID
   * @param minCapacity - The minimum capacity required
   * @returns Promise<Room[]> - Array of rooms with at least the specified capacity
   */
  findByCapacity(businessId: string, minCapacity: number): Promise<Room[]>;

  /**
   * Find available rooms for a date range within a business
   * @param businessId - The business ID
   * @param startDate - The start date
   * @param endDate - The end date
   * @returns Promise<Room[]> - Array of available rooms
   */
  findAvailableRooms(businessId: string, startDate: Date, endDate: Date): Promise<Room[]>;

  /**
   * Find rooms within a price range within a business
   * @param businessId - The business ID
   * @param minPrice - The minimum price
   * @param maxPrice - The maximum price
   * @returns Promise<Room[]> - Array of rooms within the price range
   */
  findByPriceRange(businessId: string, minPrice: Money, maxPrice: Money): Promise<Room[]>;

  /**
   * Find active rooms within a business
   * @param businessId - The business ID
   * @returns Promise<Room[]> - Array of active rooms
   */
  findActiveRooms(businessId: string): Promise<Room[]>;

  /**
   * Find all rooms
   * @returns Promise<Room[]> - Array of all rooms
   */
  findAll(): Promise<Room[]>;

  /**
   * Update a room by ID
   * @param id - The room ID
   * @param room - Partial room data to update
   * @returns Promise<Room | null> - The updated room if found, null otherwise
   */
  update(id: string, room: Partial<Room>): Promise<Room | null>;

  /**
   * Delete a room by ID
   * @param id - The room ID
   * @returns Promise<boolean> - True if deleted, false if not found
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if a room exists by ID
   * @param id - The room ID
   * @returns Promise<boolean> - True if exists, false otherwise
   */
  exists(id: string): Promise<boolean>;
}






