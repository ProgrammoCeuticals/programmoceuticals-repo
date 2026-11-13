import { Response } from 'express';
import { eq, desc, lte, and, inArray, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../config/database';
import { followUps } from '../models/schema';
import { success, error } from '../utils/response.util';
import { audit } from '../utils/audit.util';
import { AuthRequest } from '../middleware/auth.middleware';

const createSchema = z.object({
  reason: z.string().min(1),
  dueAt: z.string().min(1),
  relatedEncounterId: z.string().uuid().optional().nullable(),
  assignedUserId: z.string().uuid().optional().nullable(),
});

const updateSchema = z.object({
  status: z.enum(['scheduled', 'due', 'completed', 'missed', 'rescheduled', 'cancelled', 'unable_to_contact']).optional(),
  dueAt: z.string().optional().nullable(),
  outcomeNotes: z.string().optional().nullable(),
  nextFollowUpAt: z.string().optional().nullable(),
  assignedUserId: z.string().uuid().optional().nullable(),
  reason: z.string().optional(),
});

export const getFollowUps = async (req: AuthRequest, res: Response) => {
  const list = await db.select().from(followUps)
    .where(eq(followUps.patientId, req.params.patientId))
    .orderBy(desc(followUps.dueAt));
  return success(res, list);
};

export const createFollowUp = async (req: AuthRequest, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);
  const d = parsed.data;
  const [record] = await db.insert(followUps).values({
    patientId: req.params.patientId,
    reason: d.reason,
    dueAt: new Date(d.dueAt),
    relatedEncounterId: d.relatedEncounterId ?? null,
    assignedUserId: d.assignedUserId ?? null,
    createdBy: req.user!.id,
  }).returning();
  await audit({ actorUserId: req.user!.id, action: 'follow_up_created', entityType: 'follow_up', entityId: record.id });
  return success(res, record, 'Follow-up scheduled', 201);
};

export const updateFollowUp = async (req: AuthRequest, res: Response) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);
  const [existing] = await db.select({ id: followUps.id }).from(followUps).where(eq(followUps.id, req.params.id));
  if (!existing) return error(res, 'Follow-up not found', 404);
  const d = parsed.data;
  const setData: Record<string, unknown> = { updatedAt: new Date() };
  if (d.status !== undefined) setData.status = d.status;
  if (d.reason !== undefined) setData.reason = d.reason;
  if (d.outcomeNotes !== undefined) setData.outcomeNotes = d.outcomeNotes;
  if (d.assignedUserId !== undefined) setData.assignedUserId = d.assignedUserId;
  if (d.dueAt) setData.dueAt = new Date(d.dueAt);
  if (d.nextFollowUpAt) setData.nextFollowUpAt = new Date(d.nextFollowUpAt);
  if (d.status === 'completed') setData.completedAt = new Date();
  const [record] = await db.update(followUps).set(setData as any).where(eq(followUps.id, req.params.id)).returning();
  await audit({ actorUserId: req.user!.id, action: 'follow_up_updated', entityType: 'follow_up', entityId: record.id, safeMetadata: { status: d.status } });
  return success(res, record);
};

export const getFollowUpQueue = async (req: AuthRequest, res: Response) => {
  const now = new Date();
  const rows = await db.execute(sql`
    SELECT
      fu.*,
      p.first_name  AS patient_first_name,
      p.last_name   AS patient_last_name,
      p.patient_number
    FROM follow_ups fu
    JOIN patients p ON p.id = fu.patient_id
    WHERE fu.status IN ('scheduled', 'due')
      AND fu.due_at <= NOW() + INTERVAL '30 days'
    ORDER BY fu.due_at ASC
  `);
  const queue = (rows as any[]).map((f: any) => ({
    ...f,
    isOverdue:  new Date(f.due_at) < now,
    isDueToday: new Date(f.due_at).toDateString() === now.toDateString(),
  }));
  return success(res, queue);
};
