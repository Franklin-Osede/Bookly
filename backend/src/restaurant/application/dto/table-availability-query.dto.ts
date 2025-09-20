import { IsDateString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class TableAvailabilityQueryDto {
  @ApiProperty({
    description: 'Fecha y hora de la reserva',
    example: '2024-01-15T20:00:00Z'
  })
  @IsDateString()
  reservationDate: string;

  @ApiProperty({
    description: 'Duración de la reserva en horas',
    example: 2,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  duration: number;

  @ApiPropertyOptional({
    description: 'Ubicación preferida de la mesa',
    example: 'INDOOR'
  })
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({
    description: 'Capacidad mínima requerida',
    example: 4,
    minimum: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  minCapacity?: number;
}
