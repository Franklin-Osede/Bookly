import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AiConversationService } from '../application/services/ai-conversation.service';
import { ConversationRequestDto } from '../application/dto/conversation-request.dto';
import { ConversationResponseDto } from '../application/dto/conversation-response.dto';

@ApiTags('AI Conversation')
@Controller('ai/conversation')
export class AiConversationController {
  constructor(private readonly aiConversationService: AiConversationService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Procesar conversación con IA',
    description: 'Procesa un mensaje en lenguaje natural y devuelve una respuesta inteligente'
  })
  @ApiBody({ type: ConversationRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Respuesta del agente de IA',
    type: ConversationResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos'
  })
  async processConversation(
    @Body() request: ConversationRequestDto
  ): Promise<ConversationResponseDto> {
    return await this.aiConversationService.processMessage(request);
  }

  @Get('health')
  @ApiOperation({
    summary: 'Estado del servicio de IA',
    description: 'Verifica que el servicio de conversación de IA esté funcionando'
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del servicio',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        service: { type: 'string', example: 'ai-conversation' },
        timestamp: { type: 'string', example: '2024-10-15T10:30:00.000Z' }
      }
    }
  })
  async getHealth(): Promise<{ status: string; service: string; timestamp: string }> {
    return {
      status: 'ok',
      service: 'ai-conversation',
      timestamp: new Date().toISOString()
    };
  }
}
