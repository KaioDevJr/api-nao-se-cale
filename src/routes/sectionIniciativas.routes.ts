import { Router } from 'express';
import * as iniciativaController from '../controllers/sectionIniciativas.controller';
import { verifyToken, requireAdmin } from '../middlewares/auth.js';

const router = Router();

// Todas as rotas de iniciativas abaixo exigem privilégios de administrador.
router.use(verifyToken, requireAdmin);

// Rota para criar uma nova iniciativa
// O controller irá validar os dados de entrada usando Zod antes de chamar o serviço.
router.post('/', iniciativaController.createIniciativa);

// Atualiza uma iniciativa existente pelo ID
router.put('/:id', iniciativaController.updateIniciativa);

// Deleta uma iniciativa pelo ID
router.delete('/:id', iniciativaController.deleteIniciativa);

export default router;
