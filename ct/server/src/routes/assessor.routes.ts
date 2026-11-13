import { Router } from "express";
import {
  deleteReport,
  getApplicationComments,
  getApplicationReports,
  getMyAssignments,
  getReport,
  startAssignment,
  submitAssessment,
  submitComment,
  uploadReport,
} from "../controllers/assessor.controller.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { uploadToCloudinary, uploadWordReport } from "../middleware/upload.js";
import {
  assignmentIdParamSchema,
  reportIdParamSchema,
  submitAssessmentSchema,
  submitCommentSchema,
} from "../validators/assessor.validators.js";
import { applicationIdParamSchema } from "../validators/application.validators.js";

export const assessorRouter = Router();

assessorRouter.use(requireAuth);

assessorRouter.get("/assessor/assignments", requireRoles("assessor"), getMyAssignments);

assessorRouter.post(
  "/assessor/assignments/:assignmentId/start",
  requireRoles("assessor"),
  validate(assignmentIdParamSchema),
  startAssignment,
);

assessorRouter.post(
  "/assessor/assignments/:assignmentId/reports",
  requireRoles("assessor"),
  uploadWordReport,
  uploadToCloudinary,
  validate(assignmentIdParamSchema),
  uploadReport,
);

assessorRouter.delete(
  "/assessor/reports/:reportId",
  requireRoles("assessor"),
  validate(reportIdParamSchema),
  deleteReport,
);

assessorRouter.post(
  "/assessor/assignments/:assignmentId/comments",
  requireRoles("assessor"),
  validate(submitCommentSchema),
  submitComment,
);

assessorRouter.post(
  "/assessor/assignments/:assignmentId/submit",
  requireRoles("assessor"),
  validate(submitAssessmentSchema),
  submitAssessment,
);

// Shared: admin/assessor can view reports and comments
assessorRouter.get(
  "/applications/:applicationId/assessor-reports",
  validate(applicationIdParamSchema),
  getApplicationReports,
);

assessorRouter.get(
  "/applications/:applicationId/assessor-comments",
  validate(applicationIdParamSchema),
  getApplicationComments,
);

assessorRouter.get(
  "/assessor-reports/:reportId",
  validate(reportIdParamSchema),
  getReport,
);
