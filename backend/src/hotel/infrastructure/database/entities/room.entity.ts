import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BusinessEntity } from '../../../../shared/infrastructure/database/entities/business.entity';

@Entity('rooms')
export class RoomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  number: string;

  @Column({ 
    type: 'enum', 
    enum: ['SINGLE', 'DOUBLE', 'SUITE', 'DELUXE'],
    default: 'SINGLE'
  })
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceAmount: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  priceCurrency: string;

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
