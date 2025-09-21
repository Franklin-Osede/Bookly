import { Injectable } from '@nestjs/common';
import { ReservationRepository } from '../../application/repositories/reservation.repository';
import { Reservation } from '../../domain/entities/reservation.entity';
import { Money } from '../../domain/value-objects/money';

@Injectable()
export class ReservationRepositoryImpl implements ReservationRepository {
  private reservations: Reservation[] = [];

  async save(reservation: Reservation): Promise<Reservation> {
    this.reservations.push(reservation);
    return reservation;
  }

  async findById(id: string): Promise<Reservation | null> {
    return this.reservations.find(reservation => reservation.id === id) || null;
  }

  async findByUserId(userId: string): Promise<Reservation[]> {
    return this.reservations.filter(reservation => reservation.userId === userId);
  }

  async findByBusinessId(businessId: string): Promise<Reservation[]> {
    return this.reservations.filter(reservation => reservation.businessId === businessId);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Reservation[]> {
    return this.reservations.filter(reservation => 
      reservation.startDate >= startDate && reservation.endDate <= endDate
    );
  }

  async findByStatus(status: string): Promise<Reservation[]> {
    return this.reservations.filter(reservation => reservation.status === status);
  }

  async findByType(type: string): Promise<Reservation[]> {
    return this.reservations.filter(reservation => reservation.type === type);
  }

  async findOverlappingReservations(
    businessId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Reservation[]> {
    return this.reservations.filter(reservation => 
      reservation.businessId === businessId &&
      reservation.status !== 'CANCELLED' &&
      (
        (reservation.startDate <= startDate && reservation.endDate > startDate) ||
        (reservation.startDate < endDate && reservation.endDate >= endDate) ||
        (reservation.startDate >= startDate && reservation.endDate <= endDate)
      )
    );
  }

  async update(id: string, data: any): Promise<Reservation> {
    const reservationIndex = this.reservations.findIndex(reservation => reservation.id === id);
    if (reservationIndex === -1) {
      throw new Error('Reservation not found');
    }

    const reservation = this.reservations[reservationIndex];
    
    if (data.status) {
      if (data.status === 'CONFIRMED') {
        reservation.confirm();
      } else if (data.status === 'CANCELLED') {
        reservation.cancel();
      } else if (data.status === 'COMPLETED') {
        reservation.complete();
      }
    }

    this.reservations[reservationIndex] = reservation;
    return reservation;
  }

  async delete(id: string): Promise<boolean> {
    const reservationIndex = this.reservations.findIndex(reservation => reservation.id === id);
    if (reservationIndex === -1) {
      return false;
    }

    this.reservations.splice(reservationIndex, 1);
    return true;
  }

  async findAll(): Promise<Reservation[]> {
    return [...this.reservations];
  }

  async exists(id: string): Promise<boolean> {
    return this.reservations.some(reservation => reservation.id === id);
  }

  async findActiveReservations(businessId: string): Promise<Reservation[]> {
    return this.reservations.filter(r => 
      r.businessId === businessId && r.status === 'CONFIRMED'
    );
  }

  async findUpcomingReservations(businessId: string, days: number = 7): Promise<Reservation[]> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + days);

    return this.reservations.filter(r => 
      r.businessId === businessId && 
      r.status === 'CONFIRMED' &&
      r.startDate >= startDate &&
      r.startDate <= endDate
    );
  }

  async countByStatus(status: string): Promise<number> {
    return this.reservations.filter(r => r.status === status).length;
  }

  async countByBusinessId(businessId: string): Promise<number> {
    return this.reservations.filter(r => r.businessId === businessId).length;
  }

  async getRevenueByBusinessId(businessId: string, startDate?: Date, endDate?: Date): Promise<number> {
    let filteredReservations = this.reservations.filter(r => 
      r.businessId === businessId && r.status === 'CONFIRMED'
    );

    if (startDate) {
      filteredReservations = filteredReservations.filter(r => r.startDate >= startDate);
    }

    if (endDate) {
      filteredReservations = filteredReservations.filter(r => r.endDate <= endDate);
    }

    return filteredReservations.reduce((total, r) => total + r.totalAmount.amount, 0);
  }
}
