export enum TableLocation {
  INDOOR = 'INDOOR',
  OUTDOOR = 'OUTDOOR',
  PATIO = 'PATIO',
  BAR = 'BAR'
}

export interface CreateTableData {
  businessId: string;
  number: string;
  capacity: number;
  location: TableLocation;
  description?: string;
  isActive?: boolean;
}

export interface UpdateTableData {
  capacity?: number;
  location?: TableLocation;
  description?: string;
  isActive?: boolean;
}

export class Table {
  public readonly id: string;
  public businessId: string;
  public number: string;
  public capacity: number;
  public location: TableLocation;
  public description?: string;
  public isActive: boolean;
  public readonly createdAt: Date;
  public updatedAt: Date;

  private constructor(data: CreateTableData & { 
    id: string; 
    isActive: boolean; 
    createdAt: Date; 
    updatedAt: Date 
  }) {
    this.id = data.id;
    this.businessId = data.businessId;
    this.number = data.number;
    this.capacity = data.capacity;
    this.location = data.location;
    this.description = data.description;
    this.isActive = data.isActive;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static create(data: CreateTableData): Table {
    // Validaciones
    if (!data.businessId || data.businessId.trim() === '') {
      throw new Error('Business ID is required');
    }

    if (!data.number || data.number.trim() === '') {
      throw new Error('Table number is required');
    }

    if (data.capacity <= 0) {
      throw new Error('Table capacity must be greater than 0');
    }

    if (!Table.isValidLocation(data.location)) {
      throw new Error('Invalid table location');
    }

    const now = new Date();
    return new Table({
      id: Table.generateId(),
      businessId: data.businessId,
      number: data.number,
      capacity: data.capacity,
      location: data.location,
      description: data.description,
      isActive: data.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Table management methods
  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  updateInfo(data: UpdateTableData): void {
    if (data.capacity !== undefined) {
      if (data.capacity <= 0) {
        throw new Error('Table capacity must be greater than 0');
      }
      this.capacity = data.capacity;
    }

    if (data.location !== undefined) {
      if (!Table.isValidLocation(data.location)) {
        throw new Error('Invalid table location');
      }
      this.location = data.location;
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

  isSuitableForGroup(groupSize: number): boolean {
    return this.isActive && groupSize > 0 && groupSize <= this.capacity;
  }

  getLocationDisplayName(): string {
    const locationNames: Record<TableLocation, string> = {
      'INDOOR': 'Indoor',
      'OUTDOOR': 'Outdoor',
      'PATIO': 'Patio',
      'BAR': 'Bar',
    };
    return locationNames[this.location];
  }

  // Utility methods
  updateNumber(newNumber: string): void {
    if (!newNumber || newNumber.trim() === '') {
      throw new Error('Table number is required');
    }
    this.number = newNumber;
    this.updatedAt = new Date();
  }

  // Helper methods for restaurant operations
  isIndoor(): boolean {
    return this.location === 'INDOOR';
  }

  isOutdoor(): boolean {
    return this.location === 'OUTDOOR' || this.location === 'PATIO';
  }

  isInBarArea(): boolean {
    return this.location === 'BAR';
  }

  getCapacityCategory(): 'SMALL' | 'MEDIUM' | 'LARGE' {
    if (this.capacity <= 2) return 'SMALL';
    if (this.capacity <= 4) return 'MEDIUM';
    return 'LARGE';
  }

  private static isValidLocation(location: string): location is TableLocation {
    return ['INDOOR', 'OUTDOOR', 'PATIO', 'BAR'].includes(location);
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

