import { and, eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "../db/client.js";
import {
  applications,
  assessorAssignments,
  auditLogs,
  complianceDirectives,
  notifications,
  users,
} from "../db/schema.js";
import { HttpError, asyncHandler } from "../utils/http.js";

const assertNoOpenDirective = async (applicationId: string) => {
  const open = await db
    .select({ id: complianceDirectives.id })
    .from(complianceDirectives)
    .where(
      and(
        eq(complianceDirectives.applicationId, applicationId),
        eq(complianceDirectives.status, "open"),
      ),
    )
    .limit(1);
  if (open.length > 0) {
    throw new HttpError(409, "Cannot assign assessor while an open compliance directive exists");
  }
};

export const assignFirstAssessor = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;

  const [application] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, applicationId))
    .limit(1);

  if (!application) throw new HttpError(404, "Application not found");
  if (application.currentStatus !== "classified") {
    throw new HttpError(409, "Application must be classified before assigning first assessor");
  }

  await assertNoOpenDirective(applicationId);

  const [assessor] = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.id, req.body.assessorUserId as string))
    .limit(1);

  if (!assessor || assessor.role !== "assessor") {
    throw new HttpError(400, "Invalid assessor user");
  }

  const [assignment] = await db
    .insert(assessorAssignments)
    .values({
      applicationId,
      assessorUserId: req.body.assessorUserId,
      assessmentStage: "first_assessment",
      assignedByUserId: req.user!.id,
      dueDate: req.body.dueDate,
      assignmentNote: req.body.assignmentNote,
    })
    .returning();

  await db
    .update(applications)
    .set({ currentStatus: "assigned_first_assessor", updatedAt: new Date() })
    .where(eq(applications.id, applicationId));

  await db.insert(notifications).values({
    applicationId,
    userId: req.body.assessorUserId,
    title: "Application Assigned",
    message: `You have been assigned as first assessor for application ${application.applicationNo}.`,
  });

  await db.insert(auditLogs).values({
    applicationId,
    actorUserId: req.user!.id,
    action: "first_assessor_assigned",
    entityType: "assessor_assignment",
    entityId: assignment.id,
    metadata: { assessorUserId: req.body.assessorUserId },
  });

  res.status(201).json({ assignment });
});

export const assignSecondAssessor = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;

  const [application] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, applicationId))
    .limit(1);

  if (!application) throw new HttpError(404, "Application not found");
  if (application.currentStatus !== "first_assessment_reverted") {
    throw new HttpError(409, "Second assessor can only be assigned after first assessment is reverted");
  }

  await assertNoOpenDirective(applicationId);

  const [assessor] = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.id, req.body.assessorUserId as string))
    .limit(1);

  if (!assessor || assessor.role !== "assessor") {
    throw new HttpError(400, "Invalid assessor user");
  }

  const [assignment] = await db
    .insert(assessorAssignments)
    .values({
      applicationId,
      assessorUserId: req.body.assessorUserId,
      assessmentStage: "second_assessment",
      assignedByUserId: req.user!.id,
      dueDate: req.body.dueDate,
      assignmentNote: req.body.assignmentNote,
      reasonForSecondAssessment: req.body.reasonForSecondAssessment,
    })
    .returning();

  await db
    .update(applications)
    .set({ currentStatus: "assigned_second_assessor", updatedAt: new Date() })
    .where(eq(applications.id, applicationId));

  await db.insert(notifications).values({
    applicationId,
    userId: req.body.assessorUserId,
    title: "Application Assigned",
    message: `You have been assigned as second assessor for application ${application.applicationNo}.`,
  });

  await db.insert(auditLogs).values({
    applicationId,
    actorUserId: req.user!.id,
    action: "second_assessor_assigned",
    entityType: "assessor_assignment",
    entityId: assignment.id,
    metadata: { assessorUserId: req.body.assessorUserId },
  });

  res.status(201).json({ assignment });
});

export const listAssignments = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;
  const assignments = await db
    .select()
    .from(assessorAssignments)
    .where(eq(assessorAssignments.applicationId, applicationId))
    .orderBy(assessorAssignments.assignedAt);

  res.json({ assignments });
});

export const reassignAssignment = asyncHandler(async (req: Request, res: Response) => {
  const assignmentId = req.params.assignmentId as string;
  const [assignment] = await db
    .update(assessorAssignments)
    .set({
      assessorUserId: req.body.assessorUserId,
      status: "reassigned",
      assignmentNote: req.body.assignmentNote,
      updatedAt: new Date(),
    })
    .where(eq(assessorAssignments.id, assignmentId))
    .returning();

  if (!assignment) throw new HttpError(404, "Assignment not found");

  await db.insert(auditLogs).values({
    applicationId: assignment.applicationId,
    actorUserId: req.user!.id,
    action: "assignment_reassigned",
    entityType: "assessor_assignment",
    entityId: assignment.id,
    metadata: { newAssessorUserId: req.body.assessorUserId },
  });

  res.json({ assignment });
});

export const cancelAssignment = asyncHandler(async (req: Request, res: Response) => {
  const assignmentId = req.params.assignmentId as string;
  const [assignment] = await db
    .update(assessorAssignments)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(assessorAssignments.id, assignmentId))
    .returning();

  if (!assignment) throw new HttpError(404, "Assignment not found");

  await db.insert(auditLogs).values({
    applicationId: assignment.applicationId,
    actorUserId: req.user!.id,
    action: "assignment_cancelled",
    entityType: "assessor_assignment",
    entityId: assignment.id,
    metadata: {},
  });

  res.json({ assignment });
});
