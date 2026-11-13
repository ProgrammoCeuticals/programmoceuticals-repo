import { Router } from "express";
import {
  assignFirstAssessor,
  assignSecondAssessor,
  cancelAssignment,
  listAssignments,
  reassignAssignment,
} from "../controllers/assignments.controller.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  assignAssessorSchema,
  assignmentIdParamSchema,
  listAssignmentsSchema,
  reassignSchema,
} from "../validators/assignments.validators.js";

export const assignmentsRouter = Router();

assignmentsRouter.use(requireAuth);

assignmentsRouter.post(
  "/admin/applications/:applicationId/assignments/first-assessor",
  requireRoles("admin", "super_admin"),
  validate(assignAssessorSchema),
  assignFirstAssessor,
);

assignmentsRouter.post(
  "/admin/applications/:applicationId/assignments/second-assessor",
  requireRoles("admin", "super_admin"),
  validate(assignAssessorSchema),
  assignSecondAssessor,
);

assignmentsRouter.get(
  "/applications/:applicationId/assignments",
  validate(listAssignmentsSchema),
  listAssignments,
);

assignmentsRouter.patch(
  "/admin/assignments/:assignmentId/reassign",
  requireRoles("admin", "super_admin"),
  validate(reassignSchema),
  reassignAssignment,
);

assignmentsRouter.patch(
  "/admin/assignments/:assignmentId/cancel",
  requireRoles("admin", "super_admin"),
  validate(assignmentIdParamSchema),
  cancelAssignment,
);
