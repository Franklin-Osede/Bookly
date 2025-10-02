export interface Reservation {
  id: string;
  businessId: string;
  userId: string;
  roomId?: string;
  tableId?: string;
  startDate: Date;
  endDate: Date;
  numberOfGuests: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  totalAmountAmount: number;
  totalAmountCurrency: string;
  specialRequests?: string;
  customerName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHotelReservationRequest {
  businessId: string;
  roomId: string;
  startDate: string;
  endDate: string;
  numberOfGuests: number;
  specialRequests?: string;
}

export interface CreateRestaurantReservationRequest {
  businessId: string;
  tableId: string;
  startDate: string;
  endDate: string;
  numberOfGuests: number;
  specialRequests?: string;
}