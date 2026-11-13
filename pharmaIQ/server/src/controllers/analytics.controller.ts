import { Request, Response } from 'express';
import { sql, eq, and, lt, gte } from 'drizzle-orm';
import { db } from '../config/database';
import {
  patients, patientMedications, encounters, followUps,
  medicalConditions, patientAllergies, observations
} from '../models/schema';
import { success } from '../utils/response.util';

// ── Population health summary ─────────────────────────────────────────────────
export const getPopulationHealth = async (_req: Request, res: Response) => {
  const [
    totalActive,
    polypharmacy,
    lostToFollowUp,
    allergyPresent,
    unassessedAllergy,
    overdueReview,
    noEncounterEver,
  ] = await Promise.all([
    // Active patients
    db.select({ n: sql<number>`COUNT(*)` }).from(patients).where(eq(patients.status, 'active')),

    // Polypharmacy: patients with 5+ active medications
    db.execute(sql`
      SELECT COUNT(*) AS n FROM (
        SELECT patient_id FROM patient_medications
        WHERE status = 'active'
        GROUP BY patient_id
        HAVING COUNT(*) >= 5
      ) sub
    `),

    // Lost to follow-up: active patients with no encounter in 90 days
    db.execute(sql`
      SELECT COUNT(*) AS n FROM patients p
      WHERE p.status = 'active'
      AND NOT EXISTS (
        SELECT 1 FROM encounters e
        WHERE e.patient_id = p.id
        AND e.started_at >= NOW() - INTERVAL '90 days'
      )
    `),

    // Allergy present
    db.select({ n: sql<number>`COUNT(*)` }).from(patients)
      .where(and(eq(patients.status, 'active'), eq(patients.allergyStatus, 'allergies_present'))),

    // Allergy not assessed
    db.select({ n: sql<number>`COUNT(*)` }).from(patients)
      .where(and(eq(patients.status, 'active'), eq(patients.allergyStatus, 'not_assessed'))),

    // Overdue medication review: active patients with active meds, no review in 6 months
    db.execute(sql`
      SELECT COUNT(DISTINCT pm.patient_id) AS n
      FROM patient_medications pm
      WHERE pm.status = 'active'
      AND (pm.last_reviewed_at IS NULL OR pm.last_reviewed_at < NOW() - INTERVAL '6 months')
    `),

    // Never had an encounter
    db.execute(sql`
      SELECT COUNT(*) AS n FROM patients p
      WHERE p.status = 'active'
      AND NOT EXISTS (SELECT 1 FROM encounters e WHERE e.patient_id = p.id)
    `),
  ]);

  return success(res, {
    totalActive: Number(totalActive[0]?.n ?? 0),
    polypharmacy: Number((polypharmacy[0] as any)?.n ?? 0),
    lostToFollowUp: Number(((lostToFollowUp as any)[0] as any)?.n ?? 0),
    allergyPresent: Number(allergyPresent[0]?.n ?? 0),
    unassessedAllergy: Number(unassessedAllergy[0]?.n ?? 0),
    overdueReview: Number(((overdueReview as any)[0] as any)?.n ?? 0),
    noEncounterEver: Number(((noEncounterEver as any)[0] as any)?.n ?? 0),
  });
};

// ── High-risk patient list ────────────────────────────────────────────────────
export const getHighRiskPatients = async (_req: Request, res: Response) => {
  const rows = await db.execute(sql`
    SELECT
      p.id, p.patient_number, p.first_name, p.last_name,
      p.allergy_status,
      COUNT(DISTINCT pm.id) FILTER (WHERE pm.status = 'active') AS active_med_count,
      COUNT(DISTINCT mc.id) FILTER (WHERE mc.status = 'current') AS active_condition_count,
      MAX(e.started_at) AS last_encounter_at,
      COUNT(DISTINCT fu.id) FILTER (WHERE fu.status IN ('scheduled','due') AND fu.due_at < NOW()) AS overdue_followups
    FROM patients p
    LEFT JOIN patient_medications pm ON pm.patient_id = p.id
    LEFT JOIN medical_conditions mc ON mc.patient_id = p.id
    LEFT JOIN encounters e ON e.patient_id = p.id
    LEFT JOIN follow_ups fu ON fu.patient_id = p.id
    WHERE p.status = 'active'
    GROUP BY p.id, p.patient_number, p.first_name, p.last_name, p.allergy_status
    HAVING
      COUNT(DISTINCT pm.id) FILTER (WHERE pm.status = 'active') >= 5
      OR COUNT(DISTINCT fu.id) FILTER (WHERE fu.status IN ('scheduled','due') AND fu.due_at < NOW()) > 0
      OR MAX(e.started_at) < NOW() - INTERVAL '90 days'
      OR MAX(e.started_at) IS NULL
    ORDER BY active_med_count DESC, overdue_followups DESC
    LIMIT 50
  `);

  return success(res, rows as any);
};

// ── Condition prevalence ──────────────────────────────────────────────────────
export const getConditionPrevalence = async (_req: Request, res: Response) => {
  const rows = await db.execute(sql`
    SELECT
      condition_name,
      COUNT(*) AS patient_count,
      COUNT(*) FILTER (WHERE status = 'current') AS active_count
    FROM medical_conditions
    WHERE archived_at IS NULL
    GROUP BY condition_name
    ORDER BY patient_count DESC
    LIMIT 20
  `);

  return success(res, rows as any);
};

// ── Encounter volume by month (last 12 months) ────────────────────────────────
export const getEncounterVolume = async (_req: Request, res: Response) => {
  const rows = await db.execute(sql`
    SELECT
      TO_CHAR(DATE_TRUNC('month', started_at), 'Mon YYYY') AS month,
      DATE_TRUNC('month', started_at) AS month_date,
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'completed') AS completed
    FROM encounters
    WHERE started_at >= NOW() - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', started_at)
    ORDER BY month_date ASC
  `);

  return success(res, rows as any);
};

// ── New patient registrations by month (last 12 months) ──────────────────────
export const getRegistrationTrend = async (_req: Request, res: Response) => {
  const rows = await db.execute(sql`
    SELECT
      TO_CHAR(DATE_TRUNC('month', registered_at), 'Mon YYYY') AS month,
      DATE_TRUNC('month', registered_at) AS month_date,
      COUNT(*) AS count
    FROM patients
    WHERE registered_at >= NOW() - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', registered_at)
    ORDER BY month_date ASC
  `);

  return success(res, rows as any);
};

// ── Observation trends for a patient ─────────────────────────────────────────
export const getObservationTrends = async (req: Request, res: Response) => {
  const { patientId } = req.params;
  const { type } = req.query;

  const rows = await db.execute(sql`
    SELECT
      observation_type,
      value_numeric,
      value_text,
      unit,
      measured_at
    FROM observations
    WHERE patient_id = ${patientId}
    ${type ? sql`AND observation_type = ${type}` : sql``}
    AND value_numeric IS NOT NULL
    ORDER BY measured_at ASC
  `);

  // Group by observation type
  const grouped: Record<string, any[]> = {};
  for (const row of rows as any[]) {
    if (!grouped[row.observation_type]) grouped[row.observation_type] = [];
    grouped[row.observation_type].push({
      value: Number(row.value_numeric),
      unit: row.unit,
      measuredAt: row.measured_at,
    });
  }

  return success(res, grouped);
};

// ── Polypharmacy list ─────────────────────────────────────────────────────────
export const getPolypharmacyPatients = async (_req: Request, res: Response) => {
  const rows = await db.execute(sql`
    SELECT
      p.id, p.patient_number, p.first_name, p.last_name,
      COUNT(pm.id) AS med_count,
      ARRAY_AGG(pm.medicine_name_snapshot ORDER BY pm.created_at) AS medications
    FROM patients p
    JOIN patient_medications pm ON pm.patient_id = p.id AND pm.status = 'active'
    WHERE p.status = 'active'
    GROUP BY p.id, p.patient_number, p.first_name, p.last_name
    HAVING COUNT(pm.id) >= 5
    ORDER BY med_count DESC
  `);

  return success(res, rows as any);
};

// ── Follow-up compliance rate ─────────────────────────────────────────────────
export const getFollowUpCompliance = async (_req: Request, res: Response) => {
  const rows = await db.execute(sql`
    SELECT
      TO_CHAR(DATE_TRUNC('month', due_at), 'Mon YYYY') AS month,
      DATE_TRUNC('month', due_at) AS month_date,
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'completed') AS completed,
      COUNT(*) FILTER (WHERE status = 'missed') AS missed,
      ROUND(
        COUNT(*) FILTER (WHERE status = 'completed') * 100.0 / NULLIF(COUNT(*), 0), 1
      ) AS compliance_rate
    FROM follow_ups
    WHERE due_at >= NOW() - INTERVAL '6 months'
    GROUP BY DATE_TRUNC('month', due_at)
    ORDER BY month_date ASC
  `);

  return success(res, rows as any);
};
