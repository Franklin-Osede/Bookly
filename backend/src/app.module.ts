import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './shared/auth.module';
import { HotelModule } from './hotel/hotel.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { AiModule } from './ai/ai.module';
import { AdminModule } from './admin/admin.module';
import { UserEntity } from './shared/infrastructure/database/entities/user.entity';
import { BusinessEntity } from './shared/infrastructure/database/entities/business.entity';
import { ReservationEntity } from './shared/infrastructure/database/entities/reservation.entity';
import { RoomEntity } from './hotel/infrastructure/database/entities/room.entity';
import { TableEntity } from './restaurant/infrastructure/database/entities/table.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'domoblock',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'bookly_db',
      entities: [UserEntity, BusinessEntity, ReservationEntity, RoomEntity, TableEntity],
      synchronize: process.env.NODE_ENV !== 'production', // Solo para desarrollo
      logging: process.env.NODE_ENV === 'development',
    }),
    SharedModule,
    AuthModule,
    HotelModule,
    RestaurantModule,
    AiModule,
    AdminModule,
  ],
})
export class AppModule {}
