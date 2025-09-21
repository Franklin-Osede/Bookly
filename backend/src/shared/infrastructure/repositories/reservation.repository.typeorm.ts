import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationRepository } from '../../application/repositories/reservation.repository';
import { Reservation } from '../../domain/entities/reservation.entity';
import { Money } from '../../domain/value-objects/money';
import { ReservationEntity } from '../database/entities/reservation.entity';

@Injectable()
export class ReservationRepositoryTypeORM implements ReservationRepository {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
  ) {}

  async save(reservation: Reservation): Promise<Reservation> {
    const reservationEntity = new ReservationEntity();
    reservationEntity.id = reservation.id;
    reservationEntity.userId = reservation.userId;
    reservationEntity.businessId = reservation.businessId;
    reservationEntity.roomId = reservation.roomId;
    reservationEntity.tableId = reservation.tableId;
    reservationEntity.startDate = reservation.startDate;
    reservationEntity.endDate = reservation.endDate;
    reservationEntity.numberOfGuests = reservation.guests;
    reservationEntity.status = reservation.status;
    reservationEntity.totalAmountAmount = reservation.totalAmount.amount;
    reservationEntity.totalAmountCurrency = reservation.totalAmount.currency;
    reservationEntity.specialRequests = reservation.notes;
    reservationEntity.createdAt = reservation.createdAt;
    reservationEntity.updatedAt = reservation.updatedAt;

    const savedEntity = await this.reservationRepository.save(reservationEntity);
    return this.mapEntityToDomain(savedEntity);
  }

  async findById(id: string): Promise<Reservation | null> {
    const entity = await this.reservationRepository.findOne({ where: { id } });
    return entity ? this.mapEntityToDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<Reservation[]> {
    const entities = await this.reservationRepository.find({ 
      where: { userId },
      order: { createdAt: 'DESC' }
    });
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async findByBusinessId(businessId: string): Promise<Reservation[]> {
    const entities = await this.reservationRepository.find({ 
      where: { businessId },
      order: { createdAt: 'DESC' }
    });
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Reservation[]> {
    const entities = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.startDate >= :startDate', { startDate })
      .andWhere('reservation.endDate <= :endDate', { endDate })
      .orderBy('reservation.createdAt', 'DESC')
      .getMany();
    
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async findByStatus(status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'): Promise<Reservation[]> {
    const entities = await this.reservationRepository.find({ 
      where: { status },
      order: { createdAt: 'DESC' }
    });
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async findByType(type: 'HOTEL' | 'RESTAURANT'): Promise<Reservation[]> {
    const entities = await this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoin('reservation.business', 'business')
      .where('business.type = :type', { type })
      .orderBy('reservation.createdAt', 'DESC')
      .getMany();
    
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async findOverlappingReservations(
    businessId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<Reservation[]> {
    const entities = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.businessId = :businessId', { businessId })
      .andWhere('reservation.status IN (:...statuses)', { 
        statuses: ['PENDING', 'CONFIRMED'] 
      })
      .andWhere(
        '(reservation.startDate < :endDate AND reservation.endDate > :startDate)',
        { startDate, endDate }
      )
      .getMany();
    
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async findActiveReservations(businessId: string): Promise<Reservation[]> {
    const entities = await this.reservationRepository.find({ 
      where: { 
        businessId, 
        status: 'CONFIRMED' 
      },
      order: { startDate: 'ASC' }
    });
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async findUpcomingReservations(businessId: string, days: number = 7): Promise<Reservation[]> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + days);

    const entities = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.businessId = :businessId', { businessId })
      .andWhere('reservation.status = :status', { status: 'CONFIRMED' })
      .andWhere('reservation.startDate >= :startDate', { startDate })
      .andWhere('reservation.startDate <= :endDate', { endDate })
      .orderBy('reservation.startDate', 'ASC')
      .getMany();
    
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async update(id: string, data: any): Promise<Reservation> {
    await this.reservationRepository.update(id, data);
    const updatedEntity = await this.reservationRepository.findOne({ where: { id } });
    if (!updatedEntity) {
      throw new Error('Reservation not found');
    }
    return this.mapEntityToDomain(updatedEntity);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.reservationRepository.delete(id);
    return result.affected > 0;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.reservationRepository.count({ where: { id } });
    return count > 0;
  }

  async findAll(): Promise<Reservation[]> {
    const entities = await this.reservationRepository.find({
      order: { createdAt: 'DESC' }
    });
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async countByStatus(status: string): Promise<number> {
    return await this.reservationRepository.count({ where: { status } });
  }

  async countByBusinessId(businessId: string): Promise<number> {
    return await this.reservationRepository.count({ where: { businessId } });
  }

  async getRevenueByBusinessId(businessId: string, startDate?: Date, endDate?: Date): Promise<number> {
    let query = this.reservationRepository
      .createQueryBuilder('reservation')
      .select('SUM(reservation.totalAmountAmount)', 'total')
      .where('reservation.businessId = :businessId', { businessId })
      .andWhere('reservation.status = :status', { status: 'CONFIRMED' });

    if (startDate) {
      query = query.andWhere('reservation.startDate >= :startDate', { startDate });
    }

    if (endDate) {
      query = query.andWhere('reservation.endDate <= :endDate', { endDate });
    }

    const result = await query.getRawOne();
    return parseFloat(result.total) || 0;
  }

  private mapEntityToDomain(entity: ReservationEntity): Reservation {
    const reservation = Reservation.create({
      userId: entity.userId,
      businessId: entity.businessId,
      startDate: entity.startDate,
      endDate: entity.endDate,
      guests: entity.numberOfGuests,
      totalAmount: new Money(entity.totalAmountAmount, entity.totalAmountCurrency),
      type: entity.roomId ? 'HOTEL' : 'RESTAURANT',
      status: entity.status as any,
      notes: entity.specialRequests
    });
    
    // Asignar campos que no están en create
    (reservation as any).id = entity.id;
    (reservation as any).roomId = entity.roomId;
    (reservation as any).tableId = entity.tableId;
    (reservation as any).createdAt = entity.createdAt;
    (reservation as any).updatedAt = entity.updatedAt;
    
    return reservation;
  }
}
