import { and, eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "../db/client.js";
import {
  applications,
  auditLogs,
  complianceDirectiveResponses,
  complianceDirectives,
  notifications,
} from "../db/schema.js";
import { HttpError, asyncHandler } from "../utils/http.js";

const makeDirectiveNumber = () =>
  `CD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

export const issueComplianceDirective = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;

  const [application] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, applicationId))
    .limit(1);

  if (!application) throw new HttpError(404, "Application not found");

  const screeningStatuses = [
    "under_admin_screening",
    "resubmitted_after_compliance_directive",
    "first_assessment_ongoing",
    "first_assessment_reverted",
    "second_assessment_ongoing",
    "second_assessment_reverted",
    "awaiting_final_decision",
  ];
  if (!screeningStatuses.includes(application.currentStatus)) {
    throw new HttpError(409, "Compliance directive can only be issued during screening or assessment");
  }

  const [directive] = await db
    .insert(complianceDirectives)
    .values({
      applicationId,
      directiveNumber: makeDirectiveNumber(),
      title: req.body.title,
      issuedByUserId: req.user!.id,
      issuedToUserId: application.applicantUserId,
      affectedSections: req.body.affectedSections ?? [],
      directiveMessage: req.body.directiveMessage,
      requiredCorrections: req.body.requiredCorrections,
      dueDate: req.body.dueDate,
    })
    .returning();

  await db
    .update(applications)
    .set({ currentStatus: "compliance_directive_issued", updatedAt: new Date() })
    .where(eq(applications.id, applicationId));

  await db.insert(notifications).values({
    applicationId,
    userId: application.applicantUserId,
    title: "Compliance Directive Issued",
    message: `A compliance directive has been issued for your application ${application.applicationNo}.`,
  });

  await db.insert(auditLogs).values({
    applicationId,
    actorUserId: req.user!.id,
    action: "compliance_directive_issued",
    entityType: "compliance_directive",
    entityId: directive.id,
    metadata: { directiveNumber: directive.directiveNumber },
  });

  res.status(201).json({ directive });
});

export const listComplianceDirectives = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;

  const directives = await db
    .select()
    .from(complianceDirectives)
    .where(eq(complianceDirectives.applicationId, applicationId))
    .orderBy(complianceDirectives.issuedAt);

  res.json({ directives });
});

export const getComplianceDirective = asyncHandler(async (req: Request, res: Response) => {
  const directiveId = req.params.directiveId as string;
  const [directive] = await db
    .select()
    .from(complianceDirectives)
    .where(eq(complianceDirectives.id, directiveId))
    .limit(1);

  if (!directive) throw new HttpError(404, "Directive not found");

  res.json({ directive });
});

export const respondToDirective = asyncHandler(async (req: Request, res: Response) => {
  const directiveId = req.params.directiveId as string;
  const [directive] = await db
    .select()
    .from(complianceDirectives)
    .where(eq(complianceDirectives.id, directiveId))
    .limit(1);

  if (!directive) throw new HttpError(404, "Directive not found");
  if (directive.status !== "open") throw new HttpError(409, "This directive is no longer open");

  const [response] = await db
    .insert(complianceDirectiveResponses)
    .values({
      complianceDirectiveId: directive.id,
      applicationId: directive.applicationId,
      applicantUserId: req.user!.id,
      responseMessage: req.body.responseMessage,
      correctedSections: req.body.correctedSections ?? [],
    })
    .returning();

  await db
    .update(complianceDirectives)
    .set({ status: "responded", updatedAt: new Date() })
    .where(eq(complianceDirectives.id, directive.id));

  await db.insert(auditLogs).values({
    applicationId: directive.applicationId,
    actorUserId: req.user!.id,
    action: "applicant_responded_to_directive",
    entityType: "compliance_directive_response",
    entityId: response.id,
    metadata: {},
  });

  res.status(201).json({ response });
});

export const closeDirective = asyncHandler(async (req: Request, res: Response) => {
  const directiveId = req.params.directiveId as string;
  const [directive] = await db
    .update(complianceDirectives)
    .set({ status: "closed", closedAt: new Date(), updatedAt: new Date() })
    .where(eq(complianceDirectives.id, directiveId))
    .returning();

  if (!directive) throw new HttpError(404, "Directive not found");

  await db.insert(auditLogs).values({
    applicationId: directive.applicationId,
    actorUserId: req.user!.id,
    action: "compliance_directive_closed",
    entityType: "compliance_directive",
    entityId: directive.id,
    metadata: {},
  });

  res.json({ directive });
});
