import { Router } from "express";
import type { Request, Response } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { ok, created, fail, notFound, paginated } from "../../lib/response.js";
import {
  createRecordSchema, updateRecordSchema, correctRecordSchema, voidRecordSchema,
  listRecordsService, getRecordService, getRecordLineageService, getRecordHistoryService,
  createRecordService, updateRecordService, correctRecordService, voidRecordService,
} from "./records.service.js";

const router = Router({ mergeParams: true });
router.use(requireAuth);

router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await listRecordsService(req.auth!, req.params.logId, req.query as Record<string, unknown>);
    paginated(res, result);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Failed to list records"); }
});

router.get("/:recordId", async (req: Request, res: Response) => {
  try {
    const record = await getRecordService(req.auth!, req.params.logId, req.params.recordId);
    ok(res, record);
  } catch { notFound(res, "Record"); }
});

router.get("/:recordId/lineage", async (req: Request, res: Response) => {
  try {
    const lineage = await getRecordLineageService(req.auth!, req.params.logId, req.params.recordId);
    ok(res, lineage);
  } catch { notFound(res, "Record"); }
});

router.get("/:recordId/history", async (req: Request, res: Response) => {
  try {
    const history = await getRecordHistoryService(req.auth!, req.params.logId, req.params.recordId);
    ok(res, history);
  } catch { notFound(res, "Record"); }
});

router.post("/", async (req: Request, res: Response) => {
  const parsed = createRecordSchema.safeParse(req.body);
  if (!parsed.success) { fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422); return; }
  try {
    const record = await createRecordService(req.auth!, req.params.logId, parsed.data);
    created(res, record);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Failed to create record"); }
});

router.patch("/:recordId", async (req: Request, res: Response) => {
  const parsed = updateRecordSchema.safeParse(req.body);
  if (!parsed.success) { fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422); return; }
  try {
    const record = await updateRecordService(req.auth!, req.params.logId, req.params.recordId, parsed.data);
    ok(res, record);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Failed to update record"); }
});

router.post("/:recordId/correct", async (req: Request, res: Response) => {
  const parsed = correctRecordSchema.safeParse(req.body);
  if (!parsed.success) { fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422); return; }
  try {
    const record = await correctRecordService(req.auth!, req.params.logId, req.params.recordId, parsed.data);
    created(res, record);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Failed to correct record"); }
});

router.post("/:recordId/void", async (req: Request, res: Response) => {
  const parsed = voidRecordSchema.safeParse(req.body);
  if (!parsed.success) { fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422); return; }
  try {
    const record = await voidRecordService(req.auth!, req.params.logId, req.params.recordId, parsed.data);
    ok(res, record);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Failed to void record"); }
});

export default router;
