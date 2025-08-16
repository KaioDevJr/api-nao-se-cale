import { Router } from 'express';
import * as porqueAderimosController from '../controllers/porqueAderimos.controller';
import { verifyToken, requireAdmin } from '../middlewares/auth.js';

const router = Router();

// Todas as rotas de "Porque Aderimos" exigem privilégios de administrador
router.use(verifyToken, requireAdmin);

// Rota para criar um novo item "Porque Aderimos"
router.post('/', porqueAderimosController.createPorqueAderimos);

// Rota para buscar um item específico pelo ID
router.get('/:id', porqueAderimosController.getPorqueAderimosById);

// Rota para atualizar um item existente pelo ID
router.put('/:id', porqueAderimosController.updatePorqueAderimos);

// Rota para deletar um item pelo ID
router.delete('/:id', porqueAderimosController.deletePorqueAderimos);

export default router;
