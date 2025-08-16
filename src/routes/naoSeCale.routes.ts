import { Router } from 'express';
import * as naoSeCaleController from '../controllers/naoSeCale.controller.js';
// Importa o módulo de autenticação para verificar se o usuário é um administrador
import { verifyToken, requireAdmin } from '../middlewares/auth.js';

const router = Router();

// Todas as rotas de NaoSeCale abaixo exigem privilégios de administrador.
router.use(verifyToken, requireAdmin);

// Define as rotas para a seção NaoSeCale

// Rota para buscar todos os itens da seção NaoSeCale
router.get('/', naoSeCaleController.getNaoSeCaleItems);

// Rota para criar um novo item da seção NaoSeCale
// O controller irá validar os dados de entrada usando Zod antes de chamar o serviço.
router.post('/', naoSeCaleController.createNaoSeCale);

// Rotas para operações CRUD em itens específicos da seção NaoSeCale
// O ID do item é passado como parte da URL.

// Busca um item específico pelo ID
router.get('/:id', naoSeCaleController.getNaoSeCaleById);

// Atualiza um item existente pelo ID
router.put('/:id', naoSeCaleController.updateNaoSeCale);

// Deleta um item pelo ID
router.delete('/:id', naoSeCaleController.deleteNaoSeCale);

// Exporta o roteador para ser usado na aplicação principal
export default router;
