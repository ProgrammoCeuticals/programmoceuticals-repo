import { Router } from "express";
import {
  addInternalNote,
  addScreeningNote,
  getDashboardStats,
  getRegistry,
  listAssessorsForAssignment,
  listInternalNotes,
  listSubmittedApplications,
  markScreeningSatisfactory,
  startScreening,
} from "../controllers/admin.controller.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { applicationIdParamSchema } from "../validators/application.validators.js";
import { noteSchema } from "../validators/admin.validators.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRoles("admin", "super_admin"));

adminRouter.get("/applications/submitted", listSubmittedApplications);
adminRouter.post("/applications/:applicationId/start-screening", validate(applicationIdParamSchema), startScreening);
adminRouter.post("/applications/:applicationId/screening-notes", validate(noteSchema), addScreeningNote);
adminRouter.post("/applications/:applicationId/screening/mark-satisfactory", validate(applicationIdParamSchema), markScreeningSatisfactory);
adminRouter.get("/applications/registry", getRegistry);
adminRouter.get("/dashboard/stats", getDashboardStats);
adminRouter.get("/assessors", listAssessorsForAssignment);

// Internal notes (also accessible by assessors via shared route below)
adminRouter.post("/applications/:applicationId/internal-notes", validate(noteSchema), addInternalNote);
adminRouter.get("/applications/:applicationId/internal-notes", validate(applicationIdParamSchema), listInternalNotes);
