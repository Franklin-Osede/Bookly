import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([]), // Aquí añadiremos las entidades cuando las creemos
  ],
  exports: [TypeOrmModule],
})
export class SharedModule {}
