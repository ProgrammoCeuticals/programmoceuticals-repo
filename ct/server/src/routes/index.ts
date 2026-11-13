import { Router } from "express";
import { adminRouter } from "./admin.routes.js";
import { applicationRouter } from "./application.routes.js";
import { assessorRouter } from "./assessor.routes.js";
import { assignmentsRouter } from "./assignments.routes.js";
import { auditRouter } from "./audit.routes.js";
import { authRouter } from "./auth.routes.js";
import { classificationRouter } from "./classification.routes.js";
import { complianceRouter } from "./compliance.routes.js";
import { exportsRouter } from "./exports.routes.js";
import { finalDecisionRouter } from "./final-decision.routes.js";
import { lookupRouter } from "./lookup.routes.js";
import { notificationsRouter } from "./notifications.routes.js";
import { usersRouter } from "./users.routes.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/applications", applicationRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/lookups", lookupRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/notifications", notificationsRouter);

// Routers that mount their own full paths (e.g. /admin/..., /applications/..., /assessor/...)
apiRouter.use(complianceRouter);
apiRouter.use(classificationRouter);
apiRouter.use(assignmentsRouter);
apiRouter.use(assessorRouter);
apiRouter.use(finalDecisionRouter);
apiRouter.use(auditRouter);
apiRouter.use(exportsRouter);
