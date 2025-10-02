import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Reservation, CreateHotelReservationRequest, CreateRestaurantReservationRequest } from '../models/reservation.model';

interface ReservationStats {
  totalReservations: number;
  confirmedReservations: number;
  pendingReservations: number;
  totalRevenue: number;
  occupancyRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  constructor(private http: HttpClient) {}

  // Métodos existentes
  createHotelReservation(request: CreateHotelReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>('/api/v1/reservations/hotel', request);
  }

  createRestaurantReservation(request: CreateRestaurantReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>('/api/v1/reservations/restaurant', request);
  }

  getUserReservations(userId: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`/api/v1/reservations/user/${userId}`);
  }

  getBusinessReservations(businessId: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`/api/v1/reservations/business/${businessId}`);
  }

  confirmReservation(reservationId: string): Observable<Reservation> {
    return this.http.put<Reservation>(`/api/v1/reservations/${reservationId}/confirm`, {});
  }

  cancelReservation(reservationId: string): Observable<Reservation> {
    return this.http.put<Reservation>(`/api/v1/reservations/${reservationId}/cancel`, {});
  }

  getReservationById(reservationId: string): Observable<Reservation> {
    return this.http.get<Reservation>(`/api/v1/reservations/${reservationId}`);
  }

  // Nuevos métodos para Dashboard
  getReservations(): Observable<Reservation[]> {
    // TODO: Implementar llamada real al backend
    // Por ahora, datos mock para demo
    const mockReservations: Reservation[] = [
      {
        id: '1',
        businessId: 'business-1',
        userId: 'user-1',
        roomId: 'room-1',
        tableId: undefined,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-17'),
        numberOfGuests: 2,
        status: 'CONFIRMED',
        totalAmountAmount: 150,
        totalAmountCurrency: 'EUR',
        specialRequests: 'Vista al mar',
        customerName: 'Juan Pérez',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: '2',
        businessId: 'business-1',
        userId: 'user-2',
        roomId: undefined,
        tableId: 'table-1',
        startDate: new Date('2024-01-16'),
        endDate: new Date('2024-01-16'),
        numberOfGuests: 4,
        status: 'PENDING',
        totalAmountAmount: 80,
        totalAmountCurrency: 'EUR',
        specialRequests: 'Mesa cerca de la ventana',
        customerName: 'María García',
        createdAt: new Date('2024-01-11'),
        updatedAt: new Date('2024-01-11')
      },
      {
        id: '3',
        businessId: 'business-1',
        userId: 'user-3',
        roomId: 'room-2',
        tableId: undefined,
        startDate: new Date('2024-01-18'),
        endDate: new Date('2024-01-20'),
        numberOfGuests: 1,
        status: 'CONFIRMED',
        totalAmountAmount: 200,
        totalAmountCurrency: 'EUR',
        specialRequests: 'Suite de lujo',
        customerName: 'Carlos López',
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12')
      }
    ];
    
    return of(mockReservations);
  }

  getReservationsStats(): Observable<ReservationStats> {
    // TODO: Implementar llamada real al backend
    // Por ahora, datos mock para demo
    const mockStats: ReservationStats = {
      totalReservations: 25,
      confirmedReservations: 20,
      pendingReservations: 5,
      totalRevenue: 15000,
      occupancyRate: 85
    };
    
    return of(mockStats);
  }
}
