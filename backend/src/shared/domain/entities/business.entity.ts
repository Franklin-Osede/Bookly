import { Address } from '../value-objects/address';
import { Email } from '../value-objects/email';
import { PhoneNumber } from '../value-objects/phone-number';

export type BusinessType = 'HOTEL' | 'RESTAURANT';

export interface CreateBusinessData {
  name: string;
  type: BusinessType;
  description?: string;
  address: Address;
  phone: PhoneNumber;
  email: Email;
  ownerId: string;
  isActive?: boolean;
}

export interface UpdateBusinessData {
  name?: string;
  description?: string;
  address?: Address;
  phone?: PhoneNumber;
  email?: Email;
  isActive?: boolean;
}

export class Business {
  public readonly id: string;
  public name: string;
  public type: BusinessType;
  public description?: string;
  public address: Address;
  public phone: PhoneNumber;
  public email: Email;
  public ownerId: string;
  public isActive: boolean;
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
    this.isActive = data.isActive ?? true;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static create(data: CreateBusinessData): Business {
    // Validaciones
    if (!data.name || data.name.trim() === '') {
      throw new Error('Business name is required');
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
      isActive: data.isActive ?? true,
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
      this.phone = data.phone;
    }

    if (data.email !== undefined) {
      this.email = data.email;
    }

    if (data.isActive !== undefined) {
      this.isActive = data.isActive;
    }

    this.updatedAt = new Date();
  }

  private static isValidType(type: string): type is BusinessType {
    return ['HOTEL', 'RESTAURANT'].includes(type);
  }

  private static generateId(): string {
    return crypto.randomUUID();
  }
}

