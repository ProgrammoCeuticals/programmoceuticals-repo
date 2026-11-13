import { Router } from "express";
import type { Request, Response } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { ok, created, fail } from "../../lib/response.js";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  registerService,
  loginService,
  refreshService,
  logoutService,
} from "./auth.service.js";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    fail(res, parsed.error.errors.map((e) => e.message).join(", "), 422);
    return;
  }
  try {
    const result = await registerService(parsed.data);
    created(res, result);
  } catch (err) {
    fail(res, err instanceof Error ? err.message : "Registration failed");
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    fail(res, "Invalid credentials", 422);
    return;
  }
  try {
    const result = await loginService(parsed.data);
    ok(res, result);
  } catch (err) {
    fail(res, err instanceof Error ? err.message : "Login failed", 401);
  }
});

router.post("/refresh", async (req: Request, res: Response) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    fail(res, "Refresh token required", 422);
    return;
  }
  try {
    const result = await refreshService(parsed.data);
    ok(res, result);
  } catch (err) {
    fail(res, err instanceof Error ? err.message : "Token refresh failed", 401);
  }
});

router.post("/logout", requireAuth, async (req: Request, res: Response) => {
  await logoutService(req.auth!);
  ok(res, { message: "Logged out successfully" });
});

router.get("/me", requireAuth, (req: Request, res: Response) => {
  ok(res, req.auth);
});

export default router;
