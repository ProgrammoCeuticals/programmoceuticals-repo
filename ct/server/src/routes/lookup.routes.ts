import { Router } from "express";
import { createLookup, deactivateLookup, importLookups, listLookups, updateLookup } from "../controllers/lookup.controller.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createLookupSchema, importLookupsSchema, listLookupsSchema, updateLookupSchema } from "../validators/lookup.validators.js";

export const lookupRouter = Router();

lookupRouter.use(requireAuth);

lookupRouter.get("/", validate(listLookupsSchema), listLookups);
lookupRouter.post("/", requireRoles("super_admin"), validate(createLookupSchema), createLookup);
lookupRouter.patch("/:lookupId", requireRoles("super_admin"), validate(updateLookupSchema), updateLookup);
lookupRouter.patch("/:lookupId/deactivate", requireRoles("super_admin"), validate(updateLookupSchema.pick({ params: true })), deactivateLookup);
lookupRouter.post("/import", requireRoles("super_admin"), validate(importLookupsSchema), importLookups);
