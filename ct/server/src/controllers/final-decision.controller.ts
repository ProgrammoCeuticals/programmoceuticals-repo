import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "../db/client.js";
import { applications, auditLogs, finalDecisions, notifications } from "../db/schema.js";
import { HttpError, asyncHandler } from "../utils/http.js";

export const getFinalDecision = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;
  const [decision] = await db
    .select()
    .from(finalDecisions)
    .where(eq(finalDecisions.applicationId, applicationId))
    .limit(1);

  res.json({ decision: decision ?? null });
});

export const recordFinalDecision = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;

  const [application] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, applicationId))
    .limit(1);

  if (!application) throw new HttpError(404, "Application not found");

  const decidableStatuses = [
    "awaiting_final_decision",
    "first_assessment_reverted",
    "second_assessment_reverted",
  ];
  if (!decidableStatuses.includes(application.currentStatus)) {
    throw new HttpError(409, "Application is not ready for a final decision");
  }

  const [decision] = await db
    .insert(finalDecisions)
    .values({
      applicationId,
      decision: req.body.decision,
      decisionNote: req.body.decisionNote,
      decidedByUserId: req.user!.id,
    })
    .returning();

  await db
    .update(applications)
    .set({
      currentStatus: "finalized",
      reviewStatus: "Completed",
      finalDecision: req.body.decision,
      finalDecisionDate: new Date().toISOString().split("T")[0],
      finalDecisionNote: req.body.decisionNote,
      finalDecisionBy: req.user!.id,
      finalizedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(applications.id, applicationId));

  await db.insert(notifications).values({
    applicationId,
    userId: application.applicantUserId,
    title: "Final Decision Available",
    message: `A final decision has been recorded for your application ${application.applicationNo}.`,
  });

  await db.insert(auditLogs).values({
    applicationId,
    actorUserId: req.user!.id,
    action: "final_decision_entered",
    entityType: "final_decision",
    entityId: decision.id,
    metadata: { decision: req.body.decision },
  });

  res.status(201).json({ decision });
});

export const reopenApplication = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;

  const [application] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, applicationId))
    .limit(1);

  if (!application) throw new HttpError(404, "Application not found");
  if (application.currentStatus !== "finalized") {
    throw new HttpError(409, "Only finalized applications can be reopened");
  }

  const [updated] = await db
    .update(applications)
    .set({
      currentStatus: "awaiting_final_decision",
      finalDecision: null,
      finalDecisionDate: null,
      finalDecisionNote: null,
      finalDecisionBy: null,
      finalizedAt: null,
      updatedAt: new Date(),
    })
    .where(eq(applications.id, applicationId))
    .returning();

  await db.insert(auditLogs).values({
    applicationId,
    actorUserId: req.user!.id,
    action: "application_reopened",
    entityType: "application",
    entityId: applicationId,
    metadata: { reason: req.body.reason },
  });

  res.json({ application: updated });
});
