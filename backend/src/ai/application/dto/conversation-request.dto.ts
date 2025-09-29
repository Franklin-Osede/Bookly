import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';

export enum ConversationContext {
  RESTAURANT = 'restaurant',
  HOTEL = 'hotel',
  GENERAL = 'general'
}

export class ConversationRequestDto {
  @ApiProperty({
    description: 'Mensaje del usuario en lenguaje natural',
    example: 'Quiero una mesa para 4 personas mañana a las 8pm',
    minLength: 1
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'ID del negocio (opcional)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    required: false
  })
  @IsOptional()
  @IsUUID()
  businessId?: string;

  @ApiProperty({
    description: 'Contexto de la conversación',
    enum: ConversationContext,
    example: ConversationContext.RESTAURANT,
    required: false
  })
  @IsOptional()
  @IsEnum(ConversationContext)
  context?: ConversationContext;

  @ApiProperty({
    description: 'ID del usuario (opcional)',
    example: '550e8400-e29b-41d4-a716-446655440001',
    format: 'uuid',
    required: false
  })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
