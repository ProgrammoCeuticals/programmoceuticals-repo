import { and, eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "../db/client.js";
import { notifications } from "../db/schema.js";
import { asyncHandler } from "../utils/http.js";

export const listNotifications = asyncHandler(async (req: Request, res: Response) => {
  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, req.user!.id))
    .orderBy(notifications.createdAt);

  res.json({ notifications: rows });
});

export const markRead = asyncHandler(async (req: Request, res: Response) => {
  const notificationId = req.params.notificationId as string;
  const [notification] = await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, req.user!.id),
      ),
    )
    .returning();

  res.json({ notification });
});

export const markAllRead = asyncHandler(async (req: Request, res: Response) => {
  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(eq(notifications.userId, req.user!.id));

  res.status(204).send();
});
