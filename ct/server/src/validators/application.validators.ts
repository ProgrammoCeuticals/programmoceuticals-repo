import { z } from "zod";

export const createApplicationSchema = z.object({
  body: z.object({
    productName: z.string().min(2),
    strength: z.string().optional(),
    dosageForm: z.string().optional(),
    strengthAndDosageForm: z.string().optional(),
  }),
});

export const updateApplicationSchema = z.object({
  params: z.object({
    applicationId: z.string().uuid(),
  }),
  body: z.object({
    productName: z.string().min(2).optional(),
    strength: z.string().optional(),
    dosageForm: z.string().optional(),
    strengthAndDosageForm: z.string().optional(),
  }),
});

export const applicationIdParamSchema = z.object({
  params: z.object({
    applicationId: z.string().uuid(),
  }),
});

export const patchChecklistSchema = z.object({
  params: z.object({
    applicationId: z.string().uuid(),
  }),
  body: z.record(z.unknown()),
});

export const putStudyPeriodsSchema = z.object({
  params: z.object({
    applicationId: z.string().uuid(),
  }),
  body: z.object({
    studyPeriods: z.array(
      z.object({
        id: z.string().uuid().optional(),
        periodLabel: z.string().min(1),
        startDate: z.string().date().optional().nullable(),
        endDate: z.string().date().optional().nullable(),
        sortOrder: z.number().int().nonnegative(),
      }),
    ),
  }),
});

export const putSummaryResultsSchema = z.object({
  params: z.object({
    applicationId: z.string().uuid(),
  }),
  body: z.object({
    summaryResults: z.array(z.record(z.unknown())),
  }),
});

export const putDocumentReferencesSchema = z.object({
  params: z.object({
    applicationId: z.string().uuid(),
  }),
  body: z.object({
    documentReferences: z.array(
      z.object({
        id: z.string().uuid(),
        nameOfDocumentAndLocation: z.string().optional().nullable(),
        isApplicable: z.boolean().optional(),
        applicantRemark: z.string().optional().nullable(),
      }),
    ),
  }),
});
