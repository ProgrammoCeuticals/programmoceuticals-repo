import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { reportRouter } from "./routes/report.routes.js";
dotenv.config();
export const app = express();
app.use(cors({
    origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173"
}));
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
});
app.use("/api/reports", reportRouter);
const errorHandler = (error, _req, res, _next) => {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    res.status(400).json({ success: false, message });
};
app.use(errorHandler);
