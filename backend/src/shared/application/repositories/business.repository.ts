import { Business } from '../../domain/entities/business.entity';
import { Email } from '../../domain/value-objects/email';

export interface BusinessRepository {
  /**
   * Save a business to the repository
   * @param business - The business to save
   * @returns Promise<Business> - The saved business
   */
  save(business: Business): Promise<Business>;

  /**
   * Find a business by ID
   * @param id - The business ID
   * @returns Promise<Business | null> - The business if found, null otherwise
   */
  findById(id: string): Promise<Business | null>;

  /**
   * Find a business by email
   * @param email - The business email
   * @returns Promise<Business | null> - The business if found, null otherwise
   */
  findByEmail(email: Email): Promise<Business | null>;

  /**
   * Find businesses by owner ID
   * @param ownerId - The owner ID
   * @returns Promise<Business[]> - Array of businesses owned by the user
   */
  findByOwnerId(ownerId: string): Promise<Business[]>;

  /**
   * Find businesses by type
   * @param type - The business type (HOTEL or RESTAURANT)
   * @returns Promise<Business[]> - Array of businesses of the specified type
   */
  findByType(type: 'HOTEL' | 'RESTAURANT'): Promise<Business[]>;

  /**
   * Find businesses by location
   * @param city - The city name
   * @param state - The state name
   * @returns Promise<Business[]> - Array of businesses in the specified location
   */
  findByLocation(city: string, state: string): Promise<Business[]>;

  /**
   * Find all businesses
   * @returns Promise<Business[]> - Array of all businesses
   */
  findAll(): Promise<Business[]>;

  /**
   * Update a business by ID
   * @param id - The business ID
   * @param business - Partial business data to update
   * @returns Promise<Business | null> - The updated business if found, null otherwise
   */
  update(id: string, business: Partial<Business>): Promise<Business | null>;

  /**
   * Delete a business by ID
   * @param id - The business ID
   * @returns Promise<boolean> - True if deleted, false if not found
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if a business exists by ID
   * @param id - The business ID
   * @returns Promise<boolean> - True if exists, false otherwise
   */
  exists(id: string): Promise<boolean>;
}


