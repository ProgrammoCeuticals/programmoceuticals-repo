import { z } from "zod";

export const finalDecisionSchema = z.object({
  params: z.object({ applicationId: z.string().uuid() }),
  body: z.object({
    decision: z.enum(["CD", "Approved", "Rejected"]),
    decisionNote: z.string().optional(),
  }),
});

export const reopenSchema = z.object({
  params: z.object({ applicationId: z.string().uuid() }),
  body: z.object({
    reason: z.string().min(5),
  }),
});
