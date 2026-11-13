import { and, eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "../db/client.js";
import {
  applications,
  beChecklists,
  beStudyPeriods,
  beSummaryResults,
  sectionBDocumentReferences,
} from "../db/schema.js";
import { assertApplicantOwnsApplication, createDraftApplication } from "../services/application.service.js";
import { HttpError, asyncHandler } from "../utils/http.js";

export const createApplication = asyncHandler(async (req: Request, res: Response) => {
  const application = await createDraftApplication(req.user!.id, req.body);
  res.status(201).json({ application });
});

export const getMyApplications = asyncHandler(async (req: Request, res: Response) => {
  const rows = await db
    .select()
    .from(applications)
    .where(eq(applications.applicantUserId, req.user!.id))
    .orderBy(applications.createdAt);

  res.json({ applications: rows });
});

export const getApplication = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;
  const [application] = await db
    .select()
    .from(applications)
    .where(eq(applications.id, applicationId))
    .limit(1);

  if (!application) {
    throw new HttpError(404, "Application not found");
  }

  if (req.user!.role === "applicant" && application.applicantUserId !== req.user!.id) {
    throw new HttpError(403, "You cannot view this application");
  }

  res.json({ application });
});

export const updateApplication = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;
  const application = await assertApplicantOwnsApplication(applicationId, req.user!.id);

  if (application.currentStatus !== "draft" && application.currentStatus !== "compliance_directive_issued") {
    throw new HttpError(409, "Only draft applications or applications under compliance correction can be edited");
  }

  const [updated] = await db
    .update(applications)
    .set({ ...req.body, updatedAt: new Date() })
    .where(eq(applications.id, applicationId))
    .returning();

  res.json({ application: updated });
});

export const submitApplication = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;
  const application = await assertApplicantOwnsApplication(applicationId, req.user!.id);

  if (application.currentStatus !== "draft" && application.currentStatus !== "compliance_directive_issued") {
    throw new HttpError(409, "This application cannot be submitted from its current status");
  }

  const nextStatus =
    application.currentStatus === "compliance_directive_issued"
      ? "resubmitted_after_compliance_directive"
      : "submitted";

  const [updated] = await db
    .update(applications)
    .set({
      currentStatus: nextStatus,
      reviewStatus: "Pending",
      submittedAt: application.submittedAt ?? new Date(),
      resubmittedAt: nextStatus === "resubmitted_after_compliance_directive" ? new Date() : application.resubmittedAt,
      updatedAt: new Date(),
    })
    .where(eq(applications.id, applicationId))
    .returning();

  res.json({ application: updated });
});

export const getChecklist = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;
  const [checklist] = await db
    .select()
    .from(beChecklists)
    .where(eq(beChecklists.applicationId, applicationId))
    .limit(1);

  if (!checklist) {
    throw new HttpError(404, "Checklist not found");
  }

  const [studyPeriods, summaryResults, documentReferences] = await Promise.all([
    db.select().from(beStudyPeriods).where(eq(beStudyPeriods.applicationId, applicationId)),
    db.select().from(beSummaryResults).where(eq(beSummaryResults.applicationId, applicationId)),
    db.select().from(sectionBDocumentReferences).where(eq(sectionBDocumentReferences.applicationId, applicationId)),
  ]);

  res.json({ checklist, studyPeriods, summaryResults, documentReferences });
});

export const patchChecklist = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;
  await assertApplicantOwnsApplication(applicationId, req.user!.id);

  const [checklist] = await db
    .update(beChecklists)
    .set({ ...req.body, updatedAt: new Date() })
    .where(eq(beChecklists.applicationId, applicationId))
    .returning();

  res.json({ checklist });
});

export const getStudyPeriods = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;
  const studyPeriods = await db
    .select()
    .from(beStudyPeriods)
    .where(eq(beStudyPeriods.applicationId, applicationId))
    .orderBy(beStudyPeriods.sortOrder);

  res.json({ studyPeriods });
});

export const putStudyPeriods = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;
  await assertApplicantOwnsApplication(applicationId, req.user!.id);

  await db.transaction(async (tx) => {
    for (const period of req.body.studyPeriods) {
      if (period.id) {
        await tx
          .update(beStudyPeriods)
          .set({
            periodLabel: period.periodLabel,
            startDate: period.startDate,
            endDate: period.endDate,
            sortOrder: period.sortOrder,
            updatedAt: new Date(),
          })
          .where(and(eq(beStudyPeriods.id, period.id), eq(beStudyPeriods.applicationId, applicationId)));
      } else {
        const [checklist] = await tx
          .select({ id: beChecklists.id })
          .from(beChecklists)
          .where(eq(beChecklists.applicationId, applicationId))
          .limit(1);
        await tx.insert(beStudyPeriods).values({
          checklistId: checklist.id,
          applicationId,
          periodLabel: period.periodLabel,
          startDate: period.startDate,
          endDate: period.endDate,
          sortOrder: period.sortOrder,
        });
      }
    }
  });

  const studyPeriods = await db
    .select()
    .from(beStudyPeriods)
    .where(eq(beStudyPeriods.applicationId, applicationId))
    .orderBy(beStudyPeriods.sortOrder);

  res.json({ studyPeriods });
});

export const getSummaryResults = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;
  const summaryResults = await db
    .select()
    .from(beSummaryResults)
    .where(eq(beSummaryResults.applicationId, applicationId))
    .orderBy(beSummaryResults.sortOrder);

  res.json({ summaryResults });
});

export const putSummaryResults = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;
  await assertApplicantOwnsApplication(applicationId, req.user!.id);

  await db.transaction(async (tx) => {
    for (const result of req.body.summaryResults) {
      if (result.id) {
        await tx
          .update(beSummaryResults)
          .set({ ...result, updatedAt: new Date() })
          .where(and(eq(beSummaryResults.id, result.id), eq(beSummaryResults.applicationId, applicationId)));
      }
    }
  });

  const summaryResults = await db
    .select()
    .from(beSummaryResults)
    .where(eq(beSummaryResults.applicationId, applicationId))
    .orderBy(beSummaryResults.sortOrder);

  res.json({ summaryResults });
});

export const getDocumentReferences = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;
  const documentReferences = await db
    .select()
    .from(sectionBDocumentReferences)
    .where(eq(sectionBDocumentReferences.applicationId, applicationId));

  res.json({ documentReferences });
});

export const putDocumentReferences = asyncHandler(async (req: Request, res: Response) => {
  const applicationId = req.params.applicationId as string;
  await assertApplicantOwnsApplication(applicationId, req.user!.id);

  await db.transaction(async (tx) => {
    for (const reference of req.body.documentReferences) {
      await tx
        .update(sectionBDocumentReferences)
        .set({
          nameOfDocumentAndLocation: reference.nameOfDocumentAndLocation,
          isApplicable: reference.isApplicable,
          applicantRemark: reference.applicantRemark,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(sectionBDocumentReferences.id, reference.id),
            eq(sectionBDocumentReferences.applicationId, applicationId),
          ),
        );
    }
  });

  const documentReferences = await db
    .select()
    .from(sectionBDocumentReferences)
    .where(eq(sectionBDocumentReferences.applicationId, applicationId));

  res.json({ documentReferences });
});
