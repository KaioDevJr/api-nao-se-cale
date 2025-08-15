import { Router, Response } from "express";
import { admin, db } from "../services/firebase.js";
import { AuthedRequest } from "../types/express";
import { anySectionSchema } from "../schemas/section.schemas";

const router = Router();
const sectionsCollection = db.collection("publicContent");

/**
 * POST /api/admin/sections
 * Cria uma nova seção.
 */
router.post("/", async (req: AuthedRequest, res: Response) => {
  try {
    const validation = anySectionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }

    const newSectionRef = await sectionsCollection.add({
      ...validation.data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ id: newSectionRef.id, ...validation.data });
  } catch (e: any) {
    console.error("Error creating section:", e);
    res.status(500).json({ error: e.message });
  }
});

/**
 * PUT /api/admin/sections/:id
 * Atualiza uma seção existente.
 */
router.put("/:id", async (req: AuthedRequest, res: Response) => {
  try {
    const validation = anySectionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }

    const docRef = sectionsCollection.doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Section not found" });
    }

    await docRef.update({
      ...validation.data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ ok: true, id: req.params.id });
  } catch (e: any) {
    console.error(`Error updating section ${req.params.id}:`, e);
    res.status(500).json({ error: e.message });
  }
});

/**
 * GET /api/admin/sections
 * Lista todas as seções para o painel de admin.
 */
router.get("/", async (_req: AuthedRequest, res: Response) => {
  try {
    const snapshot = await sectionsCollection.orderBy("order").get();
    const sections = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(sections);
  } catch (e: any) {
    console.error("Error listing sections:", e);
    res.status(500).json({ error: e.message });
  }
});

/**
 * DELETE /api/admin/sections/:id
 * Deleta uma seção.
 */
router.delete("/:id", async (req: AuthedRequest, res: Response) => {
  try {
    const docRef = sectionsCollection.doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Section not found" });
    }
    await docRef.delete();
    res.json({ ok: true });
  } catch (e: any) {
    console.error(`Error deleting section ${req.params.id}:`, e);
    res.status(500).json({ error: e.message });
  }
});

export default router;