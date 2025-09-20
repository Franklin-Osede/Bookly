import { Injectable } from '@nestjs/common';
import { RoomRepository } from '../../application/repositories/room.repository';
import { Room } from '../../domain/entities/room.entity';
import { Money } from '../../../shared/domain/value-objects/money';

@Injectable()
export class RoomRepositoryImpl implements RoomRepository {
  private rooms: Room[] = [];

  async save(room: Room): Promise<Room> {
    this.rooms.push(room);
    return room;
  }

  async findById(id: string): Promise<Room | null> {
    return this.rooms.find(room => room.id === id) || null;
  }

  async findByBusinessId(businessId: string): Promise<Room[]> {
    return this.rooms.filter(room => room.businessId === businessId);
  }

  async findByNumber(businessId: string, number: string): Promise<Room | null> {
    return this.rooms.find(room => 
      room.businessId === businessId && room.number === number
    ) || null;
  }

  async findByType(businessId: string, type: string): Promise<Room[]> {
    return this.rooms.filter(room => 
      room.businessId === businessId && room.type === type
    );
  }

  async findByCapacity(businessId: string, minCapacity: number): Promise<Room[]> {
    return this.rooms.filter(room => 
      room.businessId === businessId && room.capacity >= minCapacity
    );
  }

  async findByPriceRange(businessId: string, minPrice: Money, maxPrice: Money): Promise<Room[]> {
    return this.rooms.filter(room => 
      room.businessId === businessId && 
      room.price.greaterThan(minPrice) && 
      room.price.lessThan(maxPrice)
    );
  }

  async findActiveRooms(businessId: string): Promise<Room[]> {
    return this.rooms.filter(room => 
      room.businessId === businessId && room.isActive
    );
  }

  async update(id: string, data: any): Promise<Room> {
    const roomIndex = this.rooms.findIndex(room => room.id === id);
    if (roomIndex === -1) {
      throw new Error('Room not found');
    }

    const room = this.rooms[roomIndex];
    room.updateInfo(data);
    this.rooms[roomIndex] = room;
    return room;
  }

  async delete(id: string): Promise<boolean> {
    const roomIndex = this.rooms.findIndex(room => room.id === id);
    if (roomIndex === -1) {
      return false;
    }

    this.rooms.splice(roomIndex, 1);
    return true;
  }

  async findAll(): Promise<Room[]> {
    return [...this.rooms];
  }

  async findAvailableRooms(businessId: string, startDate: Date, endDate: Date): Promise<Room[]> {
    // This method is implemented in the service layer
    // Repository just returns all rooms, service filters by availability
    return this.findByBusinessId(businessId);
  }

  async exists(id: string): Promise<boolean> {
    return this.rooms.some(room => room.id === id);
  }
}
