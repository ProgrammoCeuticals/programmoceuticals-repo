import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { errorHandler } from "./middleware/errorHandler.js";
import divisionsRouter from "./modules/divisions/divisions.router.js";
import authRouter from "./modules/auth/auth.router.js";
import organizationsRouter from "./modules/organizations/organizations.router.js";
import usersRouter from "./modules/users/users.router.js";
import personnelRouter from "./modules/personnel/personnel.router.js";
import logsRouter from "./modules/logs/logs.router.js";
import recordsRouter from "./modules/records/records.router.js";
import signaturesRouter from "./modules/signatures/signatures.router.js";
import relationshipsRouter from "./modules/relationships/relationships.router.js";
import auditRouter from "./modules/audit/audit.router.js";
import filesRouter from "./modules/files/files.router.js";
import exportRouter from "./modules/export/export.router.js";

const app = express();

const allowedOrigins = new Set(
  (process.env.CLIENT_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
);

app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.has(origin)) return cb(null, true);
    return cb(new Error("Origin not allowed by CORS"));
  },
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// ─── Health ───────────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ ok: true, service: "logbookbuilder" }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/divisions", divisionsRouter);
app.use("/api/auth", authRouter);
app.use("/api/org", organizationsRouter);
app.use("/api/users", usersRouter);
app.use("/api/personnel", personnelRouter);
app.use("/api/logs", logsRouter);
app.use("/api/logs/:logId/records", recordsRouter);
app.use("/api/logs/:logId/records/:recordId/sign", signaturesRouter);
app.use("/api/signatures", signaturesRouter);
app.use("/api/relationships", relationshipsRouter);
app.use("/api/audit", auditRouter);
app.use("/api/files", filesRouter);
app.use("/api/logs/:logId/export", exportRouter);

// ─── Error handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
