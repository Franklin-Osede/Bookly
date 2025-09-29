import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationController } from './controllers/reservation.controller';
import { ReservationService } from './application/services/reservation.service';
import { NotificationService } from './application/services/notification.service';
import { ReservationRepository } from './application/repositories/reservation.repository';
import { ReservationRepositoryTypeORM } from './infrastructure/repositories/reservation.repository.typeorm';
import { ReservationEntity } from './infrastructure/database/entities/reservation.entity';
import { BusinessEntity } from './infrastructure/database/entities/business.entity';
import { UserEntity } from './infrastructure/database/entities/user.entity';
import { BusinessRepositoryTypeORM } from './infrastructure/repositories/business.repository.typeorm';
import { UserRepositoryTypeORM } from './infrastructure/repositories/user.repository.typeorm';
import { REPOSITORY_TOKENS } from './application/tokens/repository.tokens';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationEntity, BusinessEntity, UserEntity]),
  ],
  controllers: [ReservationController],
  providers: [
    ReservationService,
    NotificationService,
    {
      provide: REPOSITORY_TOKENS.RESERVATION_REPOSITORY,
      useClass: ReservationRepositoryTypeORM,
    },
    {
      provide: REPOSITORY_TOKENS.BUSINESS_REPOSITORY,
      useClass: BusinessRepositoryTypeORM,
    },
    {
      provide: REPOSITORY_TOKENS.USER_REPOSITORY,
      useClass: UserRepositoryTypeORM,
    },
  ],
  exports: [
    TypeOrmModule, 
    ReservationService, 
    NotificationService,
    REPOSITORY_TOKENS.BUSINESS_REPOSITORY,
    REPOSITORY_TOKENS.USER_REPOSITORY,
    REPOSITORY_TOKENS.RESERVATION_REPOSITORY,
  ],
})
export class SharedModule {}
