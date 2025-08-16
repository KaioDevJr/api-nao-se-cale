import { Router } from "express";
import {
  createAdminUser,
  listAllUsers,
  promoteUserToAdmin,
  deleteUser,
} from "../controllers/auth.controller.js";
const router = Router();

// Rota para listar usuários (GET /admin/users)
router.get("/", listAllUsers);
// Rota para criar um novo usuário (POST /admin/users)
router.post("/", createAdminUser);
// Rota para deletar um usuário (DELETE /api/admin/users/:id)
router.delete("/:id", deleteUser);
// Rota para promover um usuário (PUT /admin/users/promote)
router.put("/promote", promoteUserToAdmin);

export default router;