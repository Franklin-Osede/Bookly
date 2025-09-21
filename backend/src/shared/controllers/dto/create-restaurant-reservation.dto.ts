import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDateString, IsInt, IsPositive, IsOptional, IsString, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { MoneyDto } from './money.dto';

export class CreateRestaurantReservationDto {
  @ApiProperty({
    description: 'ID del negocio (restaurante)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid'
  })
  @IsUUID()
  businessId: string;

  @ApiProperty({
    description: 'ID de la mesa',
    example: '550e8400-e29b-41d4-a716-446655440001',
    format: 'uuid'
  })
  @IsUUID()
  tableId: string;

  @ApiProperty({
    description: 'Fecha y hora de la reserva',
    example: '2024-10-15T20:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Fecha y hora de finalización de la reserva',
    example: '2024-10-15T22:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'Número de comensales',
    example: 4,
    minimum: 1
  })
  @IsInt()
  @Min(1)
  guests: number;

  @ApiProperty({
    description: 'Precio total de la reserva',
    type: MoneyDto
  })
  @ValidateNested()
  @Type(() => MoneyDto)
  totalAmount: MoneyDto;

  @ApiProperty({
    description: 'Solicitudes especiales',
    example: 'Mesa cerca de la ventana, celebración de cumpleaños',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
