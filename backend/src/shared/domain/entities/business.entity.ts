export type BusinessType = 'HOTEL' | 'RESTAURANT';

export interface CreateBusinessData {
  name: string;
  type: BusinessType;
  description?: string;
  address: string;
  phone: string;
  email: string;
  ownerId: string;
}

export interface UpdateBusinessData {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export class Business {
  public readonly id: string;
  public name: string;
  public type: BusinessType;
  public description?: string;
  public address: string;
  public phone: string;
  public email: string;
  public ownerId: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  private constructor(data: CreateBusinessData & { id: string; createdAt: Date; updatedAt: Date }) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.description = data.description;
    this.address = data.address;
    this.phone = data.phone;
    this.email = data.email;
    this.ownerId = data.ownerId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static create(data: CreateBusinessData): Business {
    // Validaciones
    if (!data.name || data.name.trim() === '') {
      throw new Error('Business name is required');
    }

    if (!Business.isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    if (!Business.isValidPhone(data.phone)) {
      throw new Error('Invalid phone format');
    }

    if (!Business.isValidType(data.type)) {
      throw new Error('Invalid business type');
    }

    const now = new Date();
    return new Business({
      id: Business.generateId(),
      name: data.name,
      type: data.type,
      description: data.description,
      address: data.address,
      phone: data.phone,
      email: data.email,
      ownerId: data.ownerId,
      createdAt: now,
      updatedAt: now,
    });
  }

  updateInfo(data: UpdateBusinessData): void {
    if (data.name !== undefined) {
      if (!data.name || data.name.trim() === '') {
        throw new Error('Business name is required');
      }
      this.name = data.name;
    }

    if (data.description !== undefined) {
      this.description = data.description;
    }

    if (data.address !== undefined) {
      this.address = data.address;
    }

    if (data.phone !== undefined) {
      if (!Business.isValidPhone(data.phone)) {
        throw new Error('Invalid phone format');
      }
      this.phone = data.phone;
    }

    if (data.email !== undefined) {
      if (!Business.isValidEmail(data.email)) {
        throw new Error('Invalid email format');
      }
      this.email = data.email;
    }

    this.updatedAt = new Date();
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  private static isValidType(type: string): type is BusinessType {
    return ['HOTEL', 'RESTAURANT'].includes(type);
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

