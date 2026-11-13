import { Router } from "express";
import {
  assessorWorkloadReport,
  complianceDirectiveReport,
  exportChecklistDocx,
  exportRegistryCSV,
  exportRegistryExcel,
} from "../controllers/exports.controller.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { applicationIdParamSchema } from "../validators/application.validators.js";

export const exportsRouter = Router();

exportsRouter.use(requireAuth);

exportsRouter.get(
  "/admin/applications/registry/export/excel",
  requireRoles("admin", "super_admin"),
  exportRegistryExcel,
);

exportsRouter.get(
  "/admin/applications/registry/export/csv",
  requireRoles("admin", "super_admin"),
  exportRegistryCSV,
);

exportsRouter.get(
  "/applications/:applicationId/checklist/export/docx",
  validate(applicationIdParamSchema),
  exportChecklistDocx,
);

exportsRouter.get(
  "/admin/reports/assessor-workload",
  requireRoles("admin", "super_admin"),
  assessorWorkloadReport,
);

exportsRouter.get(
  "/admin/reports/compliance-directives",
  requireRoles("admin", "super_admin"),
  complianceDirectiveReport,
);
