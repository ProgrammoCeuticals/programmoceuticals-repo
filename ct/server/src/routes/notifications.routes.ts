import { Router } from "express";
import { listNotifications, markAllRead, markRead } from "../controllers/notifications.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { notificationIdParamSchema } from "../validators/notifications.validators.js";

export const notificationsRouter = Router();

notificationsRouter.use(requireAuth);

notificationsRouter.get("/", listNotifications);
notificationsRouter.patch("/:notificationId/read", validate(notificationIdParamSchema), markRead);
notificationsRouter.patch("/read-all", markAllRead);
