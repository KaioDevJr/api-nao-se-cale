import { Router } from 'express';
import { 
    createAdminUser, 
    promoteUserToAdmin, 
    listAllUsers, 
    deleteUser 
} from "../controllers/auth.controller.js";

const router = Router();

// O middleware de autenticação de admin (verifyToken, requireAdmin) é aplicado no router
// principal em admin.ts, então não é necessário repeti-lo aqui.

// Lista todos os usuários -> GET /admin/users
router.get("/", listAllUsers);

// Cria um novo usuário com permissão de admin -> POST /admin/users
router.post("/", createAdminUser);

// Promove um usuário existente para admin, baseado no e-mail -> PUT /admin/users/promote
router.put("/promote", promoteUserToAdmin);

// Deleta um usuário pelo seu UID -> DELETE /admin/users/:id
router.delete("/:id", deleteUser);

export default router;