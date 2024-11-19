import { API_CONFIG } from './config.js';

export class ChatService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.conversationHistory = [];
  }

  async sendMessage(userMessage) {
    try {
      const messages = [
        { role: 'system', content: API_CONFIG.systemPrompt },
        ...this.conversationHistory,
        { role: 'user', content: userMessage }
      ];

      const response = await fetch(API_CONFIG.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: API_CONFIG.model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error('Error en la comunicación con el servidor');
      }

      const data = await response.json();
      const assistantResponse = data.choices[0].message.content;

      // Update conversation history
      this.conversationHistory.push(
        { role: 'user', content: userMessage },
        { role: 'assistant', content: assistantResponse }
      );

      // Keep only last 6 messages to maintain context without exceeding token limits
      if (this.conversationHistory.length > 6) {
        this.conversationHistory = this.conversationHistory.slice(-6);
      }

      return assistantResponse;

    } catch (error) {
      console.error('Error en ChatService:', error);
      throw error;
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}