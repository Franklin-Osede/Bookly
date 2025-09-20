import { IsDateString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AvailabilityQueryDto {
  @ApiProperty({
    description: 'Fecha de inicio para verificar disponibilidad',
    example: '2024-01-15T14:00:00Z'
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Fecha de fin para verificar disponibilidad',
    example: '2024-01-17T11:00:00Z'
  })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({
    description: 'Tipo de habitación a filtrar',
    example: 'SINGLE'
  })
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({
    description: 'Capacidad mínima requerida',
    example: 2,
    minimum: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  minCapacity?: number;

  @ApiPropertyOptional({
    description: 'Precio máximo',
    example: 200.00,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;
}
