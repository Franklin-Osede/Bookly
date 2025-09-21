import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MoneyDto } from './money.dto';

export class UpdateReservationDto {
  @ApiProperty({
    description: 'Estado de la reserva',
    example: 'CONFIRMED',
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
    required: false
  })
  @IsOptional()
  @IsEnum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
  status?: string;

  @ApiProperty({
    description: 'Precio total de la reserva',
    type: MoneyDto,
    required: false
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MoneyDto)
  totalAmount?: MoneyDto;

  @ApiProperty({
    description: 'Notas o solicitudes especiales',
    example: 'Habitación en piso alto, cama king size',
    required: false
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
