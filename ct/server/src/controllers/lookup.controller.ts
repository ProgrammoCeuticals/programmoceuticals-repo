import { and, eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "../db/client.js";
import { lookupItems } from "../db/schema.js";
import { asyncHandler } from "../utils/http.js";

export const listLookups = asyncHandler(async (req: Request, res: Response) => {
  const filters = [];
  const type = req.query.type ? String(req.query.type) : undefined;
  const activeOnly = String(req.query.activeOnly) === "true";

  if (type) {
    filters.push(eq(lookupItems.type, type));
  }

  if (activeOnly) {
    filters.push(eq(lookupItems.isActive, true));
  }

  const rows = await db
    .select()
    .from(lookupItems)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(lookupItems.type, lookupItems.label);

  res.json({ lookupItems: rows });
});

export const createLookup = asyncHandler(async (req: Request, res: Response) => {
  const [lookup] = await db
    .insert(lookupItems)
    .values({
      type: req.body.type,
      label: req.body.label,
      value: req.body.value ?? req.body.label,
      description: req.body.description,
      metadata: req.body.metadata ?? {},
      createdByUserId: req.user!.id,
    })
    .returning();

  res.status(201).json({ lookup });
});

export const updateLookup = asyncHandler(async (req: Request, res: Response) => {
  const lookupId = req.params.lookupId as string;
  const [lookup] = await db
    .update(lookupItems)
    .set({ ...req.body, updatedAt: new Date() })
    .where(eq(lookupItems.id, lookupId))
    .returning();

  res.json({ lookup });
});

export const deactivateLookup = asyncHandler(async (req: Request, res: Response) => {
  const lookupId = req.params.lookupId as string;
  const [lookup] = await db
    .update(lookupItems)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(lookupItems.id, lookupId))
    .returning();

  res.json({ lookup });
});

export const importLookups = asyncHandler(async (req: Request, res: Response) => {
  const items: Array<{ type: string; label: string; value?: string; description?: string; metadata?: Record<string, unknown> }> =
    req.body.items;

  const inserted = await db
    .insert(lookupItems)
    .values(
      items.map((item) => ({
        type: item.type,
        label: item.label,
        value: item.value ?? item.label,
        description: item.description,
        metadata: item.metadata ?? {},
        createdByUserId: req.user!.id,
      })),
    )
    .onConflictDoNothing()
    .returning();

  res.status(201).json({ imported: inserted.length, items: inserted });
});
