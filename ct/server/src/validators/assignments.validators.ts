import { z } from "zod";

export const listAssignmentsSchema = z.object({
  params: z.object({ applicationId: z.string().uuid() }),
});

export const assignmentIdParamSchema = z.object({
  params: z.object({ assignmentId: z.string().uuid() }),
});

export const assignAssessorSchema = z.object({
  params: z.object({ applicationId: z.string().uuid() }),
  body: z.object({
    assessorUserId: z.string().uuid(),
    dueDate: z.string().date().optional(),
    assignmentNote: z.string().optional(),
    reasonForSecondAssessment: z.string().optional(),
  }),
});

export const reassignSchema = z.object({
  params: z.object({ assignmentId: z.string().uuid() }),
  body: z.object({
    assessorUserId: z.string().uuid(),
    assignmentNote: z.string().optional(),
  }),
});
