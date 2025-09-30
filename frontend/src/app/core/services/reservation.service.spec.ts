import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReservationService } from './reservation.service';
import { Reservation, CreateHotelReservationRequest, CreateRestaurantReservationRequest } from '../models/reservation.model';

describe('ReservationService', () => {
  let service: ReservationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReservationService]
    });
    service = TestBed.inject(ReservationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createHotelReservation', () => {
    it('should create hotel reservation successfully', () => {
      const request: CreateHotelReservationRequest = {
        businessId: 'hotel-1',
        roomId: 'room-1',
        startDate: '2024-10-15',
        endDate: '2024-10-17',
        numberOfGuests: 2,
        specialRequests: 'Late checkout'
      };

      const mockResponse: Reservation = {
        id: 'reservation-1',
        userId: 'user-1',
        businessId: 'hotel-1',
        roomId: 'room-1',
        startDate: new Date('2024-10-15'),
        endDate: new Date('2024-10-17'),
        numberOfGuests: 2,
        status: 'PENDING',
        totalAmount: {
          amount: 200,
          currency: 'USD'
        },
        specialRequests: 'Late checkout',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      service.createHotelReservation(request).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/v1/reservations/hotel');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });
  });

  describe('createRestaurantReservation', () => {
    it('should create restaurant reservation successfully', () => {
      const request: CreateRestaurantReservationRequest = {
        businessId: 'restaurant-1',
        tableId: 'table-1',
        startDate: '2024-10-15T20:00:00Z',
        endDate: '2024-10-15T22:00:00Z',
        numberOfGuests: 4,
        specialRequests: 'Birthday celebration'
      };

      const mockResponse: Reservation = {
        id: 'reservation-2',
        userId: 'user-1',
        businessId: 'restaurant-1',
        tableId: 'table-1',
        startDate: new Date('2024-10-15T20:00:00Z'),
        endDate: new Date('2024-10-15T22:00:00Z'),
        numberOfGuests: 4,
        status: 'PENDING',
        totalAmount: {
          amount: 0,
          currency: 'USD'
        },
        specialRequests: 'Birthday celebration',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      service.createRestaurantReservation(request).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/v1/reservations/restaurant');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });
  });

  describe('getUserReservations', () => {
    it('should get user reservations', () => {
      const userId = 'user-1';
      const mockReservations: Reservation[] = [
        {
          id: 'reservation-1',
          userId: 'user-1',
          businessId: 'hotel-1',
          roomId: 'room-1',
          startDate: new Date('2024-10-15'),
          endDate: new Date('2024-10-17'),
          numberOfGuests: 2,
          status: 'CONFIRMED',
          totalAmount: {
            amount: 200,
            currency: 'USD'
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      service.getUserReservations(userId).subscribe(reservations => {
        expect(reservations).toEqual(mockReservations);
      });

      const req = httpMock.expectOne(`/api/v1/reservations/user/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockReservations);
    });
  });

  describe('getBusinessReservations', () => {
    it('should get business reservations', () => {
      const businessId = 'hotel-1';
      const mockReservations: Reservation[] = [
        {
          id: 'reservation-1',
          userId: 'user-1',
          businessId: 'hotel-1',
          roomId: 'room-1',
          startDate: new Date('2024-10-15'),
          endDate: new Date('2024-10-17'),
          numberOfGuests: 2,
          status: 'CONFIRMED',
          totalAmount: {
            amount: 200,
            currency: 'USD'
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      service.getBusinessReservations(businessId).subscribe(reservations => {
        expect(reservations).toEqual(mockReservations);
      });

      const req = httpMock.expectOne(`/api/v1/reservations/business/${businessId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockReservations);
    });
  });

  describe('confirmReservation', () => {
    it('should confirm reservation', () => {
      const reservationId = 'reservation-1';
      const mockResponse: Reservation = {
        id: 'reservation-1',
        userId: 'user-1',
        businessId: 'hotel-1',
        roomId: 'room-1',
        startDate: new Date('2024-10-15'),
        endDate: new Date('2024-10-17'),
        numberOfGuests: 2,
        status: 'CONFIRMED',
        totalAmount: {
          amount: 200,
          currency: 'USD'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      service.confirmReservation(reservationId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`/api/v1/reservations/${reservationId}/confirm`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockResponse);
    });
  });

  describe('cancelReservation', () => {
    it('should cancel reservation', () => {
      const reservationId = 'reservation-1';
      const mockResponse: Reservation = {
        id: 'reservation-1',
        userId: 'user-1',
        businessId: 'hotel-1',
        roomId: 'room-1',
        startDate: new Date('2024-10-15'),
        endDate: new Date('2024-10-17'),
        numberOfGuests: 2,
        status: 'CANCELLED',
        totalAmount: {
          amount: 200,
          currency: 'USD'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      service.cancelReservation(reservationId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`/api/v1/reservations/${reservationId}/cancel`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockResponse);
    });
  });
});
