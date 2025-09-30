import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ChatWidgetComponent } from './chat-widget.component';
import { AiService } from '../../../core/services/ai.service';
import { ConversationRequest, ConversationResponse, ChatMessage } from '../../../core/models/ai.model';

describe('ChatWidgetComponent', () => {
  let component: ChatWidgetComponent;
  let fixture: ComponentFixture<ChatWidgetComponent>;
  let aiService: jasmine.SpyObj<AiService>;

  beforeEach(async () => {
    const aiServiceSpy = jasmine.createSpyObj('AiService', ['sendMessage']);

    await TestBed.configureTestingModule({
      imports: [
        ChatWidgetComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatListModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AiService, useValue: aiServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatWidgetComponent);
    component = fixture.componentInstance;
    aiService = TestBed.inject(AiService) as jasmine.SpyObj<AiService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty message form', () => {
    expect(component.messageForm.get('message')?.value).toBe('');
  });

  it('should initialize with empty messages array', () => {
    expect(component.messages).toEqual([]);
  });

  it('should initialize as closed', () => {
    expect(component.isOpen).toBeFalsy();
  });

  it('should toggle chat widget', () => {
    expect(component.isOpen).toBeFalsy();
    
    component.toggleChat();
    expect(component.isOpen).toBeTruthy();
    
    component.toggleChat();
    expect(component.isOpen).toBeFalsy();
  });

  it('should send message and receive AI response', () => {
    const mockResponse: ConversationResponse = {
      message: '¡Hola! ¿En qué puedo ayudarte?',
      type: 'text',
      confidence: 0.95
    };

    aiService.sendMessage.and.returnValue(of(mockResponse));

    component.messageForm.patchValue({
      message: 'Hola'
    });

    component.sendMessage();

    expect(aiService.sendMessage).toHaveBeenCalledWith({
      message: 'Hola',
      context: 'general'
    });

    expect(component.messages.length).toBe(2); // User message + AI response
    expect(component.messages[0].isUser).toBeTruthy();
    expect(component.messages[1].isUser).toBeFalsy();
  });

  it('should handle AI service error', () => {
    aiService.sendMessage.and.returnValue(throwError(() => ({ status: 500 })));

    component.messageForm.patchValue({
      message: 'Test message'
    });

    component.sendMessage();

    expect(component.messages.length).toBe(2); // User message + Error message
    expect(component.messages[1].content).toBe('Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.');
  });

  it('should not send empty messages', () => {
    component.messageForm.patchValue({
      message: ''
    });

    component.sendMessage();

    expect(aiService.sendMessage).not.toHaveBeenCalled();
    expect(component.messages.length).toBe(0);
  });

  it('should clear message input after sending', () => {
    const mockResponse: ConversationResponse = {
      message: 'Response',
      type: 'text',
      confidence: 0.95
    };

    aiService.sendMessage.and.returnValue(of(mockResponse));

    component.messageForm.patchValue({
      message: 'Test message'
    });

    component.sendMessage();

    expect(component.messageForm.get('message')?.value).toBe('');
  });

  it('should show loading state during message sending', () => {
    aiService.sendMessage.and.returnValue(of({} as ConversationResponse));

    component.messageForm.patchValue({
      message: 'Test message'
    });

    component.sendMessage();

    expect(component.isLoading).toBeTruthy();
  });

  it('should handle reservation suggestions', () => {
    const mockResponse: ConversationResponse = {
      message: '¡Perfecto! He encontrado una mesa disponible.',
      type: 'reservation_suggested',
      suggestions: ['Confirmar reserva', 'Ver otras opciones'],
      confidence: 0.95
    };

    aiService.sendMessage.and.returnValue(of(mockResponse));

    component.messageForm.patchValue({
      message: 'Quiero una mesa para 4 personas'
    });

    component.sendMessage();

    expect(component.messages[1].suggestions).toEqual(['Confirmar reserva', 'Ver otras opciones']);
  });

  it('should handle keyboard enter key', () => {
    const mockResponse: ConversationResponse = {
      message: 'Response',
      type: 'text',
      confidence: 0.95
    };

    aiService.sendMessage.and.returnValue(of(mockResponse));

    component.messageForm.patchValue({
      message: 'Test message'
    });

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    component.onKeyDown(event);

    expect(aiService.sendMessage).toHaveBeenCalled();
  });

  it('should not send message on other keys', () => {
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    component.onKeyDown(event);

    expect(aiService.sendMessage).not.toHaveBeenCalled();
  });
});
