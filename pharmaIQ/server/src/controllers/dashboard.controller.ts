import { Request, Response } from 'express';
import { eq, sql } from 'drizzle-orm';
import { db } from '../config/database';
import { patients, patientMedications, encounters, followUps } from '../models/schema';
import { success } from '../utils/response.util';

const countWhere = async (table: any, where: any): Promise<number> => {
  const [row] = await db.select({ n: sql<number>`COUNT(*)` }).from(table).where(where);
  return Number(row?.n ?? 0);
};

export const getDashboard = async (req: Request, res: Response) => {
  const [totalPatients, activeMedications, encountersToday, newThisMonth, overdueFollowUps, allergyFlagged] =
    await Promise.all([
      countWhere(patients, eq(patients.status, 'active')),
      countWhere(patientMedications, eq(patientMedications.status, 'active')),
      countWhere(encounters, sql`DATE(started_at) = CURRENT_DATE`),
      countWhere(patients, sql`DATE_TRUNC('month', registered_at) = DATE_TRUNC('month', NOW())`),
      countWhere(followUps, sql`status IN ('scheduled','due') AND due_at < NOW()`),
      countWhere(patients, eq(patients.allergyStatus, 'allergies_present')),
    ]);

  return success(res, { totalPatients, activeMedications, encountersToday, newThisMonth, overdueFollowUps, allergyFlagged });
};
