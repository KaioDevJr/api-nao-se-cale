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
import usersRoutes from "./users.routes.js";

const router = Router(); 

// Tudo abaixo exige admin
router.use(verifyToken, requireAdmin);

/** -------- Gerenciamento de Usuários -------- */
router.use("/users", usersRoutes);

/** -------- Sub-rotas para seções de conteúdo -------- */
router.use("/testimonials", testimonialsRoutes);
router.use("/naoSeCale", naoSeCaleRoutes);
router.use("/iniciativas", sectionIniciativasRoutes);
router.use("/posts", postsRoutes);
router.use("/canaisDenuncia", sectionCanaisDenunciaRoutes);
router.use("/porqueAderimos", porqueAderimosRoutes);

/** -------- Banners -------- */
router.get("/banners", async (_req: AuthedRequest, res: Response) => {
  try {
    const items = await AdminService.listBanners();
    return res.json(items);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

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

export default router;