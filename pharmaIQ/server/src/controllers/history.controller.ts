import { Response } from 'express';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../config/database';
import {
  medicalConditions, patientAllergies, patients,
  familyHistory, socialHistory, procedures, hospitalisations,
} from '../models/schema';
import { success, error } from '../utils/response.util';
import { audit } from '../utils/audit.util';
import { AuthRequest } from '../middleware/auth.middleware';

// ─── Conditions ───────────────────────────────────────────────────────────────

const conditionSchema = z.object({
  conditionName: z.string().min(1).max(255),
  codeSystem: z.string().max(50).optional().nullable(),
  code: z.string().max(50).optional().nullable(),
  status: z.enum(['current', 'resolved', 'in_remission', 'historical', 'uncertain']).default('current'),
  onsetDate: z.string().optional().nullable(),
  resolvedDate: z.string().optional().nullable(),
  severity: z.string().max(100).optional().nullable(),
  source: z.enum(['patient_reported', 'clinician_document', 'imported', 'other']).default('patient_reported'),
  verificationStatus: z.enum(['unverified', 'reviewed', 'confirmed']).default('unverified'),
  notes: z.string().optional().nullable(),
});

export const getConditions = async (req: AuthRequest, res: Response) => {
  const list = await db.select().from(medicalConditions)
    .where(eq(medicalConditions.patientId, req.params.patientId))
    .orderBy(desc(medicalConditions.createdAt));
  return success(res, list);
};

export const addCondition = async (req: AuthRequest, res: Response) => {
  const parsed = conditionSchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);
  const d = parsed.data;
  const [record] = await db.insert(medicalConditions).values({
    patientId: req.params.patientId,
    conditionName: d.conditionName,
    codeSystem: d.codeSystem ?? null,
    code: d.code ?? null,
    status: d.status,
    onsetDate: d.onsetDate ?? null,
    resolvedDate: d.resolvedDate ?? null,
    severity: d.severity ?? null,
    source: d.source,
    verificationStatus: d.verificationStatus,
    notes: d.notes ?? null,
    recordedBy: req.user!.id,
  }).returning();
  await audit({ actorUserId: req.user!.id, action: 'condition_added', entityType: 'medical_condition', entityId: record.id });
  return success(res, record, 'Condition recorded', 201);
};

export const updateCondition = async (req: AuthRequest, res: Response) => {
  const parsed = conditionSchema.partial().safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);
  const [existing] = await db.select({ id: medicalConditions.id }).from(medicalConditions).where(eq(medicalConditions.id, req.params.id));
  if (!existing) return error(res, 'Condition not found', 404);
  const [record] = await db.update(medicalConditions).set({ ...parsed.data, updatedAt: new Date() }).where(eq(medicalConditions.id, req.params.id)).returning();
  await audit({ actorUserId: req.user!.id, action: 'condition_updated', entityType: 'medical_condition', entityId: record.id });
  return success(res, record);
};

// ─── Allergies ────────────────────────────────────────────────────────────────

const allergySchema = z.object({
  substance: z.string().min(1).max(255),
  classification: z.enum(['suspected_allergy', 'confirmed_allergy', 'intolerance', 'adverse_reaction', 'unknown']).default('unknown'),
  reaction: z.string().optional().nullable(),
  severity: z.string().max(100).optional().nullable(),
  firstReactionDate: z.string().optional().nullable(),
  status: z.enum(['active', 'resolved', 'ruled_out', 'unresolved']).default('active'),
  source: z.enum(['patient_reported', 'clinician_document', 'imported', 'other']).default('patient_reported'),
  verificationStatus: z.enum(['unverified', 'reviewed', 'confirmed']).default('unverified'),
  notes: z.string().optional().nullable(),
});

const syncAllergyStatus = async (patientId: string) => {
  const active = await db.select({ id: patientAllergies.id }).from(patientAllergies).where(eq(patientAllergies.patientId, patientId)).limit(1);
  if (active.length > 0) await db.update(patients).set({ allergyStatus: 'allergies_present' }).where(eq(patients.id, patientId));
};

export const getAllergies = async (req: AuthRequest, res: Response) => {
  const list = await db.select().from(patientAllergies).where(eq(patientAllergies.patientId, req.params.patientId)).orderBy(desc(patientAllergies.createdAt));
  return success(res, list);
};

export const addAllergy = async (req: AuthRequest, res: Response) => {
  const parsed = allergySchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);
  const d = parsed.data;
  const [record] = await db.insert(patientAllergies).values({
    patientId: req.params.patientId,
    substance: d.substance,
    classification: d.classification,
    reaction: d.reaction ?? null,
    severity: d.severity ?? null,
    firstReactionDate: d.firstReactionDate ?? null,
    status: d.status,
    source: d.source,
    verificationStatus: d.verificationStatus,
    notes: d.notes ?? null,
    recordedBy: req.user!.id,
  }).returning();
  await syncAllergyStatus(req.params.patientId);
  await audit({ actorUserId: req.user!.id, action: 'allergy_added', entityType: 'patient_allergy', entityId: record.id });
  return success(res, record, 'Allergy recorded', 201);
};

export const updateAllergy = async (req: AuthRequest, res: Response) => {
  const parsed = allergySchema.partial().safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);
  const [existing] = await db.select({ id: patientAllergies.id }).from(patientAllergies).where(eq(patientAllergies.id, req.params.id));
  if (!existing) return error(res, 'Allergy record not found', 404);
  const [record] = await db.update(patientAllergies).set({ ...parsed.data, updatedAt: new Date() }).where(eq(patientAllergies.id, req.params.id)).returning();
  await audit({ actorUserId: req.user!.id, action: 'allergy_updated', entityType: 'patient_allergy', entityId: record.id });
  return success(res, record);
};

export const setAllergyStatus = async (req: AuthRequest, res: Response) => {
  const schema = z.object({ allergyStatus: z.enum(['not_assessed', 'unknown', 'no_known_allergies', 'allergies_present']) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return error(res, 'Invalid allergy status', 422);
  await db.update(patients).set({ allergyStatus: parsed.data.allergyStatus }).where(eq(patients.id, req.params.patientId));
  await audit({ actorUserId: req.user!.id, action: 'allergy_status_set', entityType: 'patient', entityId: req.params.patientId, safeMetadata: { allergyStatus: parsed.data.allergyStatus } });
  return success(res, null, 'Allergy status updated');
};

// ─── Family History ───────────────────────────────────────────────────────────

const familySchema = z.object({
  relationship: z.string().min(1).max(100),
  condition: z.string().min(1).max(255),
  approximateOnset: z.string().max(100).optional().nullable(),
  notes: z.string().optional().nullable(),
  source: z.enum(['patient_reported', 'clinician_document', 'imported', 'other']).default('patient_reported'),
});

export const getFamilyHistory = async (req: AuthRequest, res: Response) => {
  const list = await db.select().from(familyHistory).where(eq(familyHistory.patientId, req.params.patientId)).orderBy(desc(familyHistory.createdAt));
  return success(res, list);
};

export const addFamilyHistory = async (req: AuthRequest, res: Response) => {
  const parsed = familySchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);
  const d = parsed.data;
  const [record] = await db.insert(familyHistory).values({
    patientId: req.params.patientId,
    relationship: d.relationship,
    condition: d.condition,
    approximateOnset: d.approximateOnset ?? null,
    notes: d.notes ?? null,
    source: d.source,
    recordedBy: req.user!.id,
  }).returning();
  await audit({ actorUserId: req.user!.id, action: 'family_history_added', entityType: 'family_history', entityId: record.id });
  return success(res, record, 'Family history recorded', 201);
};

// ─── Social History ───────────────────────────────────────────────────────────

const socialSchema = z.object({
  category: z.string().min(1).max(100),
  value: z.string().min(1),
  effectiveDate: z.string().optional().nullable(),
  source: z.enum(['patient_reported', 'clinician_document', 'imported', 'other']).default('patient_reported'),
  notes: z.string().optional().nullable(),
});

export const getSocialHistory = async (req: AuthRequest, res: Response) => {
  const list = await db.select().from(socialHistory).where(eq(socialHistory.patientId, req.params.patientId)).orderBy(desc(socialHistory.createdAt));
  return success(res, list);
};

export const addSocialHistory = async (req: AuthRequest, res: Response) => {
  const parsed = socialSchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);
  const d = parsed.data;
  const [record] = await db.insert(socialHistory).values({
    patientId: req.params.patientId,
    category: d.category,
    value: d.value,
    effectiveDate: d.effectiveDate ?? null,
    source: d.source,
    notes: d.notes ?? null,
    recordedBy: req.user!.id,
  }).returning();
  await audit({ actorUserId: req.user!.id, action: 'social_history_added', entityType: 'social_history', entityId: record.id });
  return success(res, record, 'Social history recorded', 201);
};

// ─── Procedures ───────────────────────────────────────────────────────────────

const procedureSchema = z.object({
  procedureName: z.string().min(1).max(255),
  procedureDate: z.string().optional().nullable(),
  approximateYear: z.number().int().optional().nullable(),
  reason: z.string().optional().nullable(),
  facility: z.string().max(255).optional().nullable(),
  complications: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  source: z.enum(['patient_reported', 'clinician_document', 'imported', 'other']).default('patient_reported'),
});

export const getProcedures = async (req: AuthRequest, res: Response) => {
  const list = await db.select().from(procedures).where(eq(procedures.patientId, req.params.patientId)).orderBy(desc(procedures.createdAt));
  return success(res, list);
};

export const addProcedure = async (req: AuthRequest, res: Response) => {
  const parsed = procedureSchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);
  const d = parsed.data;
  const [record] = await db.insert(procedures).values({
    patientId: req.params.patientId,
    procedureName: d.procedureName,
    procedureDate: d.procedureDate ?? null,
    approximateYear: d.approximateYear ?? null,
    reason: d.reason ?? null,
    facility: d.facility ?? null,
    complications: d.complications ?? null,
    notes: d.notes ?? null,
    source: d.source,
    recordedBy: req.user!.id,
  }).returning();
  await audit({ actorUserId: req.user!.id, action: 'procedure_added', entityType: 'procedure', entityId: record.id });
  return success(res, record, 'Procedure recorded', 201);
};

// ─── Hospitalisations ─────────────────────────────────────────────────────────

const hospitalisationSchema = z.object({
  admissionDate: z.string().optional().nullable(),
  dischargeDate: z.string().optional().nullable(),
  facility: z.string().max(255).optional().nullable(),
  reason: z.string().optional().nullable(),
  dischargeNotes: z.string().optional().nullable(),
  source: z.enum(['patient_reported', 'clinician_document', 'imported', 'other']).default('patient_reported'),
});

export const getHospitalisations = async (req: AuthRequest, res: Response) => {
  const list = await db.select().from(hospitalisations).where(eq(hospitalisations.patientId, req.params.patientId)).orderBy(desc(hospitalisations.createdAt));
  return success(res, list);
};

export const addHospitalisation = async (req: AuthRequest, res: Response) => {
  const parsed = hospitalisationSchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);
  const d = parsed.data;
  const [record] = await db.insert(hospitalisations).values({
    patientId: req.params.patientId,
    admissionDate: d.admissionDate ?? null,
    dischargeDate: d.dischargeDate ?? null,
    facility: d.facility ?? null,
    reason: d.reason ?? null,
    dischargeNotes: d.dischargeNotes ?? null,
    source: d.source,
    recordedBy: req.user!.id,
  }).returning();
  await audit({ actorUserId: req.user!.id, action: 'hospitalisation_added', entityType: 'hospitalisation', entityId: record.id });
  return success(res, record, 'Hospitalisation recorded', 201);
};
