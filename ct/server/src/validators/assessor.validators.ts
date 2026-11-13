import { z } from "zod";

export const assignmentIdParamSchema = z.object({
  params: z.object({ assignmentId: z.string().uuid() }),
});

export const reportIdParamSchema = z.object({
  params: z.object({ reportId: z.string().uuid() }),
});

export const submitCommentSchema = z.object({
  params: z.object({ assignmentId: z.string().uuid() }),
  body: z.object({
    recommendation: z.enum([
      "recommend_approval",
      "recommend_compliance_directive",
      "recommend_rejection",
      "requires_second_assessment",
      "requires_admin_action",
      "assessment_completed",
    ]),
    comment: z.string().min(5),
  }),
});

export const submitAssessmentSchema = z.object({
  params: z.object({ assignmentId: z.string().uuid() }),
  body: z.object({
    action: z.enum(["submit", "revert"]),
  }),
});
