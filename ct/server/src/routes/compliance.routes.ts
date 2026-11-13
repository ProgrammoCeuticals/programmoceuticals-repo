import { Router } from "express";
import {
  closeDirective,
  getComplianceDirective,
  issueComplianceDirective,
  listComplianceDirectives,
  respondToDirective,
} from "../controllers/compliance.controller.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  closeDirectiveSchema,
  directiveIdParamSchema,
  issueDirectiveSchema,
  respondToDirectiveSchema,
} from "../validators/compliance.validators.js";

export const complianceRouter = Router();

complianceRouter.use(requireAuth);

// Admin issues directive
complianceRouter.post(
  "/admin/applications/:applicationId/compliance-directives",
  requireRoles("admin", "super_admin"),
  validate(issueDirectiveSchema),
  issueComplianceDirective,
);

// Shared: list directives for an application
complianceRouter.get(
  "/applications/:applicationId/compliance-directives",
  validate(issueDirectiveSchema.pick({ params: true })),
  listComplianceDirectives,
);

// Shared: get single directive
complianceRouter.get(
  "/compliance-directives/:directiveId",
  validate(directiveIdParamSchema),
  getComplianceDirective,
);

// Applicant responds
complianceRouter.post(
  "/compliance-directives/:directiveId/respond",
  requireRoles("applicant"),
  validate(respondToDirectiveSchema),
  respondToDirective,
);

// Admin closes directive
complianceRouter.patch(
  "/admin/compliance-directives/:directiveId/close",
  requireRoles("admin", "super_admin"),
  validate(closeDirectiveSchema),
  closeDirective,
);
