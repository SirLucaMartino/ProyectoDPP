import { useState, useRef, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatService } from './api/chatService';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';

interface Message {
  content: string;
  type: 'system' | 'user' | 'assistant';
}

function App() {
  const [messages, setMessages] = useState<Message[]>([{
    content: 'Bienvenido al Asistente Virtual de la Defensoría Penal Pública de Arica. ¿En qué puedo ayudarte?',
    type: 'system'
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatService = useRef<ChatService | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (apiKey) {
      chatService.current = new ChatService(apiKey);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading || !chatService.current) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      setMessages(prev => [...prev, { content: userMessage, type: 'user' }]);
      const response = await chatService.current.sendMessage(userMessage);
      setMessages(prev => [...prev, { content: response, type: 'assistant' }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        content: 'Lo siento, ha ocurrido un error. Por favor, intenta nuevamente.',
        type: 'system'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-[#003876] text-white p-4 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <MessageCircle className="w-8 h-8" />
          <h1 className="text-xl font-semibold">AsistenteDPP</h1>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md h-[calc(100vh-12rem)] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                content={message.content}
                type={message.type}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </main>

      <footer className="text-center p-4 text-sm text-gray-600 border-t">
        Defensoría Penal Pública de Arica © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;