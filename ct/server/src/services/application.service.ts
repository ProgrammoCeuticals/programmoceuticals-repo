import { and, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import {
  applicantProfiles,
  applications,
  beChecklists,
  beStudyPeriods,
  beSummaryResults,
  sectionBDocumentReferences,
} from "../db/schema.js";
import { DEFAULT_STUDY_PERIODS, DEFAULT_SUMMARY_RESULTS, SECTION_B_DOCUMENTS } from "../constants/checklist.js";
import { makeApplicationNumber } from "../utils/application-number.js";
import { HttpError } from "../utils/http.js";

export const createDraftApplication = async (
  applicantUserId: string,
  input: {
    productName: string;
    strength?: string;
    dosageForm?: string;
    strengthAndDosageForm?: string;
  },
) => {
  const [profile] = await db
    .select()
    .from(applicantProfiles)
    .where(eq(applicantProfiles.userId, applicantUserId))
    .limit(1);

  if (!profile) {
    throw new HttpError(400, "Applicant profile is required before creating an application");
  }

  return db.transaction(async (tx) => {
    const [application] = await tx
      .insert(applications)
      .values({
        applicantUserId,
        applicantProfileId: profile.id,
        applicationNo: makeApplicationNumber(),
        productName: input.productName,
        strength: input.strength,
        dosageForm: input.dosageForm,
        strengthAndDosageForm:
          input.strengthAndDosageForm ?? [input.strength, input.dosageForm].filter(Boolean).join(" "),
      })
      .returning();

    const [checklist] = await tx
      .insert(beChecklists)
      .values({
        applicationId: application.id,
      })
      .returning();

    await tx.insert(beStudyPeriods).values(
      DEFAULT_STUDY_PERIODS.map((periodLabel, index) => ({
        checklistId: checklist.id,
        applicationId: application.id,
        periodLabel,
        sortOrder: index + 1,
      })),
    );

    await tx.insert(beSummaryResults).values(
      DEFAULT_SUMMARY_RESULTS.map((parameter, index) => ({
        checklistId: checklist.id,
        applicationId: application.id,
        parameter,
        sortOrder: index + 1,
      })),
    );

    await tx.insert(sectionBDocumentReferences).values(
      SECTION_B_DOCUMENTS.map((document, index) => ({
        checklistId: checklist.id,
        applicationId: application.id,
        itemNumber: document.itemNumber,
        documentTitle: document.documentTitle,
        sortOrder: index + 1,
      })),
    );

    return application;
  });
};

export const assertApplicantOwnsApplication = async (applicationId: string, applicantUserId: string) => {
  const [application] = await db
    .select()
    .from(applications)
    .where(and(eq(applications.id, applicationId), eq(applications.applicantUserId, applicantUserId)))
    .limit(1);

  if (!application) {
    throw new HttpError(404, "Application not found");
  }

  return application;
};
