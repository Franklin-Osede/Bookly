import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConversationRequest, ConversationResponse } from '../models/ai.model';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  constructor(private http: HttpClient) {}

  sendMessage(request: ConversationRequest): Observable<ConversationResponse> {
    return this.http.post<ConversationResponse>('/api/v1/ai/conversation', request);
  }

  checkHealth(): Observable<{ status: string; service: string; timestamp: string }> {
    return this.http.get<{ status: string; service: string; timestamp: string }>('/api/v1/ai/conversation/health');
  }
}
