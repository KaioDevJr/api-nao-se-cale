
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";
import uploadRoutes from "./routes/uploads.js";


const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? true,
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));

const limiter = rateLimit({
  windowMs: 60_000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// DENTRO DE PUBLIC VAI FICAR OS END POINTS ACESSÍVEIS NAS PARTES PÚBLICAS
app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/uploads", uploadRoutes);

const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`API on http://localhost:${port}`));
