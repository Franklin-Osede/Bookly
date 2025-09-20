import { Injectable } from '@nestjs/common';
import { BusinessRepository } from '../../application/repositories/business.repository';
import { Business } from '../../domain/entities/business.entity';
import { Address } from '../../domain/value-objects/address';
import { PhoneNumber } from '../../domain/value-objects/phone-number';
import { Email } from '../../domain/value-objects/email';

@Injectable()
export class BusinessRepositoryImpl implements BusinessRepository {
  private businesses: Business[] = [];

  async save(business: Business): Promise<Business> {
    this.businesses.push(business);
    return business;
  }

  async findById(id: string): Promise<Business | null> {
    return this.businesses.find(business => business.id === id) || null;
  }

  async findByOwnerId(ownerId: string): Promise<Business[]> {
    return this.businesses.filter(business => business.ownerId === ownerId);
  }

  async findByType(type: string): Promise<Business[]> {
    return this.businesses.filter(business => business.type === type);
  }

  async update(id: string, data: any): Promise<Business> {
    const businessIndex = this.businesses.findIndex(business => business.id === id);
    if (businessIndex === -1) {
      throw new Error('Business not found');
    }

    const business = this.businesses[businessIndex];
    business.updateInfo(data);
    this.businesses[businessIndex] = business;
    return business;
  }

  async delete(id: string): Promise<boolean> {
    const businessIndex = this.businesses.findIndex(business => business.id === id);
    if (businessIndex === -1) {
      return false;
    }

    this.businesses.splice(businessIndex, 1);
    return true;
  }

  async findAll(): Promise<Business[]> {
    return [...this.businesses];
  }

  async findByEmail(email: Email): Promise<Business | null> {
    return this.businesses.find(business => business.email.equals(email)) || null;
  }

  async findByLocation(city: string, state?: string): Promise<Business[]> {
    return this.businesses.filter(business => 
      business.address.city === city && 
      (!state || business.address.state === state)
    );
  }

  async exists(id: string): Promise<boolean> {
    return this.businesses.some(business => business.id === id);
  }
}
