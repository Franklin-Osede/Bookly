import { Test, TestingModule } from '@nestjs/testing';
import { AiConversationService } from '../../../../src/ai/application/services/ai-conversation.service';
import { ConversationRequestDto, ConversationContext } from '../../../../src/ai/application/dto/conversation-request.dto';
import { ConversationResponseDto, ResponseType } from '../../../../src/ai/application/dto/conversation-response.dto';
import { ReservationService } from '../../../../src/shared/application/services/reservation.service';
import { REPOSITORY_TOKENS } from '../../../../src/shared/application/tokens/repository.tokens';

describe('AiConversationService', () => {
  let service: AiConversationService;
  let reservationService: jest.Mocked<ReservationService>;
  let businessRepository: jest.Mocked<any>;
  let userRepository: jest.Mocked<any>;

  beforeEach(async () => {
    const mockReservationService = {
      createHotelReservation: jest.fn(),
      createRestaurantReservation: jest.fn(),
      findActiveReservations: jest.fn(),
      findUpcomingReservations: jest.fn(),
    };

    const mockBusinessRepository = {
      findById: jest.fn(),
      findByType: jest.fn(),
    };

    const mockUserRepository = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiConversationService,
        {
          provide: ReservationService,
          useValue: mockReservationService,
        },
        {
          provide: REPOSITORY_TOKENS.BUSINESS_REPOSITORY,
          useValue: mockBusinessRepository,
        },
        {
          provide: REPOSITORY_TOKENS.USER_REPOSITORY,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AiConversationService>(AiConversationService);
    reservationService = module.get(ReservationService);
    businessRepository = module.get(REPOSITORY_TOKENS.BUSINESS_REPOSITORY);
    userRepository = module.get(REPOSITORY_TOKENS.USER_REPOSITORY);
  });

  describe('processMessage', () => {
    it('should process restaurant reservation request', async () => {
      // Arrange
      const request: ConversationRequestDto = {
        message: 'Quiero una mesa para 4 personas mañana a las 8pm',
        businessId: 'business-123',
        context: ConversationContext.RESTAURANT,
        userId: 'user-123'
      };

      // Act
      const result = await service.processMessage(request);

      // Assert
      expect(result).toBeDefined();
      expect(result.type).toBe(ResponseType.RESERVATION_SUGGESTED);
      expect(result.message).toContain('mesa');
      expect(result.extractedData).toHaveProperty('guests', 4);
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should process hotel reservation request', async () => {
      // Arrange
      const request: ConversationRequestDto = {
        message: 'Necesito una habitación para 2 personas del 15 al 17 de octubre',
        businessId: 'hotel-123',
        context: ConversationContext.HOTEL,
        userId: 'user-123'
      };

      // Act
      const result = await service.processMessage(request);

      // Assert
      expect(result).toBeDefined();
      expect(result.type).toBe(ResponseType.RESERVATION_SUGGESTED);
      expect(result.message).toContain('habitación');
      expect(result.extractedData).toHaveProperty('guests', 2);
      expect(result.extractedData).toHaveProperty('startDate');
      expect(result.extractedData).toHaveProperty('endDate');
    });

    it('should handle general questions', async () => {
      // Arrange
      const request: ConversationRequestDto = {
        message: '¿Cuáles son los horarios de atención?',
        businessId: 'business-123',
        context: ConversationContext.GENERAL
      };

      // Act
      const result = await service.processMessage(request);

      // Assert
      expect(result).toBeDefined();
      expect(result.type).toBe(ResponseType.TEXT);
      expect(result.message).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('should handle unclear requests', async () => {
      // Arrange
      const request: ConversationRequestDto = {
        message: 'asdfghjkl',
        businessId: 'business-123',
        context: ConversationContext.GENERAL
      };

      // Act
      const result = await service.processMessage(request);

      // Assert
      expect(result).toBeDefined();
      expect(result.type).toBe(ResponseType.QUESTION);
      expect(result.message).toContain('ayudar');
      expect(result.confidence).toBeLessThan(0.5);
    });

    it('should extract structured data from natural language', async () => {
      // Arrange
      const request: ConversationRequestDto = {
        message: 'Mesa para 6 personas el viernes a las 7:30pm',
        businessId: 'restaurant-123',
        context: ConversationContext.RESTAURANT
      };

      // Act
      const result = await service.processMessage(request);

      // Assert
      expect(result.extractedData).toMatchObject({
        guests: 6,
        businessType: 'restaurant',
        time: expect.any(String)
      });
    });

    it('should provide suggestions for reservation actions', async () => {
      // Arrange
      const request: ConversationRequestDto = {
        message: 'Quiero reservar una mesa',
        businessId: 'restaurant-123',
        context: ConversationContext.RESTAURANT
      };

      // Act
      const result = await service.processMessage(request);

      // Assert
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions).toContain('Confirmar reserva');
      expect(result.suggestions).toContain('Ver disponibilidad');
    });
  });

  describe('extractReservationData', () => {
    it('should extract restaurant reservation data', async () => {
      // Arrange
      const message = 'Mesa para 4 personas mañana a las 8pm';

      // Act
      const result = await service.extractReservationData(message, ConversationContext.RESTAURANT);

      // Assert
      expect(result).toMatchObject({
        guests: 4,
        businessType: 'restaurant',
        time: expect.any(String)
      });
    });

    it('should extract hotel reservation data', async () => {
      // Arrange
      const message = 'Habitación para 2 personas del 15 al 17 de octubre';

      // Act
      const result = await service.extractReservationData(message, ConversationContext.HOTEL);

      // Assert
      expect(result).toMatchObject({
        guests: 2,
        businessType: 'hotel',
        startDate: expect.any(String),
        endDate: expect.any(String)
      });
    });
  });

  describe('generateResponse', () => {
    it('should generate appropriate response for reservation request', async () => {
      // Arrange
      const extractedData = {
        guests: 4,
        businessType: 'restaurant',
        time: '20:00'
      };

      // Act
      const result = await service.generateResponse(extractedData, ConversationContext.RESTAURANT);

      // Assert
      expect(result.type).toBe(ResponseType.RESERVATION_SUGGESTED);
      expect(result.message).toContain('mesa');
      expect(result.suggestions).toBeDefined();
    });

    it('should generate error response for invalid data', async () => {
      // Arrange
      const extractedData = {};

      // Act
      const result = await service.generateResponse(extractedData, ConversationContext.RESTAURANT);

      // Assert
      expect(result.type).toBe(ResponseType.ERROR);
      expect(result.message).toContain('error');
    });
  });
});
