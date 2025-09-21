import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantController } from './controllers/restaurant.controller';
import { TableService } from './application/services/table.service';
import { TableRepository } from './application/repositories/table.repository';
import { TableRepositoryTypeORM } from './infrastructure/repositories/table.repository.typeorm';
import { BusinessRepository } from '../shared/application/repositories/business.repository';
import { BusinessRepositoryImpl } from '../shared/infrastructure/repositories/business.repository.impl';
import { ReservationRepository } from '../shared/application/repositories/reservation.repository';
import { ReservationRepositoryImpl } from '../shared/infrastructure/repositories/reservation.repository.impl';
import { REPOSITORY_TOKENS } from '../shared/application/tokens/repository.tokens';
import { TableEntity } from './infrastructure/database/entities/table.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TableEntity]),
  ],
  controllers: [RestaurantController],
  providers: [
    TableService,
    {
      provide: REPOSITORY_TOKENS.TABLE_REPOSITORY,
      useClass: TableRepositoryTypeORM,
    },
    {
      provide: REPOSITORY_TOKENS.BUSINESS_REPOSITORY,
      useClass: BusinessRepositoryImpl,
    },
    {
      provide: REPOSITORY_TOKENS.RESERVATION_REPOSITORY,
      useClass: ReservationRepositoryImpl,
    },
  ],
  exports: [TableService],
})
export class RestaurantModule {}
