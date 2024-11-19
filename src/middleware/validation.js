import { z } from 'zod';

const chatSchema = z.object({
  pregunta: z.string().min(1, 'La pregunta es requerida').max(500, 'La pregunta es demasiado larga'),
  usuarioId: z.string().optional()
});

export const validateChat = (req, res, next) => {
  try {
    const result = chatSchema.parse(req.body);
    req.body = result;
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Validación fallida',
      details: error.errors
    });
  }
};