import { db } from '../config/database';
import { patients } from '../models/schema';
import { like, desc } from 'drizzle-orm';

export const generatePatientNumber = async (): Promise<string> => {
  const prefix = `PC-${new Date().getFullYear()}`;
  const [last] = await db
    .select({ patientNumber: patients.patientNumber })
    .from(patients)
    .where(like(patients.patientNumber, `${prefix}%`))
    .orderBy(desc(patients.patientNumber))
    .limit(1);

  const next = last
    ? parseInt(last.patientNumber.slice(-5), 10) + 1
    : 1;

  return `${prefix}-${String(next).padStart(5, '0')}`;
};
