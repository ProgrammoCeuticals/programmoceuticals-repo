import { and, desc, eq, ilike, inArray } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "../db/client.js";
import {
  applications,
  assessorAssignments,
  auditLogs,
  internalNotes,
  notifications,
  productClassifications,
  users,
} from "../db/schema.js";
import { HttpError, asyncHandler } from "../utils/http.js";

export const listSubmittedApplications = asyncHandler(async (_req: Request, res: Response) => {
  const rows = await db
    .select()
    .from(applications)
    .where(inArray(applications.currentStatus, ["submitted", "resubmitted_after_compliance_directive"]))
    .orderBy(desc(applications.submittedAt));

  res.json({ applications: rows });
});

export const startScreening = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;
  const [application] = await db
    .update(applications)
    .set({
      currentStatus: "under_admin_screening",
      reviewStatus: "Ongoing",
      updatedAt: new Date(),
    })
    .where(eq(applications.id, applicationId))
    .returning();

  if (!application) throw new HttpError(404, "Application not found");

  await db.insert(auditLogs).values({
    applicationId,
    actorUserId: req.user!.id,
    action: "screening_started",
    entityType: "application",
    entityId: applicationId,
    metadata: {},
  });

  res.json({ application });
});

export const addScreeningNote = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;

  const [note] = await db
    .insert(internalNotes)
    .values({
      applicationId,
      authorUserId: req.user!.id,
      note: req.body.note,
    })
    .returning();

  res.status(201).json({ note });
});

export const markScreeningSatisfactory = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;

  const [application] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, applicationId))
    .limit(1);

  if (!application) throw new HttpError(404, "Application not found");
  if (application.currentStatus !== "under_admin_screening") {
    throw new HttpError(409, "Application is not under screening");
  }

  const [updated] = await db
    .update(applications)
    .set({ currentStatus: "classified", updatedAt: new Date() })
    .where(eq(applications.id, applicationId))
    .returning();

  await db.insert(auditLogs).values({
    applicationId,
    actorUserId: req.user!.id,
    action: "screening_marked_satisfactory",
    entityType: "application",
    entityId: applicationId,
    metadata: {},
  });

  res.json({ application: updated });
});

export const getRegistry = asyncHandler(async (req: Request, res: Response) => {
  const filters: ReturnType<typeof eq>[] = [];

  if (req.query.productName) {
    filters.push(ilike(applications.productName, `%${req.query.productName}%`));
  }
  if (req.query.applicationNo) {
    filters.push(ilike(applications.applicationNo, `%${req.query.applicationNo}%`));
  }
  if (req.query.reviewStatus) {
    filters.push(eq(applications.reviewStatus, req.query.reviewStatus as "Pending" | "Ongoing" | "Completed"));
  }
  if (req.query.finalDecision) {
    filters.push(eq(applications.finalDecision, req.query.finalDecision as "CD" | "Approved" | "Rejected"));
  }

  const rows = await db
    .select()
    .from(applications)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(applications.updatedAt));

  res.json({ applications: rows });
});

export const addInternalNote = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;

  const [note] = await db
    .insert(internalNotes)
    .values({
      applicationId,
      authorUserId: req.user!.id,
      note: req.body.note,
    })
    .returning();

  res.status(201).json({ note });
});

export const listInternalNotes = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;
  const notes = await db
    .select()
    .from(internalNotes)
    .where(eq(internalNotes.applicationId, applicationId))
    .orderBy(internalNotes.createdAt);

  res.json({ notes });
});

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const [total, submitted, finalized, ongoing] = await Promise.all([
    db.select().from(applications),
    db.select().from(applications).where(eq(applications.currentStatus, "submitted")),
    db.select().from(applications).where(eq(applications.currentStatus, "finalized")),
    db.select().from(applications).where(eq(applications.reviewStatus, "Ongoing")),
  ]);

  res.json({
    stats: {
      total: total.length,
      submitted: submitted.length,
      finalized: finalized.length,
      ongoing: ongoing.length,
    },
  });
});

export const listAssessorsForAssignment = asyncHandler(async (_req: Request, res: Response) => {
  const [assessors, assignments] = await Promise.all([
    db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        phone: users.phone,
        role: users.role,
        isActive: users.isActive,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(and(eq(users.role, "assessor"), eq(users.isActive, true)))
      .orderBy(users.fullName),
    db
      .select({
        assessorUserId: assessorAssignments.assessorUserId,
        status: assessorAssignments.status,
      })
      .from(assessorAssignments)
      .where(inArray(assessorAssignments.status, ["assigned", "ongoing", "reassigned"])),
  ]);

  const activeCounts = new Map<string, number>();
  for (const assignment of assignments) {
    activeCounts.set(assignment.assessorUserId, (activeCounts.get(assignment.assessorUserId) ?? 0) + 1);
  }

  res.json({
    assessors: assessors.map((assessor) => ({
      ...assessor,
      activeAssignmentCount: activeCounts.get(assessor.id) ?? 0,
    })),
  });
});
