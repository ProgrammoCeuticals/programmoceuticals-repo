import { Router } from "express";
import { getApplicationTimeline, listAuditLogs } from "../controllers/audit.controller.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { applicationIdParamSchema } from "../validators/application.validators.js";

export const auditRouter = Router();

auditRouter.use(requireAuth);

auditRouter.get("/audit-logs", requireRoles("admin", "super_admin"), listAuditLogs);

auditRouter.get(
  "/applications/:applicationId/timeline",
  validate(applicationIdParamSchema),
  getApplicationTimeline,
);
