import { Response, NextFunction } from 'express';
import { admin } from "../services/firebase";
import { AuthedRequest } from '../types/express';

export async function verifyToken(req: AuthedRequest, res: Response, next: NextFunction) {
    try {
        const auth = req.headers.authorization || "";
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
        if (!token)
            return res.status(401).json({ error: "No token" });

        const decoded = await admin.auth().verifyIdToken(token, true);
        req.user = decoded;
        next();
    } catch (e) {
        console.error("Token verification failed:", e);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
    const isAdmin = req.user?.admin === true;
    if (!isAdmin)
        return res.status(403).json({ error: "Admin only" });
    next();

}
