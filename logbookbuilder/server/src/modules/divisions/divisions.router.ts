import { Router } from "express";
import type { Request, Response } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { ok, created, fail, notFound } from "../../lib/response.js";
import {
  listDivisionsService,
  createDivisionService,
  updateDivisionService,
  deleteDivisionService,
  assignUserDivisionService,
  createDivisionSchema,
  updateDivisionSchema,
  assignUserSchema,
} from "./divisions.service.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: Request, res: Response) => {
  const result = await listDivisionsService(req.auth!);
  ok(res, result);
});

router.post("/", async (req: Request, res: Response) => {
  const parsed = createDivisionSchema.safeParse(req.body);
  if (!parsed.success) { fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422); return; }
  try {
    const division = await createDivisionService(req.auth!, parsed.data);
    created(res, division);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Failed to create division"); }
});

router.patch("/:id", async (req: Request, res: Response) => {
  const parsed = updateDivisionSchema.safeParse(req.body);
  if (!parsed.success) { fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422); return; }
  try {
    const division = await updateDivisionService(req.auth!, req.params.id, parsed.data);
    ok(res, division);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Failed to update division"); }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await deleteDivisionService(req.auth!, req.params.id);
    ok(res, { message: "Division deleted" });
  } catch (err) { fail(res, err instanceof Error ? err.message : "Failed to delete division"); }
});

router.post("/assign", async (req: Request, res: Response) => {
  const parsed = assignUserSchema.safeParse(req.body);
  if (!parsed.success) { fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422); return; }
  try {
    const user = await assignUserDivisionService(req.auth!, parsed.data);
    ok(res, user);
  } catch (err) {
    if (err instanceof Error && err.message.includes("not found")) { notFound(res, "User or Division"); return; }
    fail(res, err instanceof Error ? err.message : "Failed to assign division");
  }
});

export default router;
