import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AiService } from './ai.service';
import { ConversationRequest, ConversationResponse } from '../models/ai.model';

describe('AiService', () => {
  let service: AiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AiService]
    });
    service = TestBed.inject(AiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sendMessage', () => {
    it('should send message and receive AI response', () => {
      const request: ConversationRequest = {
        message: 'Quiero una mesa para 4 personas mañana a las 8pm',
        context: 'restaurant'
      };

      const mockResponse: ConversationResponse = {
        message: '¡Perfecto! He encontrado una mesa disponible para 4 personas mañana a las 8pm. ¿Te gustaría que proceda con la reserva?',
        type: 'reservation_suggested',
        extractedData: {
          guests: 4,
          date: '2024-10-15',
          time: '20:00',
          businessType: 'restaurant'
        },
        suggestions: ['Confirmar reserva', 'Ver otras opciones', 'Cambiar fecha'],
        confidence: 0.95
      };

      service.sendMessage(request).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/v1/ai/conversation');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });

    it('should handle AI service error', () => {
      const request: ConversationRequest = {
        message: 'Invalid message',
        context: 'general'
      };

      service.sendMessage(request).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne('/api/v1/ai/conversation');
      req.flush({ message: 'Internal Server Error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('checkHealth', () => {
    it('should check AI service health', () => {
      const mockHealthResponse = {
        status: 'ok',
        service: 'ai-conversation',
        timestamp: '2024-10-15T10:30:00.000Z'
      };

      service.checkHealth().subscribe(response => {
        expect(response).toEqual(mockHealthResponse);
      });

      const req = httpMock.expectOne('/api/v1/ai/conversation/health');
      expect(req.request.method).toBe('GET');
      req.flush(mockHealthResponse);
    });
  });
});
