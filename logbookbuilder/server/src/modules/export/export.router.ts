import { Router } from "express";
import type { Request, Response } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { fail } from "../../lib/response.js";
import { exportCsvService, exportExcelService, exportPdfHtmlService } from "./export.service.js";

const router = Router({ mergeParams: true });
router.use(requireAuth);

router.get("/csv", async (req: Request, res: Response) => {
  try {
    const buf = await exportCsvService(req.auth!, req.params.logId);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="log-export.csv"`);
    res.send(buf);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Export failed"); }
});

router.get("/excel", async (req: Request, res: Response) => {
  try {
    const buf = await exportExcelService(req.auth!, req.params.logId);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="log-export.xlsx"`);
    res.send(buf);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Export failed"); }
});

router.get("/pdf", async (req: Request, res: Response) => {
  try {
    const html = await exportPdfHtmlService(req.auth!, req.params.logId);
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Export failed"); }
});

export default router;
