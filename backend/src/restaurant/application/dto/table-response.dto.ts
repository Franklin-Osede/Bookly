import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TableLocation } from '../../domain/entities/table.entity';

export class TableResponseDto {
  @ApiProperty({
    description: 'ID único de la mesa',
    example: 'table-123'
  })
  id: string;

  @ApiProperty({
    description: 'ID del negocio (restaurante)',
    example: 'restaurant-456'
  })
  businessId: string;

  @ApiProperty({
    description: 'Número de la mesa',
    example: 'A1'
  })
  number: string;

  @ApiProperty({
    description: 'Ubicación de la mesa',
    enum: TableLocation,
    example: 'INDOOR'
  })
  location: TableLocation;

  @ApiProperty({
    description: 'Capacidad de la mesa',
    example: 4
  })
  capacity: number;

  @ApiPropertyOptional({
    description: 'Descripción de la mesa',
    example: 'Mesa junto a la ventana con vista al jardín'
  })
  description?: string;

  @ApiProperty({
    description: 'Estado activo de la mesa',
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
