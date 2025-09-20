import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoomType } from '../../domain/entities/room.entity';

export class RoomResponseDto {
  @ApiProperty({
    description: 'ID único de la habitación',
    example: 'room-123'
  })
  id: string;

  @ApiProperty({
    description: 'ID del negocio (hotel)',
    example: 'hotel-456'
  })
  businessId: string;

  @ApiProperty({
    description: 'Número de la habitación',
    example: '101'
  })
  number: string;

  @ApiProperty({
    description: 'Tipo de habitación',
    enum: RoomType,
    example: 'SINGLE'
  })
  type: RoomType;

  @ApiProperty({
    description: 'Capacidad de la habitación',
    example: 2
  })
  capacity: number;

  @ApiProperty({
    description: 'Precio de la habitación',
    example: 150.00
  })
  price: number;

  @ApiProperty({
    description: 'Moneda del precio',
    example: 'USD'
  })
  currency: string;

  @ApiPropertyOptional({
    description: 'Descripción de la habitación',
    example: 'Habitación con vista al mar'
  })
  description?: string;

  @ApiProperty({
    description: 'Estado activo de la habitación',
    example: true
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00Z'
  })
  updatedAt: Date;
}
