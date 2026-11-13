import { z } from "zod";

export const notificationIdParamSchema = z.object({
  params: z.object({ notificationId: z.string().uuid() }),
});
