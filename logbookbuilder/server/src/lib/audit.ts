import { db } from "../db/index.js";
import { auditEvents } from "../db/schema.js";
import type { AuditEventType } from "../db/schema.js";
import type { AuthContext } from "../types/index.js";

interface AuditParams {
  auth: AuthContext | null;
  eventType: AuditEventType;
  entityType: string;
  entityId?: string;
  summary: string;
  previousState?: unknown;
  newState?: unknown;
  metadata?: Record<string, unknown>;
}

export async function audit(params: AuditParams): Promise<void> {
  await db.insert(auditEvents).values({
    organizationId: params.auth?.organizationId ?? "system",
    userId: params.auth?.userId ?? null,
    eventType: params.eventType,
    entityType: params.entityType,
    entityId: params.entityId ?? null,
    summary: params.summary,
    previousState: params.previousState ?? null,
    newState: params.newState ?? null,
    metadata: params.metadata ?? {},
  });
}

// Fire-and-forget variant — does not block the response
export function auditAsync(params: AuditParams): void {
  audit(params).catch((err) => {
    console.error("[audit] Failed to write audit event:", err);
  });
}
