import { Router } from "express";
import type { Request, Response } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { ok, fail, notFound } from "../../lib/response.js";
import { updateOrgSchema, getOrganizationService, updateOrganizationService } from "./organizations.service.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: Request, res: Response) => {
  try {
    const org = await getOrganizationService(req.auth!);
    ok(res, org);
  } catch (err) {
    notFound(res, "Organization");
  }
});

router.patch("/", async (req: Request, res: Response) => {
  const parsed = updateOrgSchema.safeParse(req.body);
  if (!parsed.success) {
    fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422);
    return;
  }
  try {
    const org = await updateOrganizationService(req.auth!, parsed.data);
    ok(res, org);
  } catch (err) {
    fail(res, err instanceof Error ? err.message : "Update failed");
  }
});

export default router;
