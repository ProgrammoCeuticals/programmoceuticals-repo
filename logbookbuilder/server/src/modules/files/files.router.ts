import { Router } from "express";
import type { Request, Response } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { ok, created, fail, notFound, noContent } from "../../lib/response.js";
import { upload, uploadFileService, getFileService, deleteFileService } from "./files.service.js";
import fs from "node:fs";

const router = Router();
router.use(requireAuth);

router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) { fail(res, "No file provided"); return; }
  try {
    const attachment = await uploadFileService(
      req.auth!,
      req.file,
      req.body.recordId,
      req.body.columnId
    );
    created(res, attachment);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Upload failed"); }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const file = await getFileService(req.auth!, req.params.id);
    res.setHeader("Content-Type", file.mimeType);
    res.setHeader("Content-Disposition", `inline; filename="${file.originalName}"`);
    fs.createReadStream(file.storagePath).pipe(res);
  } catch { notFound(res, "File"); }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await deleteFileService(req.auth!, req.params.id);
    noContent(res);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Delete failed"); }
});

export default router;
