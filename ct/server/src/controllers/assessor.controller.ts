import { and, eq } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";
import type { Request, Response } from "express";
import { db } from "../db/client.js";
import { env } from "../config/env.js";
import {
  applications,
  assessorAssignments,
  assessorComments,
  assessorReports,
  auditLogs,
  notifications,
  users,
} from "../db/schema.js";
import { HttpError, asyncHandler } from "../utils/http.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const getMyAssignments = asyncHandler(async (req: Request, res: Response) => {
  const assignments = await db
    .select()
    .from(assessorAssignments)
    .where(eq(assessorAssignments.assessorUserId, req.user!.id))
    .orderBy(assessorAssignments.assignedAt);

  res.json({ assignments });
});

export const startAssignment = asyncHandler(async (req: Request, res: Response) => {
  const assignmentId = req.params.assignmentId as string;
  const [assignment] = await db
    .select()
    .from(assessorAssignments)
    .where(
      and(
        eq(assessorAssignments.id, assignmentId),
        eq(assessorAssignments.assessorUserId, req.user!.id),
      ),
    )
    .limit(1);

  if (!assignment) throw new HttpError(404, "Assignment not found");
  if (assignment.status !== "assigned") throw new HttpError(409, "Assignment is not in assigned state");

  const [updated] = await db
    .update(assessorAssignments)
    .set({ status: "ongoing", startedAt: new Date(), updatedAt: new Date() })
    .where(eq(assessorAssignments.id, assignment.id))
    .returning();

  const nextStatus =
    assignment.assessmentStage === "first_assessment"
      ? "first_assessment_ongoing"
      : "second_assessment_ongoing";

  await db
    .update(applications)
    .set({ currentStatus: nextStatus, reviewStatus: "Ongoing", updatedAt: new Date() })
    .where(eq(applications.id, assignment.applicationId));

  await db.insert(auditLogs).values({
    applicationId: assignment.applicationId,
    actorUserId: req.user!.id,
    action: "assessor_started_review",
    entityType: "assessor_assignment",
    entityId: assignment.id,
    metadata: {},
  });

  res.json({ assignment: updated });
});

export const uploadReport = asyncHandler(async (req: Request, res: Response) => {
  const assignmentId = req.params.assignmentId as string;
  const [assignment] = await db
    .select()
    .from(assessorAssignments)
    .where(
      and(
        eq(assessorAssignments.id, assignmentId),
        eq(assessorAssignments.assessorUserId, req.user!.id),
      ),
    )
    .limit(1);

  if (!assignment) throw new HttpError(404, "Assignment not found");
  if (!["assigned", "ongoing"].includes(assignment.status)) {
    throw new HttpError(409, "Cannot upload report for this assignment");
  }

  if (!req.cloudinaryResult) throw new HttpError(400, "No file uploaded");

  const [report] = await db
    .insert(assessorReports)
    .values({
      applicationId: assignment.applicationId,
      assessorAssignmentId: assignment.id,
      assessorUserId: req.user!.id,
      assessmentStage: assignment.assessmentStage,
      reportTitle: req.body.reportTitle ?? req.cloudinaryResult.fileName,
      fileName: req.cloudinaryResult.fileName,
      fileUrl: req.cloudinaryResult.fileUrl,
      cloudinaryPublicId: req.cloudinaryResult.cloudinaryPublicId,
      fileMimeType: req.cloudinaryResult.fileMimeType,
      fileSize: req.cloudinaryResult.fileSize,
    })
    .returning();

  await db.insert(auditLogs).values({
    applicationId: assignment.applicationId,
    actorUserId: req.user!.id,
    action: "assessor_report_uploaded",
    entityType: "assessor_report",
    entityId: report.id,
    metadata: {},
  });

  res.status(201).json({ report });
});

export const deleteReport = asyncHandler(async (req: Request, res: Response) => {
  const reportId = req.params.reportId as string;
  const [report] = await db
    .select()
    .from(assessorReports)
    .where(
      and(
        eq(assessorReports.id, reportId),
        eq(assessorReports.assessorUserId, req.user!.id),
      ),
    )
    .limit(1);

  if (!report) throw new HttpError(404, "Report not found");

  const [assignment] = await db
    .select({ status: assessorAssignments.status })
    .from(assessorAssignments)
    .where(eq(assessorAssignments.id, report.assessorAssignmentId))
    .limit(1);

  if (!assignment || !["assigned", "ongoing"].includes(assignment.status)) {
    throw new HttpError(409, "Report is locked and cannot be deleted");
  }

  await db.delete(assessorReports).where(eq(assessorReports.id, report.id));

  // Delete from Cloudinary storage
  if (report.cloudinaryPublicId) {
    await cloudinary.uploader.destroy(report.cloudinaryPublicId, { resource_type: "raw" }).catch(() => {
      // Log but don't fail the request if Cloudinary delete fails
      console.warn(`Failed to delete Cloudinary asset: ${report.cloudinaryPublicId}`);
    });
  }

  res.status(204).send();
});

export const submitComment = asyncHandler(async (req: Request, res: Response) => {
  const assignmentId = req.params.assignmentId as string;
  const [assignment] = await db
    .select()
    .from(assessorAssignments)
    .where(
      and(
        eq(assessorAssignments.id, assignmentId),
        eq(assessorAssignments.assessorUserId, req.user!.id),
      ),
    )
    .limit(1);

  if (!assignment) throw new HttpError(404, "Assignment not found");

  const [comment] = await db
    .insert(assessorComments)
    .values({
      applicationId: assignment.applicationId,
      assessorAssignmentId: assignment.id,
      assessorUserId: req.user!.id,
      assessmentStage: assignment.assessmentStage,
      recommendation: req.body.recommendation,
      comment: req.body.comment,
    })
    .returning();

  res.status(201).json({ comment });
});

export const submitAssessment = asyncHandler(async (req: Request, res: Response) => {
  const assignmentId = req.params.assignmentId as string;
  const [assignment] = await db
    .select()
    .from(assessorAssignments)
    .where(
      and(
        eq(assessorAssignments.id, assignmentId),
        eq(assessorAssignments.assessorUserId, req.user!.id),
      ),
    )
    .limit(1);

  if (!assignment) throw new HttpError(404, "Assignment not found");
  if (assignment.status !== "ongoing") throw new HttpError(409, "Assessment is not ongoing");

  const [report] = await db
    .select({ id: assessorReports.id })
    .from(assessorReports)
    .where(eq(assessorReports.assessorAssignmentId, assignment.id))
    .limit(1);

  if (!report) throw new HttpError(400, "You must upload a Word report before submitting");

  const [comment] = await db
    .select({ id: assessorComments.id })
    .from(assessorComments)
    .where(eq(assessorComments.assessorAssignmentId, assignment.id))
    .limit(1);

  if (!comment) throw new HttpError(400, "You must submit a typed comment before submitting");

  const action = req.body.action as "submit" | "revert";
  if (!["submit", "revert"].includes(action)) throw new HttpError(400, "Invalid action");

  const isRevert = action === "revert";

  const [updated] = await db
    .update(assessorAssignments)
    .set({
      status: isRevert ? "reverted" : "completed",
      revertedAt: isRevert ? new Date() : undefined,
      completedAt: isRevert ? undefined : new Date(),
      updatedAt: new Date(),
    })
    .where(eq(assessorAssignments.id, assignment.id))
    .returning();

  const nextAppStatus =
    assignment.assessmentStage === "first_assessment"
      ? isRevert
        ? "first_assessment_reverted"
        : "awaiting_final_decision"
      : isRevert
        ? "second_assessment_reverted"
        : "awaiting_final_decision";

  const [application] = await db
    .update(applications)
    .set({ currentStatus: nextAppStatus, updatedAt: new Date() })
    .where(eq(applications.id, assignment.applicationId))
    .returning();

  const admins = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.role, "admin"));

  if (admins.length > 0) {
    await db.insert(notifications).values(
      admins.map((a) => ({
        applicationId: assignment.applicationId,
        userId: a.id,
        title: isRevert ? "Assessment Reverted" : "Assessment Submitted",
        message: `Assessor has ${isRevert ? "reverted" : "submitted"} assessment for application ${application.applicationNo}.`,
      })),
    );
  }

  await db.insert(auditLogs).values({
    applicationId: assignment.applicationId,
    actorUserId: req.user!.id,
    action: isRevert ? "assessment_reverted" : "assessment_submitted",
    entityType: "assessor_assignment",
    entityId: assignment.id,
    metadata: {},
  });

  res.json({ assignment: updated });
});

export const getApplicationReports = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;
  const reports = await db
    .select()
    .from(assessorReports)
    .where(eq(assessorReports.applicationId, applicationId))
    .orderBy(assessorReports.uploadedAt);

  res.json({ reports });
});

export const getApplicationComments = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;
  const comments = await db
    .select()
    .from(assessorComments)
    .where(eq(assessorComments.applicationId, applicationId))
    .orderBy(assessorComments.submittedAt);

  res.json({ comments });
});

export const getReport = asyncHandler(async (req: Request, res: Response) => {
  const reportId = req.params.reportId as string;
  const [report] = await db
    .select()
    .from(assessorReports)
    .where(eq(assessorReports.id, reportId))
    .limit(1);

  if (!report) throw new HttpError(404, "Report not found");
  res.json({ report });
});
