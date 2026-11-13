import { z } from "zod";
import { eq, and, ilike, count } from "drizzle-orm";
import { db } from "../../db/index.js";
import { personnel } from "../../db/schema.js";
import { auditAsync } from "../../lib/audit.js";
import { parsePagination, buildPaginatedResult } from "../../lib/utils.js";
import type { AuthContext } from "../../types/index.js";

export const createPersonnelSchema = z.object({
  name: z.string().min(2).max(100),
  identifier: z.string().max(50).optional(),
  role: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  linkedUserId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const updatePersonnelSchema = createPersonnelSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export async function listPersonnelService(auth: AuthContext, query: Record<string, unknown>) {
  const { page, limit, offset } = parsePagination(query);
  const search = String(query.search ?? "");

  const where = search
    ? and(eq(personnel.organizationId, auth.organizationId), ilike(personnel.name, `%${search}%`))
    : eq(personnel.organizationId, auth.organizationId);

  const [total, items] = await Promise.all([
    db.select({ count: count() }).from(personnel).where(where),
    db.query.personnel.findMany({ where, limit, offset, orderBy: (p, { asc }) => [asc(p.name)] }),
  ]);

  return buildPaginatedResult(items, total[0].count, page, limit);
}

export async function getPersonnelService(auth: AuthContext, personnelId: string) {
  const person = await db.query.personnel.findFirst({
    where: and(eq(personnel.id, personnelId), eq(personnel.organizationId, auth.organizationId)),
    with: { linkedUser: true },
  });
  if (!person) throw new Error("Personnel record not found");
  return person;
}

export async function createPersonnelService(
  auth: AuthContext,
  input: z.infer<typeof createPersonnelSchema>
) {
  const [person] = await db.insert(personnel).values({
    organizationId: auth.organizationId,
    name: input.name,
    identifier: input.identifier,
    role: input.role,
    department: input.department,
    email: input.email,
    phone: input.phone,
    linkedUserId: input.linkedUserId,
    metadata: input.metadata ?? {},
  }).returning();

  auditAsync({
    auth,
    eventType: "personnel_created",
    entityType: "personnel",
    entityId: person.id,
    summary: `Personnel record created for "${person.name}"`,
    newState: person,
  });

  return person;
}

export async function updatePersonnelService(
  auth: AuthContext,
  personnelId: string,
  input: z.infer<typeof updatePersonnelSchema>
) {
  const person = await db.query.personnel.findFirst({
    where: and(eq(personnel.id, personnelId), eq(personnel.organizationId, auth.organizationId)),
  });
  if (!person) throw new Error("Personnel record not found");

  const [updated] = await db.update(personnel)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(personnel.id, personnelId))
    .returning();

  auditAsync({
    auth,
    eventType: "personnel_updated",
    entityType: "personnel",
    entityId: personnelId,
    summary: `Personnel record for "${person.name}" updated`,
    previousState: person,
    newState: updated,
  });

  return updated;
}
