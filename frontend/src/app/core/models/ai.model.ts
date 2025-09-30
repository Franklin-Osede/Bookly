export interface ConversationRequest {
  message: string;
  businessId?: string;
  context?: 'restaurant' | 'hotel' | 'general';
  userId?: string;
}

export interface ConversationResponse {
  message: string;
  type: 'text' | 'reservation_created' | 'reservation_suggested' | 'question' | 'error';
  extractedData?: Record<string, any>;
  suggestions?: string[];
  reservationId?: string;
  confidence: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'reservation_created' | 'reservation_suggested' | 'question' | 'error';
  suggestions?: string[];
  extractedData?: Record<string, any>;
}
