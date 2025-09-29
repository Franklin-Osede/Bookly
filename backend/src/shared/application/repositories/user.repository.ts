import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email';

export interface UserRepository {
  /**
   * Save a user to the repository
   * @param user - The user to save
   * @returns Promise<User> - The saved user
   */
  save(user: User): Promise<User>;

  /**
   * Find a user by ID
   * @param id - The user ID
   * @returns Promise<User | null> - The user if found, null otherwise
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find a user by email
   * @param email - The user email
   * @returns Promise<User | null> - The user if found, null otherwise
   */
  findByEmail(email: Email): Promise<User | null>;

  /**
   * Find all users
   * @returns Promise<User[]> - Array of all users
   */
  findAll(): Promise<User[]>;

  /**
   * Update a user by ID
   * @param id - The user ID
   * @param user - Partial user data to update
   * @returns Promise<User | null> - The updated user if found, null otherwise
   */
  update(id: string, user: Partial<User>): Promise<User | null>;

  /**
   * Delete a user by ID
   * @param id - The user ID
   * @returns Promise<boolean> - True if deleted, false if not found
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if a user exists by ID
   * @param id - The user ID
   * @returns Promise<boolean> - True if exists, false otherwise
   */
  exists(id: string): Promise<boolean>;
}





