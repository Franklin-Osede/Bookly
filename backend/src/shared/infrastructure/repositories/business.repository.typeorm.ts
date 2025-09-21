import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessRepository } from '../../application/repositories/business.repository';
import { Business } from '../../domain/entities/business.entity';
import { BusinessType } from '../../domain/entities/business.entity';
import { Address } from '../../domain/value-objects/address';
import { Email } from '../../domain/value-objects/email';
import { PhoneNumber } from '../../domain/value-objects/phone-number';
import { BusinessEntity } from '../database/entities/business.entity';

@Injectable()
export class BusinessRepositoryTypeORM implements BusinessRepository {
  constructor(
    @InjectRepository(BusinessEntity)
    private readonly businessRepository: Repository<BusinessEntity>,
  ) {}

  async save(business: Business): Promise<Business> {
    const businessEntity = new BusinessEntity();
    businessEntity.id = business.id;
    businessEntity.name = business.name;
    businessEntity.email = business.email.value;
    businessEntity.phone = business.phone.value;
    businessEntity.street = business.address.street;
    businessEntity.city = business.address.city;
    businessEntity.state = business.address.state;
    businessEntity.zipCode = business.address.zipCode;
    businessEntity.country = business.address.country;
    businessEntity.type = business.type;
    businessEntity.description = business.description;
    businessEntity.isActive = business.isActive;
    businessEntity.createdAt = business.createdAt;
    businessEntity.updatedAt = business.updatedAt;

    const savedEntity = await this.businessRepository.save(businessEntity);
    return this.mapEntityToDomain(savedEntity);
  }

  async findById(id: string): Promise<Business | null> {
    const entity = await this.businessRepository.findOne({ where: { id } });
    return entity ? this.mapEntityToDomain(entity) : null;
  }

  async findByEmail(email: Email): Promise<Business | null> {
    const entity = await this.businessRepository.findOne({ 
      where: { email: email.value.toLowerCase() } 
    });
    return entity ? this.mapEntityToDomain(entity) : null;
  }

  async findByType(type: BusinessType): Promise<Business[]> {
    const entities = await this.businessRepository.find({ where: { type } });
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async findByOwnerId(ownerId: string): Promise<Business[]> {
    const entities = await this.businessRepository.find({ where: { ownerId } });
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async findByLocation(city: string, state: string): Promise<Business[]> {
    const entities = await this.businessRepository.find({ 
      where: { city, state } 
    });
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async findActiveBusinesses(): Promise<Business[]> {
    const entities = await this.businessRepository.find({ where: { isActive: true } });
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async update(id: string, data: any): Promise<Business> {
    await this.businessRepository.update(id, data);
    const updatedEntity = await this.businessRepository.findOne({ where: { id } });
    if (!updatedEntity) {
      throw new Error('Business not found');
    }
    return this.mapEntityToDomain(updatedEntity);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.businessRepository.delete(id);
    return result.affected > 0;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.businessRepository.count({ where: { id } });
    return count > 0;
  }

  async findAll(): Promise<Business[]> {
    const entities = await this.businessRepository.find();
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  private mapEntityToDomain(entity: BusinessEntity): Business {
    const business = Business.create({
      name: entity.name,
      type: entity.type as BusinessType,
      description: entity.description,
      address: new Address({
        street: entity.street,
        city: entity.city,
        state: entity.state,
        zipCode: entity.zipCode,
        country: entity.country,
      }),
      phone: new PhoneNumber(entity.phone),
      email: new Email(entity.email),
      ownerId: entity.ownerId || 'unknown',
      isActive: entity.isActive,
    });
    
    // Asignar campos que no están en create
    (business as any).id = entity.id;
    (business as any).createdAt = entity.createdAt;
    (business as any).updatedAt = entity.updatedAt;
    
    return business;
  }
}
