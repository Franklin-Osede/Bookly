import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation, CreateHotelReservationRequest, CreateRestaurantReservationRequest } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  constructor(private http: HttpClient) {}

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
}
