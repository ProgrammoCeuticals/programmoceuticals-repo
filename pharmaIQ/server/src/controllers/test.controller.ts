import { Response } from 'express';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../config/database';
import { testOrders, testResults } from '../models/schema';
import { success, error } from '../utils/response.util';
import { audit } from '../utils/audit.util';
import { AuthRequest } from '../middleware/auth.middleware';

const orderSchema = z.object({
  testName: z.string().min(1).max(255),
  encounterId: z.string().uuid().optional().nullable(),
  facility: z.string().max(255).optional().nullable(),
  notes: z.string().optional().nullable(),
});

const resultSchema = z.object({
  testOrderId: z.string().uuid().optional().nullable(),
  encounterId: z.string().uuid().optional().nullable(),
  testName: z.string().min(1).max(255),
  resultValue: z.string().optional().nullable(),
  unit: z.string().max(100).optional().nullable(),
  referenceRange: z.string().max(255).optional().nullable(),
  specimenType: z.string().max(100).optional().nullable(),
  collectedAt: z.string().optional().nullable(),
  resultAt: z.string().optional().nullable(),
  facility: z.string().max(255).optional().nullable(),
  status: z.enum(['preliminary', 'final', 'amended', 'reviewed']).default('preliminary'),
  followUpAction: z.string().optional().nullable(),
  amendsResultId: z.string().uuid().optional().nullable(),
});

export const getTestOrders = async (req: AuthRequest, res: Response) => {
  const list = await db.select().from(testOrders)
    .where(eq(testOrders.patientId, req.params.patientId))
    .orderBy(desc(testOrders.requestedAt));
  return success(res, list);
};

export const createTestOrder = async (req: AuthRequest, res: Response) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);
  const d = parsed.data;
  const [record] = await db.insert(testOrders).values({
    patientId: req.params.patientId,
    testName: d.testName,
    encounterId: d.encounterId ?? null,
    facility: d.facility ?? null,
    notes: d.notes ?? null,
    requestedBy: req.user!.id,
  }).returning();
  await audit({ actorUserId: req.user!.id, action: 'test_order_created', entityType: 'test_order', entityId: record.id });
  return success(res, record, 'Test order created', 201);
};

export const updateTestOrderStatus = async (req: AuthRequest, res: Response) => {
  const schema = z.object({ status: z.enum(['requested', 'collected', 'in_progress', 'result_available', 'cancelled']) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return error(res, 'Invalid status', 422);
  const [existing] = await db.select({ id: testOrders.id }).from(testOrders).where(eq(testOrders.id, req.params.id));
  if (!existing) return error(res, 'Test order not found', 404);
  const [record] = await db.update(testOrders).set({ status: parsed.data.status }).where(eq(testOrders.id, req.params.id)).returning();
  await audit({ actorUserId: req.user!.id, action: 'test_order_updated', entityType: 'test_order', entityId: record.id });
  return success(res, record);
};

export const getTestResults = async (req: AuthRequest, res: Response) => {
  const list = await db.select().from(testResults)
    .where(eq(testResults.patientId, req.params.patientId))
    .orderBy(desc(testResults.resultAt));
  return success(res, list);
};

export const addTestResult = async (req: AuthRequest, res: Response) => {
  const parsed = resultSchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '), 422);
  const d = parsed.data;
  const [record] = await db.insert(testResults).values({
    patientId: req.params.patientId,
    testName: d.testName,
    testOrderId: d.testOrderId ?? null,
    encounterId: d.encounterId ?? null,
    resultValue: d.resultValue ?? null,
    unit: d.unit ?? null,
    referenceRange: d.referenceRange ?? null,
    specimenType: d.specimenType ?? null,
    collectedAt: d.collectedAt ? new Date(d.collectedAt) : null,
    resultAt: d.resultAt ? new Date(d.resultAt) : null,
    facility: d.facility ?? null,
    status: d.status,
    followUpAction: d.followUpAction ?? null,
    previousResultId: d.amendsResultId ?? null,
  }).returning();
  if (d.amendsResultId) {
    await db.update(testResults).set({ status: 'amended' }).where(eq(testResults.id, d.amendsResultId));
  }
  await audit({ actorUserId: req.user!.id, action: 'test_result_added', entityType: 'test_result', entityId: record.id });
  return success(res, record, 'Test result recorded', 201);
};
