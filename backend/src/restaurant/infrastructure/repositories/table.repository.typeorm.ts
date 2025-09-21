import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableRepository } from '../../application/repositories/table.repository';
import { Table } from '../../domain/entities/table.entity';
import { TableLocation } from '../../domain/entities/table.entity';
import { TableEntity } from '../database/entities/table.entity';

@Injectable()
export class TableRepositoryTypeORM implements TableRepository {
  constructor(
    @InjectRepository(TableEntity)
    private readonly tableRepository: Repository<TableEntity>,
  ) {}

  async save(table: Table): Promise<Table> {
    const tableEntity = new TableEntity();
    tableEntity.id = table.id;
    tableEntity.businessId = table.businessId;
    tableEntity.number = table.number;
    tableEntity.capacity = table.capacity;
    tableEntity.location = table.location;
    tableEntity.description = table.description;
    tableEntity.isActive = table.isActive;
    tableEntity.createdAt = table.createdAt;
    tableEntity.updatedAt = table.updatedAt;

    const savedEntity = await this.tableRepository.save(tableEntity);
    return this.mapEntityToDomain(savedEntity);
  }

  async findById(id: string): Promise<Table | null> {
    const entity = await this.tableRepository.findOne({ where: { id } });
    return entity ? this.mapEntityToDomain(entity) : null;
  }

  async findByBusinessId(businessId: string): Promise<Table[]> {
    const entities = await this.tableRepository.find({ where: { businessId } });
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async findByNumber(businessId: string, number: string): Promise<Table | null> {
    const entity = await this.tableRepository.findOne({ 
      where: { businessId, number } 
    });
    return entity ? this.mapEntityToDomain(entity) : null;
  }

  async findByLocation(businessId: string, location: TableLocation): Promise<Table[]> {
    const entities = await this.tableRepository.find({ 
      where: { businessId, location } 
    });
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async findByCapacity(businessId: string, minCapacity: number): Promise<Table[]> {
    const entities = await this.tableRepository
      .createQueryBuilder('table')
      .where('table.businessId = :businessId', { businessId })
      .andWhere('table.capacity >= :minCapacity', { minCapacity })
      .getMany();
    
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async findAvailableTables(businessId: string, startDate: Date, endDate: Date): Promise<Table[]> {
    // Por ahora, retornamos todas las mesas activas
    // En el futuro, aquí se implementaría la lógica de disponibilidad
    const entities = await this.tableRepository.find({ 
      where: { businessId, isActive: true } 
    });
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async findActiveTables(businessId: string): Promise<Table[]> {
    const entities = await this.tableRepository.find({ 
      where: { businessId, isActive: true } 
    });
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async update(id: string, data: any): Promise<Table> {
    await this.tableRepository.update(id, data);
    const updatedEntity = await this.tableRepository.findOne({ where: { id } });
    if (!updatedEntity) {
      throw new Error('Table not found');
    }
    return this.mapEntityToDomain(updatedEntity);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.tableRepository.delete(id);
    return result.affected > 0;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.tableRepository.count({ where: { id } });
    return count > 0;
  }

  async findAll(): Promise<Table[]> {
    const entities = await this.tableRepository.find();
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  private mapEntityToDomain(entity: TableEntity): Table {
    return Table.create({
      businessId: entity.businessId,
      number: entity.number,
      capacity: entity.capacity,
      location: entity.location as TableLocation,
      description: entity.description,
      isActive: entity.isActive,
    });
  }
}
