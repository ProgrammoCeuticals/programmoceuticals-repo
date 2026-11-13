import { Response } from 'express';
import { eq, desc, and, gte, lte } from 'drizzle-orm';
import { db } from '../config/database';
import {
  patients, patientContacts, emergencyContacts,
  medicalConditions, patientAllergies,
  patientMedications, medicationChanges,
  encounters, observations, followUps,
  testOrders, testResults, clinicalDocuments,
} from '../models/schema';
import { success, error } from '../utils/response.util';
import { audit } from '../utils/audit.util';
import { AuthRequest } from '../middleware/auth.middleware';

export const getTimeline = async (req: AuthRequest, res: Response) => {
  const { patientId } = req.params;
  const { from, to } = req.query as { from?: string; to?: string };

  const [patient] = await db.select({ id: patients.id }).from(patients).where(eq(patients.id, patientId));
  if (!patient) return error(res, 'Patient not found', 404);

  const dateFilter = (col: any) => {
    if (from && to) return and(gte(col, new Date(from)), lte(col, new Date(to)));
    if (from) return gte(col, new Date(from));
    if (to) return lte(col, new Date(to));
    return undefined;
  };

  const [
    encounterList,
    medChanges,
    obsList,
    followUpList,
    resultList,
    docList,
  ] = await Promise.all([
    db.select().from(encounters).where(and(eq(encounters.patientId, patientId), dateFilter(encounters.startedAt) ?? eq(encounters.patientId, patientId))).orderBy(desc(encounters.startedAt)),
    db.select().from(medicationChanges).where(eq(medicationChanges.patientId, patientId)).orderBy(desc(medicationChanges.changedAt)),
    db.select().from(observations).where(eq(observations.patientId, patientId)).orderBy(desc(observations.measuredAt)),
    db.select().from(followUps).where(eq(followUps.patientId, patientId)).orderBy(desc(followUps.dueAt)),
    db.select().from(testResults).where(eq(testResults.patientId, patientId)).orderBy(desc(testResults.resultAt)),
    db.select().from(clinicalDocuments).where(eq(clinicalDocuments.patientId, patientId)).orderBy(desc(clinicalDocuments.uploadedAt)),
  ]);

  const events = [
    ...encounterList.map(e => ({ type: 'encounter', date: e.startedAt, data: e })),
    ...medChanges.map(m => ({ type: 'medication_change', date: m.changedAt, data: m })),
    ...obsList.map(o => ({ type: 'observation', date: o.measuredAt, data: o })),
    ...followUpList.map(f => ({ type: 'follow_up', date: f.dueAt, data: f })),
    ...resultList.map(r => ({ type: 'test_result', date: r.resultAt ?? r.createdAt, data: r })),
    ...docList.map(d => ({ type: 'document', date: d.uploadedAt, data: d })),
  ].sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());

  await audit({ actorUserId: req.user!.id, action: 'timeline_viewed', entityType: 'patient', entityId: patientId });
  return success(res, events);
};

export const getPatientSummary = async (req: AuthRequest, res: Response) => {
  const { patientId } = req.params;

  const [patient] = await db.select().from(patients).where(eq(patients.id, patientId));
  if (!patient) return error(res, 'Patient not found', 404);

  const [
    contacts,
    emergency,
    activeConditions,
    activeAllergies,
    activeMeds,
    recentEncounters,
    recentObs,
    pendingFollowUps,
    pendingResults,
    docs,
  ] = await Promise.all([
    db.select().from(patientContacts).where(eq(patientContacts.patientId, patientId)),
    db.select().from(emergencyContacts).where(eq(emergencyContacts.patientId, patientId)),
    db.select().from(medicalConditions).where(and(eq(medicalConditions.patientId, patientId), eq(medicalConditions.status, 'current'))),
    db.select().from(patientAllergies).where(and(eq(patientAllergies.patientId, patientId), eq(patientAllergies.status, 'active'))),
    db.select().from(patientMedications).where(and(eq(patientMedications.patientId, patientId), eq(patientMedications.status, 'active'))),
    db.select().from(encounters).where(eq(encounters.patientId, patientId)).orderBy(desc(encounters.startedAt)).limit(5),
    db.select().from(observations).where(eq(observations.patientId, patientId)).orderBy(desc(observations.measuredAt)).limit(10),
    db.select().from(followUps).where(and(eq(followUps.patientId, patientId), eq(followUps.status, 'scheduled'))).orderBy(followUps.dueAt).limit(5),
    db.select().from(testResults).where(and(eq(testResults.patientId, patientId), eq(testResults.status, 'preliminary'))).limit(5),
    db.select().from(clinicalDocuments).where(eq(clinicalDocuments.patientId, patientId)).orderBy(desc(clinicalDocuments.uploadedAt)).limit(5),
  ]);

  await audit({ actorUserId: req.user!.id, action: 'patient_summary_viewed', entityType: 'patient', entityId: patientId });

  return success(res, {
    generatedAt: new Date().toISOString(),
    patient: { ...patient },
    contacts,
    emergencyContacts: emergency,
    allergyStatus: patient.allergyStatus,
    activeAllergies,
    activeConditions,
    activeMedications: activeMeds,
    recentEncounters,
    recentObservations: recentObs,
    pendingFollowUps,
    pendingResults,
    recentDocuments: docs,
  });
};
