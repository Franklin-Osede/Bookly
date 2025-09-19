import { Money } from '../../../shared/domain/value-objects/money';

export type RoomType = 'SINGLE' | 'DOUBLE' | 'SUITE' | 'DELUXE';

export interface CreateRoomData {
  businessId: string;
  number: string;
  type: RoomType;
  capacity: number;
  price: Money;
  description?: string;
  isActive?: boolean;
}

export interface UpdateRoomData {
  type?: RoomType;
  capacity?: number;
  price?: Money;
  description?: string;
  isActive?: boolean;
}

export class Room {
  public readonly id: string;
  public businessId: string;
  public number: string;
  public type: RoomType;
  public capacity: number;
  public price: Money;
  public description?: string;
  public isActive: boolean;
  public readonly createdAt: Date;
  public updatedAt: Date;

  private constructor(data: CreateRoomData & { 
    id: string; 
    isActive: boolean; 
    createdAt: Date; 
    updatedAt: Date 
  }) {
    this.id = data.id;
    this.businessId = data.businessId;
    this.number = data.number;
    this.type = data.type;
    this.capacity = data.capacity;
    this.price = data.price;
    this.description = data.description;
    this.isActive = data.isActive;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static create(data: CreateRoomData): Room {
    // Validaciones
    if (!data.number || data.number.trim() === '') {
      throw new Error('Room number is required');
    }

    if (data.capacity <= 0) {
      throw new Error('Room capacity must be greater than 0');
    }

    if (!Room.isValidType(data.type)) {
      throw new Error('Invalid room type');
    }

    const now = new Date();
    return new Room({
      id: Room.generateId(),
      businessId: data.businessId,
      number: data.number,
      type: data.type,
      capacity: data.capacity,
      price: data.price,
      description: data.description,
      isActive: data.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Room management methods
  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  updateInfo(data: UpdateRoomData): void {
    if (data.type !== undefined) {
      if (!Room.isValidType(data.type)) {
        throw new Error('Invalid room type');
      }
      this.type = data.type;
    }

    if (data.capacity !== undefined) {
      if (data.capacity <= 0) {
        throw new Error('Room capacity must be greater than 0');
      }
      this.capacity = data.capacity;
    }

    if (data.price !== undefined) {
      this.price = data.price;
    }

    if (data.description !== undefined) {
      this.description = data.description;
    }

    if (data.isActive !== undefined) {
      this.isActive = data.isActive;
    }

    this.updatedAt = new Date();
  }

  // Business logic methods
  canAccommodate(guests: number): boolean {
    return this.isActive && guests > 0 && guests <= this.capacity;
  }

  getPricePerGuest(): Money {
    return new Money(this.price.amount / this.capacity, this.price.currency);
  }

  getTypeDisplayName(): string {
    const typeNames: Record<RoomType, string> = {
      'SINGLE': 'Single Room',
      'DOUBLE': 'Double Room',
      'SUITE': 'Suite',
      'DELUXE': 'Deluxe Room',
    };
    return typeNames[this.type];
  }

  // Utility methods
  updateNumber(newNumber: string): void {
    if (!newNumber || newNumber.trim() === '') {
      throw new Error('Room number is required');
    }
    this.number = newNumber;
    this.updatedAt = new Date();
  }

  private static isValidType(type: string): type is RoomType {
    return ['SINGLE', 'DOUBLE', 'SUITE', 'DELUXE'].includes(type);
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
