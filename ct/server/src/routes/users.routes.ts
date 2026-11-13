import { Router } from "express";
import {
  changeOwnPassword,
  createUser,
  deactivateUser,
  deleteUser,
  getUser,
  listUsers,
  reactivateUser,
  updateOwnProfile,
  updateUser,
} from "../controllers/users.controller.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  changePasswordSchema,
  createUserSchema,
  updateOwnProfileSchema,
  updateUserSchema,
  userIdParamSchema,
} from "../validators/users.validators.js";

export const usersRouter = Router();

usersRouter.use(requireAuth);

// Any authenticated user — edit own profile and change password
usersRouter.patch("/me", validate(updateOwnProfileSchema), updateOwnProfile);
usersRouter.patch("/me/password", validate(changePasswordSchema), changeOwnPassword);

// Admin/Super Admin — manage all users
usersRouter.post("/", requireRoles("admin", "super_admin"), validate(createUserSchema), createUser);
usersRouter.get("/", requireRoles("admin", "super_admin"), listUsers);
usersRouter.get("/:userId", requireRoles("admin", "super_admin"), validate(userIdParamSchema), getUser);
usersRouter.patch("/:userId", requireRoles("admin", "super_admin"), validate(updateUserSchema), updateUser);
usersRouter.patch("/:userId/deactivate", requireRoles("admin", "super_admin"), validate(userIdParamSchema), deactivateUser);
usersRouter.patch("/:userId/reactivate", requireRoles("admin", "super_admin"), validate(userIdParamSchema), reactivateUser);
usersRouter.delete("/:userId", requireRoles("admin", "super_admin"), validate(userIdParamSchema), deleteUser);
