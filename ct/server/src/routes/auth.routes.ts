import { Router } from "express";
import { login, logout, me, registerApplicant } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, registerApplicantSchema } from "../validators/auth.validators.js";

export const authRouter = Router();

authRouter.post("/register-applicant", validate(registerApplicantSchema), registerApplicant);
authRouter.post("/login", validate(loginSchema), login);
authRouter.get("/me", requireAuth, me);
authRouter.post("/logout", requireAuth, logout);
