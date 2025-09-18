import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from './shared/shared.module';
import { HotelModule } from './hotel/hotel.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { AiModule } from './ai/ai.module';
import { AdminModule } from './admin/admin.module';

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
      username: process.env.DB_USERNAME || 'bookly_user',
      password: process.env.DB_PASSWORD || 'bookly_password',
      database: process.env.DB_NAME || 'bookly_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production', // Solo para desarrollo
      logging: process.env.NODE_ENV === 'development',
    }),
    SharedModule,
    HotelModule,
    RestaurantModule,
    AiModule,
    AdminModule,
  ],
})
export class AppModule {}
