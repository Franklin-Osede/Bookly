import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelController } from './controllers/hotel.controller';
import { RoomService } from './application/services/room.service';
import { RoomRepository } from './application/repositories/room.repository';
import { RoomRepositoryTypeORM } from './infrastructure/repositories/room.repository.typeorm';
import { BusinessRepository } from '../shared/application/repositories/business.repository';
import { BusinessRepositoryTypeORM } from '../shared/infrastructure/repositories/business.repository.typeorm';
import { ReservationRepository } from '../shared/application/repositories/reservation.repository';
import { ReservationRepositoryImpl } from '../shared/infrastructure/repositories/reservation.repository.impl';
import { REPOSITORY_TOKENS } from '../shared/application/tokens/repository.tokens';
import { RoomEntity } from './infrastructure/database/entities/room.entity';
import { BusinessEntity } from '../shared/infrastructure/database/entities/business.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomEntity, BusinessEntity]),
  ],
  controllers: [HotelController],
  providers: [
    RoomService,
    {
      provide: REPOSITORY_TOKENS.ROOM_REPOSITORY,
      useClass: RoomRepositoryTypeORM,
    },
    {
      provide: REPOSITORY_TOKENS.BUSINESS_REPOSITORY,
      useClass: BusinessRepositoryTypeORM,
    },
    {
      provide: REPOSITORY_TOKENS.RESERVATION_REPOSITORY,
      useClass: ReservationRepositoryImpl,
    },
  ],
  exports: [RoomService],
})
export class HotelModule {}
