import { Router, Response, NextFunction } from "express";
import multer from "multer";
import { bucket } from "../services/firebase";
import { AuthedRequest } from "../types/express";
import { verifyToken, requireAdmin } from "../middlewares/auth.js";
import * as UploadService from "../services/upload.service.js";

const router = Router();

// --- Multer Configuration for in-memory storage ---
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB file size limit
    },
});

// Middleware customizado para aplicar autenticação apenas para o tipo 'banner'
const requireAdminForBanner = (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (req.body?.type === 'banner') {
        // Se for banner, executa a cadeia de autenticação de admin
        return verifyToken(req, res, () => requireAdmin(req, res, next));
    }
    // Para outros tipos (ex: 'report'), permite o acesso público
    next();
};

/**
 * NEW ROUTE: POST /api/uploads/file
 * Handles direct file upload using multipart/form-data.
 * The frontend should send the file with the key 'file'.
 * It should also send a 'destination' field in the form data (e.g., 'banners', 'reports').
 */
router.post(
    "/file",
    verifyToken, // Apply authentication to this route
    upload.single("file"), // 'file' is the field name in the FormData
    async (req: AuthedRequest, res: Response) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded." });
            }

            const destination = req.body.destination || 'general'; // e.g., 'banners', 'reports'

            // Example of permission check: only admins can upload to 'banners' folder.
            if (destination === 'banners' && !req.user?.isAdmin) {
                return res.status(403).json({ error: "Forbidden: Only admins can upload banners." });
            }

            const result = await UploadService.uploadFileToStorage(req.file, destination);

            return res.status(201).json(result);

        } catch (e: any) {
            console.error("Error uploading file:", e);
            return res.status(500).json({ error: e.message });
        }
    }
);

router.post("/signed-url", requireAdminForBanner, async (req: AuthedRequest, res: Response) => {
    try {
        const { type, filename, contentType } = req.body ?? {};
        if (!type || !filename || !contentType)
            return res.status(400).json({ error: "type, filename, contentType required" });

        let filePath: string;

        if (type === "banner") {
            filePath = `banners/${Date.now()}_${filename}`;
        } else if (type === "report") {
            filePath = `reports/${Date.now()}_${filename}`;
        } else {
            return res.status(400).json({ error: "Invalid type. Must be 'report' or 'banner'." });
        }

        const file = bucket.file(filePath);
        const [url] = await file.getSignedUrl({
            version: "v4",
            action: "write",
            expires: Date.now() + 10 * 60 * 1000, // 10 minutes
            contentType,
        });
        return res.json({ uploadUrl: url, storagePath: file.name });
    } catch (e: any) {
        console.error("Error generating signed URL:", e);
        return res.status(500).json({ error: e.message });
    }
});

export default router;
