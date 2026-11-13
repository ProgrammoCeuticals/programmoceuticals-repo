import { z } from "zod";

export const classificationParamSchema = z.object({
  params: z.object({ applicationId: z.string().uuid() }),
});

export const classificationSuggestionSchema = z.object({
  query: z.object({
    productName: z.string().min(2),
  }),
});

export const classificationSchema = z.object({
  params: z.object({ applicationId: z.string().uuid() }),
  body: z.object({
    therapeuticIndexClass: z.enum(["NTI", "Non-NTI", "Mixed", "Unknown"]).optional(),
    bcsClass: z.enum(["Class I", "Class II", "Class III", "Class IV", "Unknown", "Not Applicable"]).optional(),
    pharmacologicalClass: z.string().optional().nullable(),
    localOrForeign: z.string().optional().nullable(),
    productCategory: z.string().optional().nullable(),
    biowaiverRelevance: z.string().optional().nullable(),
    classificationSource: z.string().optional().nullable(),
    classificationNote: z.string().optional().nullable(),
  }),
});
