import { Module } from '@nestjs/common';
import { RestaurantController } from './controllers/restaurant.controller';
import { TableService } from './application/services/table.service';
import { TableRepository } from './application/repositories/table.repository';
import { TableRepositoryImpl } from './infrastructure/repositories/table.repository.impl';
import { BusinessRepository } from '../shared/application/repositories/business.repository';
import { BusinessRepositoryImpl } from '../shared/infrastructure/repositories/business.repository.impl';
import { ReservationRepository } from '../shared/application/repositories/reservation.repository';
import { ReservationRepositoryImpl } from '../shared/infrastructure/repositories/reservation.repository.impl';
import { REPOSITORY_TOKENS } from '../shared/application/tokens/repository.tokens';

@Module({
  imports: [],
  controllers: [RestaurantController],
  providers: [
    TableService,
    {
      provide: REPOSITORY_TOKENS.TABLE_REPOSITORY,
      useClass: TableRepositoryImpl,
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
