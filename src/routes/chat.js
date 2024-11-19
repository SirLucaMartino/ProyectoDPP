import { Router } from 'express';
import { ChatService } from '../services/chatService.js';
import { validateChat } from '../middleware/validation.js';

const router = Router();
const chatService = new ChatService();

router.post('/interact', validateChat, async (req, res, next) => {
  try {
    const { pregunta, usuarioId } = req.body;
    const response = await chatService.generateResponse(pregunta, usuarioId);
    res.json({ respuesta: response });
  } catch (error) {
    next(error);
  }
});

export { router as chatRouter };