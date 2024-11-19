import { ChatService } from './src/api/chatService.js';
import { StorageService } from './src/storage/storageService.js';

document.addEventListener('DOMContentLoaded', async () => {
  const chatMessages = document.getElementById('chat-messages');
  const queryInput = document.getElementById('query-input');
  const sendButton = document.getElementById('send-button');

  let isProcessing = false;
  let chatService;

  const initializeChatService = async () => {
    try {
      const apiKey = await StorageService.getApiKey();
      if (!apiKey) {
        addMessage('Por favor, configura tu API key en las opciones de la extensión.', 'system');
        return false;
      }
      chatService = new ChatService(apiKey);
      return true;
    } catch (error) {
      console.error('Error initializing chat service:', error);
      addMessage('Error al inicializar el servicio de chat.', 'system');
      return false;
    }
  };

  const addMessage = (content, type) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const setLoading = (loading) => {
    isProcessing = loading;
    sendButton.disabled = loading;
    sendButton.classList.toggle('loading', loading);
    queryInput.disabled = loading;
  };

  const handleSubmit = async () => {
    const query = queryInput.value.trim();
    
    if (!query || isProcessing) return;

    if (!chatService && !(await initializeChatService())) {
      return;
    }

    try {
      setLoading(true);
      addMessage(query, 'user');
      queryInput.value = '';

      const response = await chatService.sendMessage(query);
      addMessage(response, 'assistant');

    } catch (error) {
      addMessage('Lo siento, ha ocurrido un error. Por favor, intenta nuevamente.', 'system');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Event Listeners
  sendButton.addEventListener('click', handleSubmit);

  queryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  });

  // Enable textarea auto-resize
  queryInput.addEventListener('input', () => {
    queryInput.style.height = 'auto';
    queryInput.style.height = Math.min(queryInput.scrollHeight, 150) + 'px';
  });

  // Initialize chat service
  await initializeChatService();
});