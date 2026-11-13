import { Router } from "express";
import multer from "multer";
import { extname } from "node:path";
import { extractReport } from "../controllers/report.controller.js";
import { analyzeReports } from "../controllers/analyze.controller.js";

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 100 * 1024 * 1024,
    files: 300
  },
  fileFilter: (_req, file, callback) => {
    const extension = extname(file.originalname).toLowerCase();
    const isAllowedFile = [".doc", ".docx", ".pdf", ".xlsx", ".xls"].includes(extension);

    if (isAllowedFile) {
      callback(null, true);
      return;
    }

    callback(new Error("Invalid upload. Reports must be .doc, .docx or .pdf."));
  }
});

export const reportRouter = Router();

// New endpoint: client sends pre-extracted { fileName, text, html }[] as JSON
reportRouter.post("/analyze", analyzeReports);

// Legacy endpoint: server handles file extraction (used for .doc files)
reportRouter.post("/extract", upload.any(), extractReport);
