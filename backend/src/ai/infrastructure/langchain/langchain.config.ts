import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';

@Injectable()
export class LangChainConfig {
  private chatModel: ChatOpenAI;
  private promptTemplate: PromptTemplate;

  constructor(private configService: ConfigService) {
    this.initializeLangChain();
  }

  private initializeLangChain() {
    // Initialize OpenAI chat model
    this.chatModel = new ChatOpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      modelName: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Initialize prompt template for reservation extraction
    this.promptTemplate = PromptTemplate.fromTemplate(`
Eres un asistente de IA especializado en procesar solicitudes de reservas para hoteles y restaurantes.

Analiza el siguiente mensaje del usuario y extrae la información estructurada:

Mensaje: {message}
Contexto: {context}

Extrae la siguiente información en formato JSON:
- guests: número de personas/huéspedes
- date: fecha solicitada (formato YYYY-MM-DD)
- time: hora solicitada (formato HH:MM)
- businessType: "restaurant" o "hotel"
- startDate: fecha de inicio (para hoteles)
- endDate: fecha de fin (para hoteles)
- unclear: true si el mensaje no es claro

Responde SOLO con el JSON extraído, sin explicaciones adicionales.
    `);
  }

  getChatModel(): ChatOpenAI {
    return this.chatModel;
  }

  getPromptTemplate(): PromptTemplate {
    return this.promptTemplate;
  }
}
