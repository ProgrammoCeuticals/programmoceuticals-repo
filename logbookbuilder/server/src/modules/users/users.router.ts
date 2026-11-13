import { Router } from "express";
import type { Request, Response } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { ok, created, fail, notFound, paginated } from "../../lib/response.js";
import {
  createUserSchema, updateUserSchema, changePasswordSchema,
  listUsersService, getUserService, createUserService, updateUserService, changePasswordService,
} from "./users.service.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: Request, res: Response) => {
  const result = await listUsersService(req.auth!, req.query as Record<string, unknown>);
  paginated(res, result);
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await getUserService(req.auth!, req.params.id);
    ok(res, user);
  } catch { notFound(res, "User"); }
});

router.post("/", async (req: Request, res: Response) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) { fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422); return; }
  try {
    const user = await createUserService(req.auth!, parsed.data);
    created(res, user);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Failed to create user"); }
});

router.patch("/:id", async (req: Request, res: Response) => {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) { fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422); return; }
  try {
    const user = await updateUserService(req.auth!, req.params.id, parsed.data);
    ok(res, user);
  } catch (err) { fail(res, err instanceof Error ? err.message : "Failed to update user"); }
});

router.post("/me/change-password", async (req: Request, res: Response) => {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) { fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422); return; }
  try {
    await changePasswordService(req.auth!, parsed.data);
    ok(res, { message: "Password changed successfully" });
  } catch (err) { fail(res, err instanceof Error ? err.message : "Failed to change password"); }
});

export default router;
