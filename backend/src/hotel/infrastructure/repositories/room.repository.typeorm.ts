import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomRepository } from '../../application/repositories/room.repository';
import { Room } from '../../domain/entities/room.entity';
import { RoomType } from '../../domain/entities/room.entity';
import { Money } from '../../../shared/domain/value-objects/money';
import { RoomEntity } from '../database/entities/room.entity';

@Injectable()
export class RoomRepositoryTypeORM implements RoomRepository {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  async save(room: Room): Promise<Room> {
    const roomEntity = new RoomEntity();
    roomEntity.id = room.id;
    roomEntity.businessId = room.businessId;
    roomEntity.number = room.number;
    roomEntity.type = room.type;
    roomEntity.capacity = room.capacity;
    roomEntity.priceAmount = room.price.amount;
    roomEntity.priceCurrency = room.price.currency;
    roomEntity.description = room.description;
    roomEntity.isActive = room.isActive;
    roomEntity.createdAt = room.createdAt;
    roomEntity.updatedAt = room.updatedAt;

    const savedEntity = await this.roomRepository.save(roomEntity);
    return this.mapEntityToDomain(savedEntity);
  }

  async findById(id: string): Promise<Room | null> {
    const entity = await this.roomRepository.findOne({ where: { id } });
    return entity ? this.mapEntityToDomain(entity) : null;
  }

  async findByBusinessId(businessId: string): Promise<Room[]> {
    const entities = await this.roomRepository.find({ where: { businessId } });
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async findByNumber(businessId: string, number: string): Promise<Room | null> {
    const entity = await this.roomRepository.findOne({ 
      where: { businessId, number } 
    });
    return entity ? this.mapEntityToDomain(entity) : null;
  }

  async findByType(businessId: string, type: RoomType): Promise<Room[]> {
    const entities = await this.roomRepository.find({ 
      where: { businessId, type } 
    });
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async findByCapacity(businessId: string, minCapacity: number): Promise<Room[]> {
    const entities = await this.roomRepository
      .createQueryBuilder('room')
      .where('room.businessId = :businessId', { businessId })
      .andWhere('room.capacity >= :minCapacity', { minCapacity })
      .getMany();
    
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async findAvailableRooms(businessId: string, startDate: Date, endDate: Date): Promise<Room[]> {
    // Por ahora, retornamos todas las habitaciones activas
    // En el futuro, aquí se implementaría la lógica de disponibilidad
    const entities = await this.roomRepository.find({ 
      where: { businessId, isActive: true } 
    });
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async findByPriceRange(businessId: string, minPrice: Money, maxPrice: Money): Promise<Room[]> {
    const entities = await this.roomRepository
      .createQueryBuilder('room')
      .where('room.businessId = :businessId', { businessId })
      .andWhere('room.priceAmount >= :minPrice', { minPrice: minPrice.amount })
      .andWhere('room.priceAmount <= :maxPrice', { maxPrice: maxPrice.amount })
      .getMany();
    
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async findActiveRooms(businessId: string): Promise<Room[]> {
    const entities = await this.roomRepository.find({ 
      where: { businessId, isActive: true } 
    });
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async update(id: string, data: any): Promise<Room> {
    await this.roomRepository.update(id, data);
    const updatedEntity = await this.roomRepository.findOne({ where: { id } });
    if (!updatedEntity) {
      throw new Error('Room not found');
    }
    return this.mapEntityToDomain(updatedEntity);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.roomRepository.delete(id);
    return result.affected > 0;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.roomRepository.count({ where: { id } });
    return count > 0;
  }

  async findAll(): Promise<Room[]> {
    const entities = await this.roomRepository.find();
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  private mapEntityToDomain(entity: RoomEntity): Room {
    return Room.create({
      businessId: entity.businessId,
      number: entity.number,
      type: entity.type as RoomType,
      capacity: entity.capacity,
      price: new Money(entity.priceAmount, entity.priceCurrency),
      description: entity.description,
      isActive: entity.isActive,
    });
  }
}
