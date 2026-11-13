import { Response } from 'express';
import { eq, ilike, or, desc, and, ne, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../config/database';
import { patients, patientContacts, emergencyContacts } from '../models/schema';
import { success, error } from '../utils/response.util';
import { audit } from '../utils/audit.util';
import { generatePatientNumber } from '../utils/patient-number.util';
import { AuthRequest } from '../middleware/auth.middleware';

const createSchema = z.object({
  firstName: z.string().min(1).max(100),
  middleName: z.string().max(100).optional(),
  lastName: z.string().min(1).max(100),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.enum(['male', 'female', 'other', 'unknown']).optional().nullable(),
  registrationSource: z.enum(['walk_in', 'referral', 'outreach', 'other']).optional().nullable(),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  // contacts
  phone: z.string().max(20).optional().nullable(),
  email: z.string().email().optional().nullable(),
  // emergency contact
  emergencyName: z.string().max(100).optional().nullable(),
  emergencyRelationship: z.string().max(100).optional().nullable(),
  emergencyPhone: z.string().max(20).optional().nullable(),
});

const updateSchema = createSchema.partial();

const detectDuplicates = async (
  firstName: string,
  lastName: string,
  dateOfBirth?: string | null,
  phone?: string | null,
  excludeId?: string,
) => {
  // Match on (firstName + lastName) OR (lastName + DOB) OR phone
  const nameMatch = await db
    .select({ id: patients.id, patientNumber: patients.patientNumber, firstName: patients.firstName, lastName: patients.lastName, dateOfBirth: patients.dateOfBirth })
    .from(patients)
    .where(
      and(
        ilike(patients.firstName, firstName),
        ilike(patients.lastName, lastName),
        excludeId ? ne(patients.id, excludeId) : sql`true`,
      ),
    )
    .limit(5);

  const phoneMatches =
    phone
      ? await db
          .select({ id: patients.id, patientNumber: patients.patientNumber, firstName: patients.firstName, lastName: patients.lastName })
          .from(patientContacts)
          .innerJoin(patients, eq(patientContacts.patientId, patients.id))
          .where(
            and(
              eq(patientContacts.value, phone),
              eq(patientContacts.contactType, 'phone'),
              excludeId ? ne(patients.id, excludeId) : sql`true`,
            ),
          )
          .limit(5)
      : [];

  const seen = new Set<string>();
  const combined = [...nameMatch, ...phoneMatches].filter(p => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  return combined;
};

export const createPatient = async (req: AuthRequest, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
    return error(res, msg, 422);
  }

  const { firstName, lastName, dateOfBirth, phone, email, emergencyName, emergencyRelationship, emergencyPhone, ...rest } = parsed.data;

  const duplicates = await detectDuplicates(firstName, lastName, dateOfBirth, phone);

  const patientNumber = await generatePatientNumber();

  const [patient] = await db
    .insert(patients)
    .values({ ...rest, firstName, lastName, dateOfBirth: dateOfBirth ?? null, patientNumber, createdBy: req.user!.id })
    .returning();

  // Insert contacts
  const contactInserts: typeof patientContacts.$inferInsert[] = [];
  if (phone) contactInserts.push({ patientId: patient.id, contactType: 'phone', value: phone, isPrimary: true });
  if (email) contactInserts.push({ patientId: patient.id, contactType: 'email', value: email, isPrimary: !phone });
  if (contactInserts.length) await db.insert(patientContacts).values(contactInserts);

  if (emergencyName && emergencyPhone) {
    await db.insert(emergencyContacts).values({
      patientId: patient.id,
      name: emergencyName,
      relationship: emergencyRelationship ?? null,
      phone: emergencyPhone,
    });
  }

  await audit({ actorUserId: req.user!.id, action: 'patient_created', entityType: 'patient', entityId: patient.id });

  return success(
    res,
    { patient, duplicateWarnings: duplicates.length > 0 ? duplicates : undefined },
    duplicates.length > 0 ? 'Patient registered — possible duplicates detected' : 'Patient registered',
    201,
  );
};

export const getPatients = async (req: AuthRequest, res: Response) => {
  const { search, page = '1', limit = '20' } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  const searchClause = search
    ? sql`WHERE (p.first_name ILIKE ${'%' + search + '%'} OR p.last_name ILIKE ${'%' + search + '%'} OR p.patient_number ILIKE ${'%' + search + '%'} OR pc.value ILIKE ${'%' + search + '%'})`
    : sql`WHERE p.status = 'active'`;

  const [rows, countRows] = await Promise.all([
    db.execute(sql`
      SELECT
        p.id, p.patient_number, p.first_name, p.last_name,
        p.date_of_birth, p.gender, p.status, p.allergy_status, p.registered_at,
        MAX(pc.value) FILTER (WHERE pc.contact_type = 'phone') AS phone
      FROM patients p
      LEFT JOIN patient_contacts pc ON pc.patient_id = p.id
      ${searchClause}
      GROUP BY p.id
      ORDER BY p.registered_at DESC
      LIMIT ${limitNum} OFFSET ${offset}
    `),
    db.execute(sql`
      SELECT COUNT(DISTINCT p.id) AS total
      FROM patients p
      LEFT JOIN patient_contacts pc ON pc.patient_id = p.id
      ${searchClause}
    `),
  ]);

  const total = Number((countRows as any)[0]?.total ?? 0);
  return success(res, { patients: rows, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) });
};

export const getPatient = async (req: AuthRequest, res: Response) => {
  const [patient] = await db.select().from(patients).where(eq(patients.id, req.params.id));
  if (!patient) return error(res, 'Patient not found', 404);

  const contacts = await db.select().from(patientContacts).where(eq(patientContacts.patientId, patient.id));
  const emergency = await db.select().from(emergencyContacts).where(eq(emergencyContacts.patientId, patient.id));

  return success(res, { ...patient, contacts, emergencyContacts: emergency });
};

export const updatePatient = async (req: AuthRequest, res: Response) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
    return error(res, msg, 422);
  }

  const { phone, email, emergencyName, emergencyRelationship, emergencyPhone, ...fields } = parsed.data;

  const [existing] = await db.select({ id: patients.id }).from(patients).where(eq(patients.id, req.params.id));
  if (!existing) return error(res, 'Patient not found', 404);

  const [patient] = await db
    .update(patients)
    .set({ ...fields, updatedAt: new Date() })
    .where(eq(patients.id, req.params.id))
    .returning();

  if (phone !== undefined) {
    await db.delete(patientContacts).where(and(eq(patientContacts.patientId, patient.id), eq(patientContacts.contactType, 'phone')));
    if (phone) await db.insert(patientContacts).values({ patientId: patient.id, contactType: 'phone', value: phone, isPrimary: true });
  }
  if (email !== undefined) {
    await db.delete(patientContacts).where(and(eq(patientContacts.patientId, patient.id), eq(patientContacts.contactType, 'email')));
    if (email) await db.insert(patientContacts).values({ patientId: patient.id, contactType: 'email', value: email });
  }

  await audit({ actorUserId: req.user!.id, action: 'patient_updated', entityType: 'patient', entityId: patient.id });
  return success(res, patient);
};

export const archivePatient = async (req: AuthRequest, res: Response) => {
  const [existing] = await db.select({ id: patients.id }).from(patients).where(eq(patients.id, req.params.id));
  if (!existing) return error(res, 'Patient not found', 404);

  await db.update(patients).set({ status: 'archived', archivedAt: new Date(), updatedAt: new Date() }).where(eq(patients.id, req.params.id));
  await audit({ actorUserId: req.user!.id, action: 'patient_archived', entityType: 'patient', entityId: req.params.id });
  return success(res, null, 'Patient archived');
};
