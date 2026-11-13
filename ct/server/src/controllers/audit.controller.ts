import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "../db/client.js";
import { auditLogs } from "../db/schema.js";
import { asyncHandler } from "../utils/http.js";

export const listAuditLogs = asyncHandler(async (_req: Request, res: Response) => {
  const logs = await db.select().from(auditLogs).orderBy(auditLogs.createdAt);
  res.json({ auditLogs: logs });
});

export const getApplicationTimeline = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;
  const logs = await db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.applicationId, applicationId))
    .orderBy(auditLogs.createdAt);

  res.json({ timeline: logs });
});
