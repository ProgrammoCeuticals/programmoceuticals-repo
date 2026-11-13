import { Router } from "express";
import type { Request, Response } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { ok, notFound, paginated } from "../../lib/response.js";
import { listAuditEventsService, getAuditEventService } from "./audit.service.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: Request, res: Response) => {
  const result = await listAuditEventsService(req.auth!, req.query as Record<string, unknown>);
  paginated(res, result);
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const event = await getAuditEventService(req.auth!, req.params.id);
    ok(res, event);
  } catch { notFound(res, "Audit event"); }
});

export default router;
