import { IsString, IsNumber, IsOptional, IsEnum, IsPositive, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TableLocation } from '../../domain/entities/table.entity';

export class CreateTableDto {
  @ApiProperty({
    description: 'Número de la mesa',
    example: 'A1'
  })
  @IsString()
  number: string;

  @ApiProperty({
    description: 'Ubicación de la mesa',
    enum: TableLocation,
    example: 'INDOOR'
  })
  @IsEnum(TableLocation)
  location: TableLocation;

  @ApiProperty({
    description: 'Capacidad de la mesa',
    example: 4,
    minimum: 1
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  capacity: number;

  @ApiPropertyOptional({
    description: 'Descripción de la mesa',
    example: 'Mesa junto a la ventana con vista al jardín'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Estado activo de la mesa',
    example: true,
    default: true
  })
  @IsOptional()
  isActive?: boolean;
}
