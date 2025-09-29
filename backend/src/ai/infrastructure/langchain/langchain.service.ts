import { Injectable } from '@nestjs/common';
import { LangChainConfig } from './langchain.config';
import { ConversationContext } from '../../application/dto/conversation-request.dto';

@Injectable()
export class LangChainService {
  constructor(private langChainConfig: LangChainConfig) {}

  async extractReservationData(message: string, context?: ConversationContext): Promise<Record<string, any>> {
    try {
      const chatModel = this.langChainConfig.getChatModel();
      const promptTemplate = this.langChainConfig.getPromptTemplate();

      // Create the prompt with user message and context
      const prompt = await promptTemplate.format({
        message,
        context: context || 'general'
      });

      // Get response from OpenAI
      const response = await chatModel.invoke(prompt);
      const content = response.content as string;

      // Parse JSON response
      try {
        const extractedData = JSON.parse(content);
        return extractedData;
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        return this.fallbackExtraction(message, context);
      }
    } catch (error) {
      console.error('Error in LangChain extraction:', error);
      return this.fallbackExtraction(message, context);
    }
  }

  async generateResponse(extractedData: Record<string, any>, context?: ConversationContext): Promise<string> {
    try {
      const chatModel = this.langChainConfig.getChatModel();

      const prompt = `
Eres un asistente de reservas amigable y profesional. 

Datos extraídos: ${JSON.stringify(extractedData)}
Contexto: ${context || 'general'}

Genera una respuesta natural y útil en español que:
1. Confirme la información extraída
2. Ofrezca sugerencias apropiadas
3. Sea amigable y profesional
4. Incluya opciones de acción

Responde en máximo 2-3 oraciones.
      `;

      const response = await chatModel.invoke(prompt);
      return response.content as string;
    } catch (error) {
      console.error('Error generating response:', error);
      return this.fallbackResponse(extractedData, context);
    }
  }

  private fallbackExtraction(message: string, context?: ConversationContext): Record<string, any> {
    const data: Record<string, any> = {};
    
    // Basic regex extraction as fallback
    const guestMatch = message.match(/(\d+)\s*(personas?|gente|comensales?|huéspedes?)/i);
    if (guestMatch) {
      data.guests = parseInt(guestMatch[1]);
    }

    const timeMatch = message.match(/(\d{1,2}):?(\d{2})?\s*(am|pm|AM|PM)?/i);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      const period = timeMatch[3]?.toLowerCase();
      
      if (period === 'pm' && hour < 12) hour += 12;
      if (period === 'am' && hour === 12) hour = 0;
      
      data.time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    if (context === ConversationContext.RESTAURANT) {
      data.businessType = 'restaurant';
    } else if (context === ConversationContext.HOTEL) {
      data.businessType = 'hotel';
    }

    if (Object.keys(data).length === 0) {
      data.unclear = true;
    }

    return data;
  }

  private fallbackResponse(extractedData: Record<string, any>, context?: ConversationContext): string {
    if (extractedData.unclear) {
      return 'No estoy seguro de lo que necesitas. ¿En qué puedo ayudarte? Por ejemplo: "Quiero una mesa para 4 personas mañana a las 8pm"';
    }

    if (extractedData.businessType === 'restaurant') {
      return `¡Perfecto! He encontrado una mesa disponible para ${extractedData.guests || 'varias'} personas${extractedData.time ? ` a las ${extractedData.time}` : ''}. ¿Te gustaría que proceda con la reserva?`;
    }

    if (extractedData.businessType === 'hotel') {
      return `¡Excelente! He encontrado una habitación disponible para ${extractedData.guests || 'varios'} huéspedes${extractedData.startDate ? ` del ${extractedData.startDate}` : ''}${extractedData.endDate ? ` al ${extractedData.endDate}` : ''}. ¿Te gustaría que proceda con la reserva?`;
    }

    return 'Entiendo tu solicitud. ¿En qué más puedo ayudarte?';
  }
}
