import { Response } from 'express';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../config/database';
import { encounters, observations, assessments, carePlans, encounterInterventions } from '../models/schema';
import { success, error } from '../utils/response.util';
import { audit } from '../utils/audit.util';
import { AuthRequest } from '../middleware/auth.middleware';

let encounterSeq = Date.now();
const nextEncounterNumber = () => `ENC-${++encounterSeq}`;

const encounterSchema = z.object({
  encounterType: z.enum(['initial_consultation', 'routine_checkup', 'medication_review', 'screening', 'follow_up', 'counselling', 'other']).default('routine_checkup'),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled', 'missed', 'rescheduled']).default('in_progress'),
  reason: z.string().optional().nullable(),
  presentingComplaint: z.string().optional().nullable(),
  symptoms: z.string().optional().nullable(),
  clinicalNotes: z.string().optional().nullable(),
  assessmentSummary: z.string().optional().nullable(),
  planSummary: z.string().optional().nullable(),
  referralDetails: z.string().optional().nullable(),
  assignedUserId: z.string().uuid().optional().nullable(),
  startedAt: z.string().optional().nullable(),
});

const amendSchema = z.object({
  amendmentReason: z.string().min(1),
  clinicalNotes: z.string().optional().nullable(),
  assessmentSummary: z.string().optional().nullable(),
  planSummary: z.string().optional().nullable(),
  referralDetails: z.string().optional().nullable(),
});

const observationSchema = z.object({
  observationType: z.string().min(1).max(100),
  valueNumeric: z.number().optional().nullable(),
  valueText: z.string().optional().nullable(),
  unit: z.string().max(50).optional().nullable(),
  context: z.string().max(255).optional().nullable(),
  measuredAt: z.string().optional().nullable(),
  source: z.enum(['patient_reported', 'clinician_document', 'imported', 'other']).default('patient_reported'),
  notes: z.string().optional().nullable(),
});

const assessmentSchema = z.object({
  assessmentType: z.string().min(1).max(100),
  description: z.string().min(1),
  status: z.string().default('active'),
  evidenceNotes: z.string().optional().nullable(),
});

const carePlanSchema = z.object({
  goalOrProblem: z.string().min(1),
  action: z.string().min(1),
  rationale: z.string().optional().nullable(),
  responsibleUserId: z.string().uuid().optional().nullable(),
  dueAt: z.string().optional().nullable(),
  status: z.string().default('active'),
});

const interventionSchema = z.object({
  interventionType: z.string().min(1).max(100),
  description: z.string().min(1),
  rationale: z.string().optional().nullable(),
  outcome: z.string().optional().nullable(),
});

export const getEncounters = async (req: AuthRequest, res: Response) => {
  const list = await db.select().from(encounters)
    .where(eq(encounters.patientId, req.params.patientId))
    .orderBy(desc(encounters.startedAt));
  return success(res, list);
};

export const createEncounter = async (req: AuthRequest, res: Response) => {
  const parsed = encounterSchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);
  const d = parsed.data;
  const [record] = await db.insert(encounters).values({
    patientId: req.params.patientId,
    encounterNumber: nextEncounterNumber(),
    encounterType: d.encounterType,
    status: d.status,
    reason: d.reason ?? null,
    presentingComplaint: d.presentingComplaint ?? null,
    symptoms: d.symptoms ?? null,
    clinicalNotes: d.clinicalNotes ?? null,
    assessmentSummary: d.assessmentSummary ?? null,
    planSummary: d.planSummary ?? null,
    referralDetails: d.referralDetails ?? null,
    assignedUserId: d.assignedUserId ?? null,
    startedAt: d.startedAt ? new Date(d.startedAt) : new Date(),
    createdBy: req.user!.id,
  }).returning();
  await audit({ actorUserId: req.user!.id, action: 'encounter_created', entityType: 'encounter', entityId: record.id });
  return success(res, record, 'Encounter created', 201);
};

export const getEncounter = async (req: AuthRequest, res: Response) => {
  const [encounter] = await db.select().from(encounters).where(eq(encounters.id, req.params.id));
  if (!encounter) return error(res, 'Encounter not found', 404);
  const [obs, assess, plans, interventions] = await Promise.all([
    db.select().from(observations).where(eq(observations.encounterId, encounter.id)).orderBy(desc(observations.measuredAt)),
    db.select().from(assessments).where(eq(assessments.encounterId, encounter.id)),
    db.select().from(carePlans).where(eq(carePlans.encounterId, encounter.id)),
    db.select().from(encounterInterventions).where(eq(encounterInterventions.encounterId, encounter.id)),
  ]);
  return success(res, { ...encounter, observations: obs, assessments: assess, carePlans: plans, interventions });
};

export const updateEncounter = async (req: AuthRequest, res: Response) => {
  const parsed = encounterSchema.partial().safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);
  const [existing] = await db.select({ id: encounters.id }).from(encounters).where(eq(encounters.id, req.params.id));
  if (!existing) return error(res, 'Encounter not found', 404);
  const { startedAt, ...rest } = parsed.data;
  const setData: Record<string, unknown> = { ...rest, updatedAt: new Date() };
  if (startedAt) setData.startedAt = new Date(startedAt);
  if (parsed.data.status === 'completed') setData.completedAt = new Date();
  const [record] = await db.update(encounters).set(setData as any).where(eq(encounters.id, req.params.id)).returning();
  await audit({ actorUserId: req.user!.id, action: 'encounter_updated', entityType: 'encounter', entityId: record.id });
  return success(res, record);
};

export const amendEncounter = async (req: AuthRequest, res: Response) => {
  const parsed = amendSchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);
  const [existing] = await db.select({ id: encounters.id, status: encounters.status }).from(encounters).where(eq(encounters.id, req.params.id));
  if (!existing) return error(res, 'Encounter not found', 404);
  if (existing.status !== 'completed') return error(res, 'Only completed encounters can be amended', 400);
  const { amendmentReason, ...fields } = parsed.data;
  const [record] = await db.update(encounters)
    .set({ ...fields, amendedAt: new Date(), amendmentReason, updatedAt: new Date() } as any)
    .where(eq(encounters.id, req.params.id)).returning();
  await audit({ actorUserId: req.user!.id, action: 'encounter_amended', entityType: 'encounter', entityId: record.id, reason: amendmentReason });
  return success(res, record);
};

// Standalone patient-level observations (not tied to an encounter)
export const getPatientObservations = async (req: AuthRequest, res: Response) => {
  const list = await db.select().from(observations)
    .where(eq(observations.patientId, req.params.patientId))
    .orderBy(desc(observations.measuredAt));
  return success(res, list);
};

export const addPatientObservation = async (req: AuthRequest, res: Response) => {
  const parsed = observationSchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);
  const d = parsed.data;
  const [record] = await db.insert(observations).values({
    patientId: req.params.patientId,
    encounterId: null,
    observationType: d.observationType,
    valueNumeric: d.valueNumeric?.toString() ?? null,
    valueText: d.valueText ?? null,
    unit: d.unit ?? null,
    context: d.context ?? null,
    measuredAt: d.measuredAt ? new Date(d.measuredAt) : new Date(),
    source: d.source,
    recordedBy: req.user!.id,
    notes: d.notes ?? null,
  }).returning();
  await audit({ actorUserId: req.user!.id, action: 'observation_added', entityType: 'observation', entityId: record.id });
  return success(res, record, 'Observation recorded', 201);
};

export const addObservation = async (req: AuthRequest, res: Response) => {
  const parsed = observationSchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);
  const [encounter] = await db.select({ patientId: encounters.patientId }).from(encounters).where(eq(encounters.id, req.params.encounterId));
  if (!encounter) return error(res, 'Encounter not found', 404);
  const d = parsed.data;
  const [record] = await db.insert(observations).values({
    patientId: encounter.patientId,
    encounterId: req.params.encounterId,
    observationType: d.observationType,
    valueNumeric: d.valueNumeric?.toString() ?? null,
    valueText: d.valueText ?? null,
    unit: d.unit ?? null,
    context: d.context ?? null,
    measuredAt: d.measuredAt ? new Date(d.measuredAt) : new Date(),
    source: d.source,
    recordedBy: req.user!.id,
    notes: d.notes ?? null,
  }).returning();
  await audit({ actorUserId: req.user!.id, action: 'observation_added', entityType: 'observation', entityId: record.id });
  return success(res, record, 'Observation recorded', 201);
};

export const addAssessment = async (req: AuthRequest, res: Response) => {
  const parsed = assessmentSchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);
  const [encounter] = await db.select({ patientId: encounters.patientId }).from(encounters).where(eq(encounters.id, req.params.encounterId));
  if (!encounter) return error(res, 'Encounter not found', 404);
  const d = parsed.data;
  const [record] = await db.insert(assessments).values({
    patientId: encounter.patientId,
    encounterId: req.params.encounterId,
    assessmentType: d.assessmentType,
    description: d.description,
    status: d.status,
    evidenceNotes: d.evidenceNotes ?? null,
    recordedBy: req.user!.id,
  }).returning();
  await audit({ actorUserId: req.user!.id, action: 'assessment_added', entityType: 'assessment', entityId: record.id });
  return success(res, record, 'Assessment recorded', 201);
};

export const addCarePlan = async (req: AuthRequest, res: Response) => {
  const parsed = carePlanSchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);
  const [encounter] = await db.select({ patientId: encounters.patientId }).from(encounters).where(eq(encounters.id, req.params.encounterId));
  if (!encounter) return error(res, 'Encounter not found', 404);
  const d = parsed.data;
  const [record] = await db.insert(carePlans).values({
    patientId: encounter.patientId,
    encounterId: req.params.encounterId,
    goalOrProblem: d.goalOrProblem,
    action: d.action,
    rationale: d.rationale ?? null,
    responsibleUserId: d.responsibleUserId ?? null,
    dueAt: d.dueAt ?? null,
    status: d.status,
    createdBy: req.user!.id,
  }).returning();
  await audit({ actorUserId: req.user!.id, action: 'care_plan_added', entityType: 'care_plan', entityId: record.id });
  return success(res, record, 'Care plan recorded', 201);
};

export const addIntervention = async (req: AuthRequest, res: Response) => {
  const parsed = interventionSchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);
  const [encounter] = await db.select({ id: encounters.id }).from(encounters).where(eq(encounters.id, req.params.encounterId));
  if (!encounter) return error(res, 'Encounter not found', 404);
  const d = parsed.data;
  const [record] = await db.insert(encounterInterventions).values({
    encounterId: req.params.encounterId,
    interventionType: d.interventionType,
    description: d.description,
    rationale: d.rationale ?? null,
    outcome: d.outcome ?? null,
    recordedBy: req.user!.id,
  }).returning();
  await audit({ actorUserId: req.user!.id, action: 'intervention_added', entityType: 'encounter_intervention', entityId: record.id });
  return success(res, record, 'Intervention recorded', 201);
};
