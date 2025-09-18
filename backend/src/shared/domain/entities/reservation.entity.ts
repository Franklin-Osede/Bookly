export type ReservationType = 'HOTEL' | 'RESTAURANT';
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface CreateReservationData {
  businessId: string;
  customerId: string;
  type: ReservationType;
  startDate: Date;
  endDate: Date;
  guests: number;
  totalAmount: number;
  notes?: string;
}

export class Reservation {
  public readonly id: string;
  public businessId: string;
  public customerId: string;
  public type: ReservationType;
  public status: ReservationStatus;
  public startDate: Date;
  public endDate: Date;
  public guests: number;
  public totalAmount: number;
  public notes?: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  private constructor(data: CreateReservationData & { 
    id: string; 
    status: ReservationStatus; 
    createdAt: Date; 
    updatedAt: Date 
  }) {
    this.id = data.id;
    this.businessId = data.businessId;
    this.customerId = data.customerId;
    this.type = data.type;
    this.status = data.status;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.guests = data.guests;
    this.totalAmount = data.totalAmount;
    this.notes = data.notes;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static create(data: CreateReservationData): Reservation {
    // Validaciones
    if (data.endDate <= data.startDate) {
      throw new Error('End date must be after start date');
    }

    if (data.guests <= 0) {
      throw new Error('Number of guests must be greater than 0');
    }

    if (data.totalAmount <= 0) {
      throw new Error('Total amount must be greater than 0');
    }

    if (!Reservation.isValidType(data.type)) {
      throw new Error('Invalid reservation type');
    }

    const now = new Date();
    return new Reservation({
      id: Reservation.generateId(),
      businessId: data.businessId,
      customerId: data.customerId,
      type: data.type,
      status: 'PENDING',
      startDate: data.startDate,
      endDate: data.endDate,
      guests: data.guests,
      totalAmount: data.totalAmount,
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Status management methods
  confirm(): void {
    if (this.status !== 'PENDING') {
      throw new Error('Only pending reservations can be confirmed');
    }
    this.status = 'CONFIRMED';
    this.updatedAt = new Date();
  }

  cancel(): void {
    if (this.status === 'COMPLETED') {
      throw new Error('Completed reservations cannot be cancelled');
    }
    this.status = 'CANCELLED';
    this.updatedAt = new Date();
  }

  complete(): void {
    if (this.status !== 'CONFIRMED') {
      throw new Error('Only confirmed reservations can be completed');
    }
    this.status = 'COMPLETED';
    this.updatedAt = new Date();
  }

  // Business logic methods
  getDurationInDays(): number {
    const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDurationInHours(): number {
    const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60));
  }

  isActive(): boolean {
    return this.status === 'PENDING' || this.status === 'CONFIRMED';
  }

  // Utility methods
  updateNotes(notes: string): void {
    this.notes = notes;
    this.updatedAt = new Date();
  }

  updateTotalAmount(amount: number): void {
    if (amount <= 0) {
      throw new Error('Total amount must be greater than 0');
    }
    this.totalAmount = amount;
    this.updatedAt = new Date();
  }

  private static isValidType(type: string): type is ReservationType {
    return ['HOTEL', 'RESTAURANT'].includes(type);
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

