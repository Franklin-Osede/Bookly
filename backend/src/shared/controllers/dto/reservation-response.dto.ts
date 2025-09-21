import { ApiProperty } from '@nestjs/swagger';
import { MoneyResponseDto } from './money.dto';

export class ReservationResponseDto {
  @ApiProperty({
    description: 'ID único de la reserva',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  id: string;

  @ApiProperty({
    description: 'ID del usuario que hizo la reserva',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  userId: string;

  @ApiProperty({
    description: 'ID del negocio',
    example: '550e8400-e29b-41d4-a716-446655440002'
  })
  businessId: string;

  @ApiProperty({
    description: 'ID de la habitación (solo para hoteles)',
    example: '550e8400-e29b-41d4-a716-446655440003',
    required: false
  })
  roomId?: string;

  @ApiProperty({
    description: 'ID de la mesa (solo para restaurantes)',
    example: '550e8400-e29b-41d4-a716-446655440004',
    required: false
  })
  tableId?: string;

  @ApiProperty({
    description: 'Tipo de reserva',
    example: 'HOTEL',
    enum: ['HOTEL', 'RESTAURANT']
  })
  type: string;

  @ApiProperty({
    description: 'Estado de la reserva',
    example: 'CONFIRMED',
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']
  })
  status: string;

  @ApiProperty({
    description: 'Fecha de inicio',
    example: '2024-10-15T15:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  startDate: Date;

  @ApiProperty({
    description: 'Fecha de finalización',
    example: '2024-10-17T11:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  endDate: Date;

  @ApiProperty({
    description: 'Número de huéspedes/comensales',
    example: 2
  })
  guests: number;

  @ApiProperty({
    description: 'Precio total de la reserva',
    type: MoneyResponseDto
  })
  totalAmount: MoneyResponseDto;

  @ApiProperty({
    description: 'Notas o solicitudes especiales',
    example: 'Habitación en piso alto, cama king size',
    required: false
  })
  notes?: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-10-01T10:00:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-10-01T10:30:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  updatedAt: Date;
}
