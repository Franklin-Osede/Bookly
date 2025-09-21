import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BusinessEntity } from '../../../../shared/infrastructure/database/entities/business.entity';

@Entity('tables')
export class TableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  number: string;

  @Column({ 
    type: 'enum', 
    enum: ['INDOOR', 'OUTDOOR', 'PATIO', 'TERRACE'],
    default: 'INDOOR'
  })
  location: string;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'uuid' })
  businessId: string;

  @ManyToOne(() => BusinessEntity)
  @JoinColumn({ name: 'businessId' })
  business: BusinessEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
