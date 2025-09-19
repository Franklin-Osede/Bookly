import { Reservation } from '../../domain/entities/reservation.entity';

export interface ReservationRepository {
  /**
   * Save a reservation to the repository
   * @param reservation - The reservation to save
   * @returns Promise<Reservation> - The saved reservation
   */
  save(reservation: Reservation): Promise<Reservation>;

  /**
   * Find a reservation by ID
   * @param id - The reservation ID
   * @returns Promise<Reservation | null> - The reservation if found, null otherwise
   */
  findById(id: string): Promise<Reservation | null>;

  /**
   * Find reservations by user ID
   * @param userId - The user ID
   * @returns Promise<Reservation[]> - Array of reservations for the user
   */
  findByUserId(userId: string): Promise<Reservation[]>;

  /**
   * Find reservations by business ID
   * @param businessId - The business ID
   * @returns Promise<Reservation[]> - Array of reservations for the business
   */
  findByBusinessId(businessId: string): Promise<Reservation[]>;

  /**
   * Find reservations by date range
   * @param startDate - The start date
   * @param endDate - The end date
   * @returns Promise<Reservation[]> - Array of reservations within the date range
   */
  findByDateRange(startDate: Date, endDate: Date): Promise<Reservation[]>;

  /**
   * Find reservations by status
   * @param status - The reservation status
   * @returns Promise<Reservation[]> - Array of reservations with the specified status
   */
  findByStatus(status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'): Promise<Reservation[]>;

  /**
   * Find reservations by type
   * @param type - The reservation type (HOTEL or RESTAURANT)
   * @returns Promise<Reservation[]> - Array of reservations of the specified type
   */
  findByType(type: 'HOTEL' | 'RESTAURANT'): Promise<Reservation[]>;

  /**
   * Find overlapping reservations for a business within a date range
   * @param businessId - The business ID
   * @param startDate - The start date
   * @param endDate - The end date
   * @returns Promise<Reservation[]> - Array of overlapping reservations
   */
  findOverlappingReservations(businessId: string, startDate: Date, endDate: Date): Promise<Reservation[]>;

  /**
   * Find all reservations
   * @returns Promise<Reservation[]> - Array of all reservations
   */
  findAll(): Promise<Reservation[]>;

  /**
   * Update a reservation by ID
   * @param id - The reservation ID
   * @param reservation - Partial reservation data to update
   * @returns Promise<Reservation | null> - The updated reservation if found, null otherwise
   */
  update(id: string, reservation: Partial<Reservation>): Promise<Reservation | null>;

  /**
   * Delete a reservation by ID
   * @param id - The reservation ID
   * @returns Promise<boolean> - True if deleted, false if not found
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if a reservation exists by ID
   * @param id - The reservation ID
   * @returns Promise<boolean> - True if exists, false otherwise
   */
  exists(id: string): Promise<boolean>;
}
