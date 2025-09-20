import { IsString, IsNumber, IsOptional, IsEnum, IsPositive, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoomType } from '../../domain/entities/room.entity';

export class CreateRoomDto {
  @ApiProperty({
    description: 'Número de la habitación',
    example: '101'
  })
  @IsString()
  number: string;

  @ApiProperty({
    description: 'Tipo de habitación',
    enum: RoomType,
    example: 'SINGLE'
  })
  @IsEnum(RoomType)
  type: RoomType;

  @ApiProperty({
    description: 'Capacidad de la habitación',
    example: 2,
    minimum: 1
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  capacity: number;

  @ApiProperty({
    description: 'Precio de la habitación',
    example: 150.00,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Moneda del precio',
    example: 'USD'
  })
  @IsString()
  currency: string;

  @ApiPropertyOptional({
    description: 'Descripción de la habitación',
    example: 'Habitación con vista al mar'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Estado activo de la habitación',
    example: true,
    default: true
  })
  @IsOptional()
  isActive?: boolean;
}
