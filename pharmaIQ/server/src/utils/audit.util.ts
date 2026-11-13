import { db } from '../config/database';
import { auditLogs } from '../models/schema';

interface AuditParams {
  actorUserId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  outcome?: 'success' | 'failure';
  reason?: string;
  correlationId?: string;
  safeMetadata?: Record<string, unknown>;
}

export const audit = async (params: AuditParams): Promise<void> => {
  try {
    await db.insert(auditLogs).values({
      actorUserId: params.actorUserId ?? null,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId ?? null,
      outcome: params.outcome ?? 'success',
      reason: params.reason ?? null,
      correlationId: params.correlationId ?? null,
      safeMetadata: params.safeMetadata ?? null,
    });
  } catch {
    // Audit failure must never crash a clinical operation — log to stderr only
    console.error('[audit] Failed to write audit log', params.action, params.entityType);
  }
};
