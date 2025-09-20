import { BusinessRepository } from '../../../shared/application/repositories/business.repository';
import { RoomRepository } from '../repositories/room.repository';
import { ReservationRepository } from '../../../shared/application/repositories/reservation.repository';
import { Business } from '../../../shared/domain/entities/business.entity';
import { Room, RoomType } from '../../domain/entities/room.entity';
import { Reservation } from '../../../shared/domain/entities/reservation.entity';
import { Money } from '../../../shared/domain/value-objects/money';
import { REPOSITORY_TOKENS } from '../../../shared/application/tokens/repository.tokens';
import { Inject } from '@nestjs/common';

export interface CreateRoomData {
  businessId: string;
  number: string;
  type: RoomType;
  capacity: number;
  price: Money;
  description?: string;
}

export interface UpdateRoomData {
  type?: RoomType;
  capacity?: number;
  price?: Money;
  description?: string;
  isActive?: boolean;
}

export class RoomService {
  constructor(
    @Inject(REPOSITORY_TOKENS.BUSINESS_REPOSITORY)
    private readonly businessRepository: BusinessRepository,
    @Inject(REPOSITORY_TOKENS.ROOM_REPOSITORY)
    private readonly roomRepository: RoomRepository,
    @Inject(REPOSITORY_TOKENS.RESERVATION_REPOSITORY)
    private readonly reservationRepository: ReservationRepository
  ) {}

  async createRoom(data: CreateRoomData): Promise<Room> {
    // Validate business exists and is a hotel
    const business = await this.businessRepository.findById(data.businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'HOTEL') {
      throw new Error('Business is not a hotel');
    }

    // Check if room number already exists
    const existingRoom = await this.roomRepository.findByNumber(data.businessId, data.number);
    if (existingRoom) {
      throw new Error('Room number already exists for this business');
    }

    // Create room
    const room = Room.create({
      businessId: data.businessId,
      number: data.number,
      type: data.type,
      capacity: data.capacity,
      price: data.price,
      description: data.description,
      isActive: true
    });

    // Save room
    return await this.roomRepository.save(room);
  }

  async updateRoom(roomId: string, data: UpdateRoomData): Promise<Room> {
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    // Update room
    return await this.roomRepository.update(roomId, data);
  }

  async activateRoom(roomId: string): Promise<Room> {
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    return await this.roomRepository.update(roomId, { isActive: true });
  }

  async deactivateRoom(roomId: string): Promise<Room> {
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    return await this.roomRepository.update(roomId, { isActive: false });
  }

  async getRoomsByBusiness(businessId: string): Promise<Room[]> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'HOTEL') {
      throw new Error('Business is not a hotel');
    }

    return await this.roomRepository.findByBusinessId(businessId);
  }

  async getAvailableRooms(businessId: string, startDate: Date, endDate: Date): Promise<Room[]> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'HOTEL') {
      throw new Error('Business is not a hotel');
    }

    // Get all rooms for the business
    const allRooms = await this.roomRepository.findByBusinessId(businessId);
    
    // Get overlapping reservations
    const overlappingReservations = await this.reservationRepository.findOverlappingReservations(
      businessId,
      startDate,
      endDate
    );

    // Filter out rooms that have overlapping reservations
    const availableRooms = allRooms.filter(room => 
      !overlappingReservations.some(reservation => 
        reservation.businessId === businessId
      )
    );

    return availableRooms;
  }

  async getRoomsByType(businessId: string, type: 'SINGLE' | 'DOUBLE' | 'SUITE' | 'DELUXE'): Promise<Room[]> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'HOTEL') {
      throw new Error('Business is not a hotel');
    }

    return await this.roomRepository.findByType(businessId, type);
  }

  async getRoomsByCapacity(businessId: string, minCapacity: number): Promise<Room[]> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'HOTEL') {
      throw new Error('Business is not a hotel');
    }

    return await this.roomRepository.findByCapacity(businessId, minCapacity);
  }

  async getRoomsByPriceRange(businessId: string, minPrice: Money, maxPrice: Money): Promise<Room[]> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'HOTEL') {
      throw new Error('Business is not a hotel');
    }

    return await this.roomRepository.findByPriceRange(businessId, minPrice, maxPrice);
  }

  async getActiveRooms(businessId: string): Promise<Room[]> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'HOTEL') {
      throw new Error('Business is not a hotel');
    }

    return await this.roomRepository.findActiveRooms(businessId);
  }

  async deleteRoom(roomId: string): Promise<boolean> {
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    return await this.roomRepository.delete(roomId);
  }

  async getRoomById(roomId: string): Promise<Room> {
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    return room;
  }

  async getAllRooms(): Promise<Room[]> {
    return await this.roomRepository.findAll();
  }

  async getRoomByNumber(businessId: string, number: string): Promise<Room> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'HOTEL') {
      throw new Error('Business is not a hotel');
    }

    const room = await this.roomRepository.findByNumber(businessId, number);
    if (!room) {
      throw new Error('Room not found');
    }

    return room;
  }

  async checkRoomAvailability(roomId: string, startDate: Date, endDate: Date): Promise<boolean> {
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (!room.isActive) {
      return false;
    }

    // Check for overlapping reservations
    const overlappingReservations = await this.reservationRepository.findOverlappingReservations(
      room.businessId,
      startDate,
      endDate
    );

    return overlappingReservations.length === 0;
  }

  async getRoomOccupancyRate(businessId: string, startDate: Date, endDate: Date): Promise<number> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'HOTEL') {
      throw new Error('Business is not a hotel');
    }

    const allRooms = await this.roomRepository.findByBusinessId(businessId);
    const overlappingReservations = await this.reservationRepository.findOverlappingReservations(
      businessId,
      startDate,
      endDate
    );

    if (allRooms.length === 0) {
      return 0;
    }

    const occupiedRooms = overlappingReservations.length;
    return (occupiedRooms / allRooms.length) * 100;
  }

  async getRoomRevenue(businessId: string, startDate: Date, endDate: Date): Promise<Money> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new Error('Business not found');
    }

    if (business.type !== 'HOTEL') {
      throw new Error('Business is not a hotel');
    }

    const reservations = await this.reservationRepository.findByDateRange(startDate, endDate);
    const businessReservations = reservations.filter(reservation => 
      reservation.businessId === businessId && 
      reservation.type === 'HOTEL' &&
      reservation.status === 'COMPLETED'
    );

    if (businessReservations.length === 0) {
      return new Money(0, 'USD');
    }

    const totalRevenue = businessReservations.reduce((sum, reservation) => {
      return sum.add(reservation.totalAmount);
    }, new Money(0, 'USD'));

    return totalRevenue;
  }
}
