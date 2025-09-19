import { UserRepository } from '../repositories/user.repository';
import { BusinessRepository } from '../repositories/business.repository';
import { ReservationRepository } from '../repositories/reservation.repository';
import { RoomRepository } from '../../../hotel/application/repositories/room.repository';
import { TableRepository } from '../../../restaurant/application/repositories/table.repository';
import { User } from '../../domain/entities/user.entity';
import { Business } from '../../domain/entities/business.entity';
import { Reservation } from '../../domain/entities/reservation.entity';
import { Room } from '../../../hotel/domain/entities/room.entity';
import { Table } from '../../../restaurant/domain/entities/table.entity';
import { Money } from '../../domain/value-objects/money';

export interface CreateHotelReservationData {
  userId: string;
  businessId: string;
  startDate: Date;
  endDate: Date;
  guests: number;
  totalAmount: Money;
  notes?: string;
}

export interface CreateRestaurantReservationData {
  userId: string;
  businessId: string;
  startDate: Date;
  endDate: Date;
  guests: number;
  totalAmount: Money;
  notes?: string;
}

export interface AvailabilityResult {
  isAvailable: boolean;
  availableRooms?: Room[];
  availableTables?: Table[];
}

export class ReservationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly businessRepository: BusinessRepository,
    private readonly reservationRepository: ReservationRepository,
    private readonly roomRepository: RoomRepository,
    private readonly tableRepository: TableRepository
  ) {}

  async createHotelReservation(data: CreateHotelReservationData): Promise<Reservation> {
    // Validate user exists
    const user = await this.userRepository.findById(data.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate business exists and is a hotel
    const business = await this.businessRepository.findById(data.businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'HOTEL') {
      throw new Error('Business is not a hotel');
    }

    // Check if rooms are available
    const rooms = await this.roomRepository.findByBusinessId(data.businessId);
    if (rooms.length === 0) {
      throw new Error('No rooms available for this business');
    }

    // Check for overlapping reservations
    const overlappingReservations = await this.reservationRepository.findOverlappingReservations(
      data.businessId,
      data.startDate,
      data.endDate
    );

    if (overlappingReservations.length > 0) {
      throw new Error('No rooms available for the selected date range');
    }

    // Create reservation
    const reservation = Reservation.create({
      userId: data.userId,
      businessId: data.businessId,
      startDate: data.startDate,
      endDate: data.endDate,
      guests: data.guests,
      totalAmount: data.totalAmount,
      type: 'HOTEL',
      status: 'PENDING',
      notes: data.notes
    });

    // Save reservation
    return await this.reservationRepository.save(reservation);
  }

  async createRestaurantReservation(data: CreateRestaurantReservationData): Promise<Reservation> {
    // Validate user exists
    const user = await this.userRepository.findById(data.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate business exists and is a restaurant
    const business = await this.businessRepository.findById(data.businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'RESTAURANT') {
      throw new Error('Business is not a restaurant');
    }

    // Check if tables are available
    const tables = await this.tableRepository.findByBusinessId(data.businessId);
    if (tables.length === 0) {
      throw new Error('No tables available for this business');
    }

    // Check for overlapping reservations
    const overlappingReservations = await this.reservationRepository.findOverlappingReservations(
      data.businessId,
      data.startDate,
      data.endDate
    );

    if (overlappingReservations.length > 0) {
      throw new Error('No tables available for the selected date range');
    }

    // Create reservation
    const reservation = Reservation.create({
      userId: data.userId,
      businessId: data.businessId,
      startDate: data.startDate,
      endDate: data.endDate,
      guests: data.guests,
      totalAmount: data.totalAmount,
      type: 'RESTAURANT',
      status: 'PENDING',
      notes: data.notes
    });

    // Save reservation
    return await this.reservationRepository.save(reservation);
  }

  async confirmReservation(reservationId: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (reservation.status !== 'PENDING') {
      throw new Error('Only pending reservations can be confirmed');
    }

    reservation.confirm();
    return await this.reservationRepository.update(reservationId, { status: 'CONFIRMED' });
  }

  async cancelReservation(reservationId: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (reservation.status === 'COMPLETED') {
      throw new Error('Completed reservations cannot be cancelled');
    }

    reservation.cancel();
    return await this.reservationRepository.update(reservationId, { status: 'CANCELLED' });
  }

  async completeReservation(reservationId: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (reservation.status !== 'CONFIRMED') {
      throw new Error('Only confirmed reservations can be completed');
    }

    reservation.complete();
    return await this.reservationRepository.update(reservationId, { status: 'COMPLETED' });
  }

  async getUserReservations(userId: string): Promise<Reservation[]> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return await this.reservationRepository.findByUserId(userId);
  }

  async getBusinessReservations(businessId: string): Promise<Reservation[]> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    return await this.reservationRepository.findByBusinessId(businessId);
  }

  async getReservationById(reservationId: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    return reservation;
  }

  async checkAvailability(businessId: string, startDate: Date, endDate: Date): Promise<AvailabilityResult> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type === 'HOTEL') {
      return await this.checkHotelAvailability(businessId, startDate, endDate);
    } else if (business.type === 'RESTAURANT') {
      return await this.checkRestaurantAvailability(businessId, startDate, endDate);
    } else {
      throw new Error('Invalid business type');
    }
  }

  private async checkHotelAvailability(businessId: string, startDate: Date, endDate: Date): Promise<AvailabilityResult> {
    const rooms = await this.roomRepository.findByBusinessId(businessId);
    const overlappingReservations = await this.reservationRepository.findOverlappingReservations(
      businessId,
      startDate,
      endDate
    );

    // Filter out rooms that have overlapping reservations
    const availableRooms = rooms.filter(room => 
      !overlappingReservations.some(reservation => 
        reservation.businessId === businessId
      )
    );

    return {
      isAvailable: availableRooms.length > 0,
      availableRooms
    };
  }

  private async checkRestaurantAvailability(businessId: string, startDate: Date, endDate: Date): Promise<AvailabilityResult> {
    const tables = await this.tableRepository.findByBusinessId(businessId);
    const overlappingReservations = await this.reservationRepository.findOverlappingReservations(
      businessId,
      startDate,
      endDate
    );

    // Filter out tables that have overlapping reservations
    const availableTables = tables.filter(table => 
      !overlappingReservations.some(reservation => 
        reservation.businessId === businessId
      )
    );

    return {
      isAvailable: availableTables.length > 0,
      availableTables
    };
  }

  async getReservationsByDateRange(startDate: Date, endDate: Date): Promise<Reservation[]> {
    return await this.reservationRepository.findByDateRange(startDate, endDate);
  }

  async getReservationsByStatus(status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'): Promise<Reservation[]> {
    return await this.reservationRepository.findByStatus(status);
  }

  async getReservationsByType(type: 'HOTEL' | 'RESTAURANT'): Promise<Reservation[]> {
    return await this.reservationRepository.findByType(type);
  }
}
