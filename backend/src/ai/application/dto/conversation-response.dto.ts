import { ApiProperty } from '@nestjs/swagger';

export enum ResponseType {
  TEXT = 'text',
  RESERVATION_CREATED = 'reservation_created',
  RESERVATION_SUGGESTED = 'reservation_suggested',
  QUESTION = 'question',
  ERROR = 'error'
}

export class ConversationResponseDto {
  @ApiProperty({
    description: 'Respuesta del agente de IA',
    example: '¡Perfecto! He encontrado una mesa disponible para 4 personas mañana a las 8pm. ¿Te gustaría que proceda con la reserva?'
  })
  message: string;

  @ApiProperty({
    description: 'Tipo de respuesta',
    enum: ResponseType,
    example: ResponseType.RESERVATION_SUGGESTED
  })
  type: ResponseType;

  @ApiProperty({
    description: 'Datos estructurados extraídos del mensaje (opcional)',
    example: {
      guests: 4,
      date: '2024-10-15',
      time: '20:00',
      businessType: 'restaurant'
    },
    required: false
  })
  extractedData?: Record<string, any>;

  @ApiProperty({
    description: 'Sugerencias de acciones (opcional)',
    example: ['Confirmar reserva', 'Ver otras opciones', 'Cambiar fecha'],
    required: false
  })
  suggestions?: string[];

  @ApiProperty({
    description: 'ID de la reserva creada (si aplica)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    required: false
  })
  reservationId?: string;

  @ApiProperty({
    description: 'Confianza de la respuesta (0-1)',
    example: 0.95,
    minimum: 0,
    maximum: 1
  })
  confidence: number;
}
