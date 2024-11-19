import { StorageService } from './src/storage/storageService.js';

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('options-form');
  const apiKeyInput = document.getElementById('api-key');
  const statusMessage = document.getElementById('status-message');

  // Load saved API key
  const savedApiKey = await StorageService.getApiKey();
  if (savedApiKey) {
    apiKeyInput.value = savedApiKey;
  }

  const showStatus = (message, isError = false) => {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${isError ? 'error' : 'success'}`;
    statusMessage.style.display = 'block';
    setTimeout(() => {
      statusMessage.style.display = 'none';
    }, 3000);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      showStatus('Por favor, ingresa una API key válida.', true);
      return;
    }

    try {
      await StorageService.saveApiKey(apiKey);
      showStatus('Configuración guardada exitosamente.');
    } catch (error) {
      console.error('Error saving API key:', error);
      showStatus('Error al guardar la configuración.', true);
    }
  });
});