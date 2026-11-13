import { Router } from "express";
import type { Request, Response } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { ok, created, fail, notFound, noContent } from "../../lib/response.js";
import {
  createRelationshipSchema, updateRelationshipSchema,
  listRelationshipsService, getRelationshipService,
  createRelationshipService, updateRelationshipService, deleteRelationshipService,
} from "./relationships.service.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: Request, res: Response) => {
  const result = await listRelationshipsService(req.auth!);
  ok(res, result);
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const rel = await getRelationshipService(req.auth!, req.params.id);
    ok(res, rel);
  } catch { notFound(res, "Relationship"); }
});

router.post("/", async (req: Request, res: Response) => {
  const parsed = createRelationshipSchema.safeParse(req.body);
  if (!parsed.success) { fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422); return; }
  try {
    const rel = await createRelationshipService(req.auth!, parsed.data);
    created(res, rel);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Failed to create relationship"); }
});

router.patch("/:id", async (req: Request, res: Response) => {
  const parsed = updateRelationshipSchema.safeParse(req.body);
  if (!parsed.success) { fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422); return; }
  try {
    const rel = await updateRelationshipService(req.auth!, req.params.id, parsed.data);
    ok(res, rel);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Failed to update relationship"); }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await deleteRelationshipService(req.auth!, req.params.id);
    noContent(res);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Failed to delete relationship"); }
});

export default router;
