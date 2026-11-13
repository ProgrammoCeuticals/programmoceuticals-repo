import { Router } from "express";
import { getFinalDecision, recordFinalDecision, reopenApplication } from "../controllers/final-decision.controller.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { finalDecisionSchema, reopenSchema } from "../validators/final-decision.validators.js";
import { applicationIdParamSchema } from "../validators/application.validators.js";

export const finalDecisionRouter = Router();

finalDecisionRouter.use(requireAuth);

finalDecisionRouter.get(
  "/applications/:applicationId/final-decision",
  validate(applicationIdParamSchema),
  getFinalDecision,
);

finalDecisionRouter.post(
  "/admin/applications/:applicationId/final-decision",
  requireRoles("admin", "super_admin"),
  validate(finalDecisionSchema),
  recordFinalDecision,
);

finalDecisionRouter.post(
  "/super-admin/applications/:applicationId/reopen",
  requireRoles("super_admin"),
  validate(reopenSchema),
  reopenApplication,
);
