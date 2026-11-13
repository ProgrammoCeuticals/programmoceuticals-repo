import { Router } from "express";
import { getClassification, getClassificationSuggestions, upsertClassification } from "../controllers/classification.controller.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { classificationSchema, classificationParamSchema, classificationSuggestionSchema } from "../validators/classification.validators.js";

export const classificationRouter = Router();

classificationRouter.use(requireAuth);

classificationRouter.get(
  "/admin/classification-suggestions",
  requireRoles("admin", "super_admin"),
  validate(classificationSuggestionSchema),
  getClassificationSuggestions,
);

classificationRouter.get(
  "/applications/:applicationId/classification",
  validate(classificationParamSchema),
  getClassification,
);

classificationRouter.put(
  "/admin/applications/:applicationId/classification",
  requireRoles("admin", "super_admin"),
  validate(classificationSchema),
  upsertClassification,
);
