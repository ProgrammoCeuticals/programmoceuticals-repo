import { z } from "zod";

export const issueDirectiveSchema = z.object({
  params: z.object({ applicationId: z.string().uuid() }),
  body: z.object({
    title: z.string().min(2),
    directiveMessage: z.string().min(5),
    affectedSections: z.array(z.string()).optional(),
    requiredCorrections: z.string().optional(),
    dueDate: z.string().date().optional(),
  }),
});

export const directiveIdParamSchema = z.object({
  params: z.object({ directiveId: z.string().uuid() }),
});

export const respondToDirectiveSchema = z.object({
  params: z.object({ directiveId: z.string().uuid() }),
  body: z.object({
    responseMessage: z.string().min(5),
    correctedSections: z.array(z.string()).optional(),
  }),
});

export const closeDirectiveSchema = z.object({
  params: z.object({ directiveId: z.string().uuid() }),
});
