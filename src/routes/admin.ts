import { Router, Response } from "express";
import { AuthedRequest } from "../types/express";
import { verifyToken, requireAdmin } from "../middlewares/auth.js";
import * as AdminService from "../services/admin.service.js";
import testimonialsRoutes from "./testimonials.routes.js";
import naoSeCaleRoutes from "./naoSeCale.routes.js";
import sectionIniciativasRoutes from "./sectionIniciativas.routes.js";
import postsRoutes from "./posts.routes.js";
import sectionCanaisDenunciaRoutes from "./sectionCanaisDenuncia.routes.js";
import porqueAderimosRoutes from "./porqueAderimos.routes.js";
import { createAdminUser, promoteUserToAdmin, listAllUsers } from "../controllers/auth.controller.js";

const router = Router();

// Tudo abaixo exige admin
router.use(verifyToken, requireAdmin);


/** -------- Banners -------- */
router.get("/banners", async (_req: AuthedRequest, res: Response) => {
  try {
    const items = await AdminService.listBanners();
    return res.json(items);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// Lista todos os usuários
router.get("/users", listAllUsers);

// Cria um novo usuário com permissão de admin
router.post("/users", createAdminUser);

// Promove um usuário existente para admin, baseado no e-mail
router.put("/users/promote", promoteUserToAdmin);


router.post("/banners/confirm", async (req: AuthedRequest, res: Response) => {
  try {
    const { storagePath, alt = "", link = "", isActive = true } = req.body ?? {};
    if (!storagePath) return res.status(400).json({ error: "storagePath required" });

    const result = await AdminService.confirmBanner({ storagePath, alt, link, isActive });
    return res.json(result);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

router.delete("/banners/:id", async (req: AuthedRequest, res: Response) => {
  try {
    const result = await AdminService.deleteBanner(req.params.id);
    if (result === null) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

/** -------- Denúncias -------- */
router.get("/reports", async (req: AuthedRequest, res: Response) => {
  try {
    const limit = Number(req.query.limit || 20);
    const after = req.query.after ? String(req.query.after) : undefined;
    const result = await AdminService.listReports({ limit, after });
    return res.json(result);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

router.get("/reports/:id", async (req: AuthedRequest, res: Response) => {
  try {
    const report = await AdminService.getReportById(req.params.id);
    if (!report) return res.status(404).json({ error: "Not found" });
    return res.json(report);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// A alteração abaixo primeiro verifica se a denúncia existe. 
// Se não, retorna um erro 404. Se existe, prossegue com a atualização usando 
// o método .update(), que é semanticamente mais correto
router.patch("/reports/:id", async (req: AuthedRequest, res: Response) => {
  try {
    const { status, notes } = req.body ?? {};
    // A lógica de atualização foi movida para o serviço.
    // O serviço retornará null se o relatório não for encontrado.
    const result = await AdminService.updateReport(req.params.id, { status, notes });
    if (result === null) {
      return res.status(404).json({ error: "Report not found" });
    }
    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

/** -------- Depoimentos -------- */

router.use("/testimonials", testimonialsRoutes);

/** -------- Seção NaoSeCale -------- */

router.use("/naoSeCale", naoSeCaleRoutes);

/** -------- Seção Iniciativas -------- */

router.use("/iniciativas", sectionIniciativasRoutes);

/** -------- Seção Posts em Destaque -------- */

router.use("/posts", postsRoutes);

/** -------- Seção Canais de Denúncia -------- */

router.use("/canaisDenuncia", sectionCanaisDenunciaRoutes);

/** -------- Seção Porque Aderimos -------- */

router.use("/porqueAderimos", porqueAderimosRoutes);

export default router;