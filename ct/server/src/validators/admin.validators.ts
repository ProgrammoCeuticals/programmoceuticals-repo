import { z } from "zod";

export const noteSchema = z.object({
  params: z.object({ applicationId: z.string().uuid() }),
  body: z.object({ note: z.string().min(1) }),
});
