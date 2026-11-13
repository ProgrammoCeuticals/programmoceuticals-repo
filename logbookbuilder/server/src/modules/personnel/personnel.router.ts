import { Router } from "express";
import type { Request, Response } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { ok, created, fail, notFound, paginated } from "../../lib/response.js";
import {
  createPersonnelSchema, updatePersonnelSchema,
  listPersonnelService, getPersonnelService, createPersonnelService, updatePersonnelService,
} from "./personnel.service.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: Request, res: Response) => {
  const result = await listPersonnelService(req.auth!, req.query as Record<string, unknown>);
  paginated(res, result);
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const person = await getPersonnelService(req.auth!, req.params.id);
    ok(res, person);
  } catch { notFound(res, "Personnel"); }
});

router.post("/", async (req: Request, res: Response) => {
  const parsed = createPersonnelSchema.safeParse(req.body);
  if (!parsed.success) { fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422); return; }
  try {
    const person = await createPersonnelService(req.auth!, parsed.data);
    created(res, person);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Failed to create personnel"); }
});

router.patch("/:id", async (req: Request, res: Response) => {
  const parsed = updatePersonnelSchema.safeParse(req.body);
  if (!parsed.success) { fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422); return; }
  try {
    const person = await updatePersonnelService(req.auth!, req.params.id, parsed.data);
    ok(res, person);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Failed to update personnel"); }
});

export default router;
