import { Response } from 'express';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../config/database';
import { patientMedications, medicationChanges, medicationReviews } from '../models/schema';
import { success, error } from '../utils/response.util';
import { audit } from '../utils/audit.util';
import { AuthRequest } from '../middleware/auth.middleware';

const medicationSchema = z.object({
  medicineNameSnapshot: z.string().min(1).max(255),
  genericNameSnapshot: z.string().max(255).optional().nullable(),
  strengthSnapshot: z.string().max(100).optional().nullable(),
  dosageFormSnapshot: z.string().max(100).optional().nullable(),
  doseAmount: z.string().max(100).optional().nullable(),
  doseUnit: z.string().max(50).optional().nullable(),
  route: z.string().max(100).optional().nullable(),
  frequency: z.string().max(100).optional().nullable(),
  instructions: z.string().optional().nullable(),
  indication: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  status: z.enum(['active', 'discontinued', 'completed', 'held', 'uncertain']).default('active'),
  prescriberName: z.string().max(255).optional().nullable(),
  source: z.enum(['patient_reported', 'clinician_document', 'imported', 'other']).default('patient_reported'),
  adherenceStatus: z.string().max(100).optional().nullable(),
  sideEffectsNotes: z.string().optional().nullable(),
});

const changeSchema = z.object({
  changeType: z.enum(['started', 'dose_changed', 'frequency_changed', 'discontinued', 'held', 'resumed', 'completed', 'other']),
  reason: z.string().optional().nullable(),
  encounterId: z.string().uuid().optional().nullable(),
  updates: medicationSchema.partial(),
});

const reviewSchema = z.object({
  encounterId: z.string().uuid(),
  reconciliationStatus: z.enum(['complete', 'partial', 'not_completed']).default('not_completed'),
  problemsIdentified: z.string().optional().nullable(),
  actionsTaken: z.string().optional().nullable(),
  referralDetails: z.string().optional().nullable(),
  outcome: z.string().optional().nullable(),
  followUpAt: z.string().optional().nullable(),
});

export const getMedications = async (req: AuthRequest, res: Response) => {
  const list = await db.select().from(patientMedications)
    .where(eq(patientMedications.patientId, req.params.patientId))
    .orderBy(desc(patientMedications.createdAt));
  return success(res, list);
};

export const addMedication = async (req: AuthRequest, res: Response) => {
  const parsed = medicationSchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);
  const d = parsed.data;
  const [record] = await db.insert(patientMedications).values({
    patientId: req.params.patientId,
    medicineNameSnapshot: d.medicineNameSnapshot,
    genericNameSnapshot: d.genericNameSnapshot ?? null,
    strengthSnapshot: d.strengthSnapshot ?? null,
    dosageFormSnapshot: d.dosageFormSnapshot ?? null,
    doseAmount: d.doseAmount ?? null,
    doseUnit: d.doseUnit ?? null,
    route: d.route ?? null,
    frequency: d.frequency ?? null,
    instructions: d.instructions ?? null,
    indication: d.indication ?? null,
    startDate: d.startDate ?? null,
    endDate: d.endDate ?? null,
    status: d.status,
    prescriberName: d.prescriberName ?? null,
    source: d.source,
    adherenceStatus: d.adherenceStatus ?? null,
    sideEffectsNotes: d.sideEffectsNotes ?? null,
    recordedBy: req.user!.id,
  }).returning();

  await db.insert(medicationChanges).values({
    patientMedicationId: record.id,
    patientId: req.params.patientId,
    changeType: 'started',
    newValues: d as Record<string, unknown>,
    source: d.source,
    changedBy: req.user!.id,
  });

  await audit({ actorUserId: req.user!.id, action: 'medication_added', entityType: 'patient_medication', entityId: record.id });
  return success(res, record, 'Medication recorded', 201);
};

export const changeMedication = async (req: AuthRequest, res: Response) => {
  const parsed = changeSchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);

  const [existing] = await db.select().from(patientMedications).where(eq(patientMedications.id, req.params.id));
  if (!existing) return error(res, 'Medication record not found', 404);

  const { changeType, reason, encounterId, updates } = parsed.data;
  const previousValues: Record<string, unknown> = {};
  const newValues: Record<string, unknown> = {};
  for (const key of Object.keys(updates) as (keyof typeof updates)[]) {
    previousValues[key] = (existing as Record<string, unknown>)[key];
    newValues[key] = updates[key];
  }

  await db.insert(medicationChanges).values({
    patientMedicationId: existing.id,
    patientId: existing.patientId,
    encounterId: encounterId ?? null,
    changeType,
    previousValues,
    newValues,
    reason: reason ?? null,
    source: existing.source,
    changedBy: req.user!.id,
  });

  const [updated] = await db.update(patientMedications)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(patientMedications.id, req.params.id))
    .returning();

  await audit({ actorUserId: req.user!.id, action: 'medication_changed', entityType: 'patient_medication', entityId: updated.id, safeMetadata: { changeType } });
  return success(res, updated);
};

export const getMedicationHistory = async (req: AuthRequest, res: Response) => {
  const list = await db.select().from(medicationChanges)
    .where(eq(medicationChanges.patientMedicationId, req.params.id))
    .orderBy(desc(medicationChanges.changedAt));
  return success(res, list);
};

export const addMedicationReview = async (req: AuthRequest, res: Response) => {
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);
  const d = parsed.data;
  const [record] = await db.insert(medicationReviews).values({
    patientId: req.params.patientId,
    encounterId: d.encounterId,
    reviewedBy: req.user!.id,
    reconciliationStatus: d.reconciliationStatus,
    problemsIdentified: d.problemsIdentified ?? null,
    actionsTaken: d.actionsTaken ?? null,
    referralDetails: d.referralDetails ?? null,
    outcome: d.outcome ?? null,
    followUpAt: d.followUpAt ?? null,
  }).returning();
  await audit({ actorUserId: req.user!.id, action: 'medication_review_added', entityType: 'medication_review', entityId: record.id });
  return success(res, record, 'Medication review recorded', 201);
};

export const getMedicationReviews = async (req: AuthRequest, res: Response) => {
  const list = await db.select().from(medicationReviews)
    .where(eq(medicationReviews.patientId, req.params.patientId))
    .orderBy(desc(medicationReviews.reviewedAt));
  return success(res, list);
};
