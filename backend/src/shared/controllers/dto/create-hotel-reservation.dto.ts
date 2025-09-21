import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDateString, IsInt, IsPositive, IsOptional, IsString, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { MoneyDto } from './money.dto';

export class CreateHotelReservationDto {
  @ApiProperty({
    description: 'ID del negocio (hotel)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid'
  })
  @IsUUID()
  businessId: string;

  @ApiProperty({
    description: 'ID de la habitación',
    example: '550e8400-e29b-41d4-a716-446655440001',
    format: 'uuid'
  })
  @IsUUID()
  roomId: string;

  @ApiProperty({
    description: 'Fecha de check-in',
    example: '2024-10-15T15:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Fecha de check-out',
    example: '2024-10-17T11:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'Número de huéspedes',
    example: 2,
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
    example: 'Habitación en piso alto, cama king size',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
