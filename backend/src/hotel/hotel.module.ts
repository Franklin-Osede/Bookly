import { Module } from '@nestjs/common';
import { HotelController } from './controllers/hotel.controller';
import { RoomService } from './application/services/room.service';
import { RoomRepository } from './application/repositories/room.repository';
import { RoomRepositoryImpl } from './infrastructure/repositories/room.repository.impl';
import { BusinessRepository } from '../shared/application/repositories/business.repository';
import { BusinessRepositoryImpl } from '../shared/infrastructure/repositories/business.repository.impl';
import { ReservationRepository } from '../shared/application/repositories/reservation.repository';
import { ReservationRepositoryImpl } from '../shared/infrastructure/repositories/reservation.repository.impl';
import { REPOSITORY_TOKENS } from '../shared/application/tokens/repository.tokens';

@Module({
  imports: [],
  controllers: [HotelController],
  providers: [
    RoomService,
    {
      provide: REPOSITORY_TOKENS.ROOM_REPOSITORY,
      useClass: RoomRepositoryImpl,
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
  exports: [RoomService],
})
export class HotelModule {}
