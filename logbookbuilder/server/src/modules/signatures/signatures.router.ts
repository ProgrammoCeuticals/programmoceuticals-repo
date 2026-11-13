import { Router } from "express";
import type { Request, Response } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { ok, created, fail, notFound } from "../../lib/response.js";
import {
  signRecordSchema, revokeSignatureSchema,
  signRecordService, revokeSignatureService, verifySignatureService,
} from "./signatures.service.js";

const router = Router({ mergeParams: true });
router.use(requireAuth);

// POST /api/logs/:logId/records/:recordId/sign
router.post("/", async (req: Request, res: Response) => {
  const parsed = signRecordSchema.safeParse(req.body);
  if (!parsed.success) { fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422); return; }
  try {
    const sig = await signRecordService(req.auth!, req.params.logId, req.params.recordId, parsed.data);
    created(res, sig);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Signing failed"); }
});

// GET /api/signatures/:id/verify
router.get("/:signatureId/verify", async (req: Request, res: Response) => {
  try {
    const result = await verifySignatureService(req.auth!, req.params.signatureId);
    ok(res, result);
  } catch { notFound(res, "Signature"); }
});

// POST /api/signatures/:id/revoke
router.post("/:signatureId/revoke", async (req: Request, res: Response) => {
  const parsed = revokeSignatureSchema.safeParse(req.body);
  if (!parsed.success) { fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422); return; }
  try {
    const sig = await revokeSignatureService(req.auth!, req.params.signatureId, parsed.data);
    ok(res, sig);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Revocation failed"); }
});

export default router;
