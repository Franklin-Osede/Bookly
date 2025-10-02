import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AiService } from '../../../core/services/ai.service';
import { ConversationRequest, ConversationResponse, ChatMessage } from '../../../core/models/ai.model';

@Component({
  selector: 'app-chat-widget',
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class ChatWidgetComponent {
  isOpen = false;
  isLoading = false;
  messages: ChatMessage[] = [];
  messageForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private aiService: AiService
  ) {
    this.messageForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    if (this.messageForm.valid && !this.isLoading) {
      const message = this.messageForm.value.message.trim();
      
      if (message) {
        // Add user message
        this.addMessage(message, true);
        
        // Clear form
        this.messageForm.patchValue({ message: '' });
        
        // Send to AI
        this.isLoading = true;
        const request: ConversationRequest = {
          message: message,
          context: 'general'
        };

        this.aiService.sendMessage(request).subscribe({
          next: (response: ConversationResponse) => {
            this.isLoading = false;
            this.addMessage(response.message, false, response.type, response.suggestions);
          },
          error: (error) => {
            this.isLoading = false;
            this.addMessage('Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.', false, 'error');
          }
        });
      }
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private addMessage(content: string, isUser: boolean, type: string = 'text', suggestions?: string[]): void {
    const message: ChatMessage = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date(),
      type: type as any,
      suggestions
    };
    
    this.messages.push(message);
  }

  onSuggestionClick(suggestion: string): void {
    this.messageForm.patchValue({ message: suggestion });
    this.sendMessage();
  }
}
