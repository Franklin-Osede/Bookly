import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { BusinessEntity } from './business.entity';

@Entity('reservations')
export class ReservationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  businessId: string;

  @Column({ type: 'uuid', nullable: true })
  roomId: string;

  @Column({ type: 'uuid', nullable: true })
  tableId: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'int' })
  numberOfGuests: number;

  @Column({ 
    type: 'enum', 
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
    default: 'PENDING'
  })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmountAmount: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  totalAmountCurrency: string;

  @Column({ type: 'text', nullable: true })
  specialRequests: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => BusinessEntity)
  @JoinColumn({ name: 'businessId' })
  business: BusinessEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

