import OpenAI from 'openai';

export class ChatService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.systemPrompt = `Eres un asistente legal especializado de la Defensoría Penal Pública de Arica, Chile. 
Tu función es proporcionar información general sobre procedimientos penales y servicios de la DPP.
Debes ser profesional, preciso y empático en tus respuestas.
Limita tus respuestas a información general y procedimientos.
No proporciones consejos legales específicos para casos particulares.
Si te preguntan por un caso específico, indica que deben contactar directamente a la DPP.`;
  }

  async generateResponse(pregunta, usuarioId) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: pregunta }
        ],
        temperature: 0.7,
        max_tokens: 500,
        user: usuarioId
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Error al generar la respuesta');
    }
  }
}