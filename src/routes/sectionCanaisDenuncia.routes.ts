import { Router } from 'express';
import * as canalDenunciaController from '../controllers/sectionCanaisDenuncia.controller';
// Importa o módulo de autenticação para verificar se o usuário é um administrador
import { verifyToken, requireAdmin } from '../middlewares/auth.js';

const router = Router();

// Todas as rotas de canais de denúncia abaixo exigem privilégios de administrador.
router.use(verifyToken, requireAdmin);

// Define as rotas para os canais de denúncia

router.get('/', canalDenunciaController.getCanaisDenuncia);
// Rota para criar um novo canal de denúncia
// O controller irá validar os dados de entrada usando Zod antes de chamar o serviço.
router.post('/', canalDenunciaController.createCanalDenuncia);
// Rotas para operações CRUD em canais de denúncia específicos
// O ID do canal de denúncia é passado como parte da URL.
router.get('/:id', canalDenunciaController.getCanalDenunciaById);
// Atualiza um canal de denúncia existente pelo ID
router.put('/:id', canalDenunciaController.updateCanalDenuncia);
// Deleta um canal de denúncia pelo ID
router.delete('/:id', canalDenunciaController.deleteCanalDenuncia);

// Exporta o roteador para ser usado na aplicação principal
export default router;
