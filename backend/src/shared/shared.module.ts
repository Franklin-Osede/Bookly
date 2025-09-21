import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationController } from './controllers/reservation.controller';
import { ReservationService } from './application/services/reservation.service';
import { NotificationService } from './application/services/notification.service';
import { ReservationRepository } from './application/repositories/reservation.repository';
import { ReservationRepositoryTypeORM } from './infrastructure/repositories/reservation.repository.typeorm';
import { ReservationEntity } from './infrastructure/database/entities/reservation.entity';
import { REPOSITORY_TOKENS } from './application/tokens/repository.tokens';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationEntity]),
  ],
  controllers: [ReservationController],
  providers: [
    ReservationService,
    NotificationService,
    {
      provide: REPOSITORY_TOKENS.RESERVATION_REPOSITORY,
      useClass: ReservationRepositoryTypeORM,
    },
  ],
  exports: [TypeOrmModule, ReservationService, NotificationService],
})
export class SharedModule {}
