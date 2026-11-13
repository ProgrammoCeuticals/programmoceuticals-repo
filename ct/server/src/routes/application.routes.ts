import { Router } from "express";
import {
  createApplication,
  getApplication,
  getChecklist,
  getDocumentReferences,
  getMyApplications,
  getStudyPeriods,
  getSummaryResults,
  patchChecklist,
  putDocumentReferences,
  putStudyPeriods,
  putSummaryResults,
  submitApplication,
  updateApplication,
} from "../controllers/application.controller.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  applicationIdParamSchema,
  createApplicationSchema,
  patchChecklistSchema,
  putDocumentReferencesSchema,
  putStudyPeriodsSchema,
  putSummaryResultsSchema,
  updateApplicationSchema,
} from "../validators/application.validators.js";

export const applicationRouter = Router();

applicationRouter.use(requireAuth);

applicationRouter.post("/", requireRoles("applicant"), validate(createApplicationSchema), createApplication);
applicationRouter.get("/my", requireRoles("applicant"), getMyApplications);
applicationRouter.get("/:applicationId", validate(applicationIdParamSchema), getApplication);
applicationRouter.patch("/:applicationId", requireRoles("applicant"), validate(updateApplicationSchema), updateApplication);
applicationRouter.post("/:applicationId/submit", requireRoles("applicant"), validate(applicationIdParamSchema), submitApplication);

applicationRouter.get("/:applicationId/checklist", validate(applicationIdParamSchema), getChecklist);
applicationRouter.patch("/:applicationId/checklist", requireRoles("applicant"), validate(patchChecklistSchema), patchChecklist);

applicationRouter.get("/:applicationId/checklist/study-periods", validate(applicationIdParamSchema), getStudyPeriods);
applicationRouter.put("/:applicationId/checklist/study-periods", requireRoles("applicant"), validate(putStudyPeriodsSchema), putStudyPeriods);

applicationRouter.get("/:applicationId/checklist/summary-results", validate(applicationIdParamSchema), getSummaryResults);
applicationRouter.put("/:applicationId/checklist/summary-results", requireRoles("applicant"), validate(putSummaryResultsSchema), putSummaryResults);

applicationRouter.get(
  "/:applicationId/checklist/document-references",
  validate(applicationIdParamSchema),
  getDocumentReferences,
);
applicationRouter.put(
  "/:applicationId/checklist/document-references",
  requireRoles("applicant"),
  validate(putDocumentReferencesSchema),
  putDocumentReferences,
);
