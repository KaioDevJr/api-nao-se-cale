import { Router } from 'express';
import * as testimonialController from '../controllers/testimonials.controller.js';
// Importa o módulo de autenticação para verificar se o usuário é um administrador
import { verifyToken, requireAdmin } from '../middlewares/auth.js';

const router = Router();

// Todas as rotas de depoimentos abaixo exigem privilégios de administrador.
router.use(verifyToken, requireAdmin);
// Define as rotas para os depoimentos

router.get('/', testimonialController.getTestimonials);
// Rota para criar um novo depoimento
// O controller irá validar os dados de entrada usando Zod antes de chamar o serviço.
router.post('/', testimonialController.createTestimonial);
// Rotas para operações CRUD em depoimentos específicos
// O ID do depoimento é passado como parte da URL.
router.get('/:id', testimonialController.getTestimonialById);
// Atualiza um depoimento existente pelo ID
router.put('/:id', testimonialController.updateTestimonial);
// Deleta um depoimento pelo ID
router.delete('/:id', testimonialController.deleteTestimonial);
// Exporta o roteador para ser usado na aplicação principal

export default router;