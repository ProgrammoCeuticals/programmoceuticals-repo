import { eq, and, desc, count } from "drizzle-orm";
import { db } from "../../db/index.js";
import { auditEvents } from "../../db/schema.js";
import { parsePagination, buildPaginatedResult } from "../../lib/utils.js";
import type { AuthContext } from "../../types/index.js";

export async function listAuditEventsService(auth: AuthContext, query: Record<string, unknown>) {
  const { page, limit, offset } = parsePagination(query);
  const eventType = query.eventType as string | undefined;
  const entityType = query.entityType as string | undefined;
  const entityId = query.entityId as string | undefined;
  const userId = query.userId as string | undefined;

  const conditions = [eq(auditEvents.organizationId, auth.organizationId)];
  if (eventType) conditions.push(eq(auditEvents.eventType, eventType as typeof auditEvents.eventType._.data));
  if (entityType) conditions.push(eq(auditEvents.entityType, entityType));
  if (entityId) conditions.push(eq(auditEvents.entityId, entityId));
  if (userId) conditions.push(eq(auditEvents.userId, userId));

  const where = and(...conditions);

  const [total, items] = await Promise.all([
    db.select({ count: count() }).from(auditEvents).where(where),
    db.query.auditEvents.findMany({
      where,
      limit,
      offset,
      orderBy: (e, { desc }) => [desc(e.createdAt)],
      with: { user: true },
    }),
  ]);

  return buildPaginatedResult(items, total[0].count, page, limit);
}

export async function getAuditEventService(auth: AuthContext, eventId: string) {
  const event = await db.query.auditEvents.findFirst({
    where: and(eq(auditEvents.id, eventId), eq(auditEvents.organizationId, auth.organizationId)),
    with: { user: true },
  });
  if (!event) throw new Error("Audit event not found");
  return event;
}
