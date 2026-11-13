import { Router } from "express";
import type { Request, Response } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { ok, created, fail, notFound, paginated, noContent } from "../../lib/response.js";
import {
  createLogSchema, updateLogSchema, addColumnSchema, updateColumnSchema, reorderColumnsSchema,
  listLogsService, getLogService, createLogService, updateLogService,
  addColumnService, updateColumnService, removeColumnService, reorderColumnsService,
} from "./logs.service.js";

const router = Router();
router.use(requireAuth);

// ─── Log Definitions ──────────────────────────────────────────────────────────

router.get("/", async (req: Request, res: Response) => {
  const result = await listLogsService(req.auth!, req.query as Record<string, unknown>);
  paginated(res, result);
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const log = await getLogService(req.auth!, req.params.id);
    ok(res, log);
  } catch { notFound(res, "Log"); }
});

router.post("/", async (req: Request, res: Response) => {
  const parsed = createLogSchema.safeParse(req.body);
  if (!parsed.success) { fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422); return; }
  try {
    const log = await createLogService(req.auth!, parsed.data);
    created(res, log);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Failed to create log"); }
});

router.patch("/:id", async (req: Request, res: Response) => {
  const parsed = updateLogSchema.safeParse(req.body);
  if (!parsed.success) { fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422); return; }
  try {
    const log = await updateLogService(req.auth!, req.params.id, parsed.data);
    ok(res, log);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Failed to update log"); }
});

// ─── Columns ──────────────────────────────────────────────────────────────────

router.post("/:id/columns", async (req: Request, res: Response) => {
  const parsed = addColumnSchema.safeParse(req.body);
  if (!parsed.success) { fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422); return; }
  try {
    const col = await addColumnService(req.auth!, req.params.id, parsed.data);
    created(res, col);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Failed to add column"); }
});

router.patch("/:id/columns/:columnId", async (req: Request, res: Response) => {
  const parsed = updateColumnSchema.safeParse(req.body);
  if (!parsed.success) { fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422); return; }
  try {
    const col = await updateColumnService(req.auth!, req.params.id, req.params.columnId, parsed.data);
    ok(res, col);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Failed to update column"); }
});

router.delete("/:id/columns/:columnId", async (req: Request, res: Response) => {
  try {
    await removeColumnService(req.auth!, req.params.id, req.params.columnId);
    noContent(res);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Failed to remove column"); }
});

router.put("/:id/columns/reorder", async (req: Request, res: Response) => {
  const parsed = reorderColumnsSchema.safeParse(req.body);
  if (!parsed.success) { fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422); return; }
  try {
    await reorderColumnsService(req.auth!, req.params.id, parsed.data);
    ok(res, { message: "Columns reordered" });
  } catch (err) { fail(res, err instanceof Error ? err.message : "Failed to reorder columns"); }
});

export default router;
