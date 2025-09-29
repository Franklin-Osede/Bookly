import { Injectable, Inject } from '@nestjs/common';
import { ConversationRequestDto, ConversationContext } from '../dto/conversation-request.dto';
import { ConversationResponseDto, ResponseType } from '../dto/conversation-response.dto';
import { ReservationService } from '../../../shared/application/services/reservation.service';
import { BusinessRepository } from '../../../shared/application/repositories/business.repository';
import { UserRepository } from '../../../shared/application/repositories/user.repository';
import { REPOSITORY_TOKENS } from '../../../shared/application/tokens/repository.tokens';
import { LangChainService } from '../../infrastructure/langchain/langchain.service';

@Injectable()
export class AiConversationService {
  constructor(
    private readonly reservationService: ReservationService,
    @Inject(REPOSITORY_TOKENS.BUSINESS_REPOSITORY)
    private readonly businessRepository: BusinessRepository,
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly langChainService: LangChainService
  ) {}

  async processMessage(request: ConversationRequestDto): Promise<ConversationResponseDto> {
    try {
      // Extract structured data from natural language
      const extractedData = await this.extractReservationData(request.message, request.context);
      
      // Generate appropriate response
      const response = await this.generateResponse(extractedData, request.context);
      
      return response;
    } catch (error) {
      return {
        message: 'Lo siento, ha ocurrido un error procesando tu solicitud. Por favor, intenta de nuevo.',
        type: ResponseType.ERROR,
        confidence: 0
      };
    }
  }

  async extractReservationData(message: string, context?: ConversationContext): Promise<Record<string, any>> {
    // Use LangChain for intelligent extraction
    return await this.langChainService.extractReservationData(message, context);
  }

  async generateResponse(extractedData: Record<string, any>, context?: ConversationContext): Promise<ConversationResponseDto> {
    // Handle unclear requests with specific message
    if (extractedData.unclear) {
      return {
        message: 'No estoy seguro de lo que necesitas. ¿En qué puedo ayudarte? Por ejemplo: "Quiero una mesa para 4 personas mañana a las 8pm"',
        type: ResponseType.QUESTION,
        confidence: 0.3
      };
    }

    // Handle general questions
    if (context === ConversationContext.GENERAL) {
      return {
        message: 'Entiendo tu consulta. ¿En qué más puedo ayudarte?',
        type: ResponseType.TEXT,
        extractedData,
        confidence: 0.7
      };
    }

    // Handle unclear requests
    if (extractedData.unclear || Object.keys(extractedData).length === 0) {
      return {
        message: 'Lo siento, ha ocurrido un error procesando tu solicitud. Por favor, intenta de nuevo.',
        type: ResponseType.ERROR,
        confidence: 0
      };
    }

    // Use LangChain for intelligent response generation
    const aiMessage = await this.langChainService.generateResponse(extractedData, context);

    // Determine response type based on extracted data
    let responseType = ResponseType.TEXT;
    let suggestions: string[] = [];

    if (extractedData.businessType === 'restaurant') {
      responseType = ResponseType.RESERVATION_SUGGESTED;
      suggestions = ['Confirmar reserva', 'Ver disponibilidad', 'Cambiar fecha'];
    } else if (extractedData.businessType === 'hotel') {
      responseType = ResponseType.RESERVATION_SUGGESTED;
      suggestions = ['Confirmar reserva', 'Ver habitaciones disponibles', 'Cambiar fechas'];
    }

    return {
      message: aiMessage,
      type: responseType,
      extractedData,
      suggestions,
      confidence: 0.95
    };
  }
}
