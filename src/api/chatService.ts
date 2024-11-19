import { API_CONFIG } from './config';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class ChatService {
  private apiKey: string;
  private conversationHistory: Message[] = [];
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = API_CONFIG.baseUrl;
  }

  async sendMessage(userMessage: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/interact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          pregunta: userMessage,
          usuarioId: crypto.randomUUID()
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error en la comunicación con el servicio');
      }

      const data = await response.json();
      
      if (!data.respuesta) {
        throw new Error('Respuesta inválida del servidor');
      }

      // Update conversation history
      this.conversationHistory.push(
        { role: 'user', content: userMessage },
        { role: 'assistant', content: data.respuesta }
      );

      // Keep only last 6 messages
      if (this.conversationHistory.length > 6) {
        this.conversationHistory = this.conversationHistory.slice(-6);
      }

      return data.respuesta;
    } catch (error) {
      console.error('Error en ChatService:', error);
      throw error instanceof Error ? error : new Error('Error desconocido en el servicio de chat');
    }
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }
}