import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "../../db/index.js";
import { divisions, users } from "../../db/schema.js";
import { auditAsync } from "../../lib/audit.js";
import type { AuthContext } from "../../types/index.js";

export const createDivisionSchema = z.object({
  name: z.string().min(2).max(100),
});

export const updateDivisionSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  isActive: z.boolean().optional(),
});

export const assignUserSchema = z.object({
  userId: z.string().min(1),
  divisionId: z.string().nullable(),
});

function requireAdmin(auth: AuthContext) {
  if (!auth.isAdmin) throw new Error("Admin access required");
}

export async function listDivisionsService(auth: AuthContext) {
  return db.query.divisions.findMany({
    where: eq(divisions.organizationId, auth.organizationId),
    orderBy: (d, { asc }) => [asc(d.name)],
    with: { users: { columns: { id: true, name: true, email: true, divisionId: true, isAdmin: true, status: true } } },
  });
}

export async function createDivisionService(auth: AuthContext, input: z.infer<typeof createDivisionSchema>) {
  requireAdmin(auth);
  const [division] = await db.insert(divisions).values({
    organizationId: auth.organizationId,
    name: input.name,
  }).returning();

  auditAsync({
    auth,
    eventType: "config_changed",
    entityType: "division",
    entityId: division.id,
    summary: `Division "${division.name}" created by ${auth.name}`,
    newState: division,
  });

  return division;
}

export async function updateDivisionService(auth: AuthContext, divisionId: string, input: z.infer<typeof updateDivisionSchema>) {
  requireAdmin(auth);
  const division = await db.query.divisions.findFirst({
    where: and(eq(divisions.id, divisionId), eq(divisions.organizationId, auth.organizationId)),
  });
  if (!division) throw new Error("Division not found");

  const [updated] = await db.update(divisions)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(divisions.id, divisionId))
    .returning();

  auditAsync({
    auth,
    eventType: "config_changed",
    entityType: "division",
    entityId: divisionId,
    summary: `Division "${division.name}" updated by ${auth.name}`,
    previousState: division,
    newState: updated,
  });

  return updated;
}

export async function deleteDivisionService(auth: AuthContext, divisionId: string) {
  requireAdmin(auth);
  const division = await db.query.divisions.findFirst({
    where: and(eq(divisions.id, divisionId), eq(divisions.organizationId, auth.organizationId)),
  });
  if (!division) throw new Error("Division not found");

  await db.delete(divisions).where(eq(divisions.id, divisionId));

  auditAsync({
    auth,
    eventType: "config_changed",
    entityType: "division",
    entityId: divisionId,
    summary: `Division "${division.name}" deleted by ${auth.name}`,
    previousState: division,
  });
}

export async function assignUserDivisionService(auth: AuthContext, input: z.infer<typeof assignUserSchema>) {
  requireAdmin(auth);

  if (input.divisionId) {
    const division = await db.query.divisions.findFirst({
      where: and(eq(divisions.id, input.divisionId), eq(divisions.organizationId, auth.organizationId)),
    });
    if (!division) throw new Error("Division not found");
  }

  const user = await db.query.users.findFirst({
    where: and(eq(users.id, input.userId), eq(users.organizationId, auth.organizationId)),
  });
  if (!user) throw new Error("User not found");

  const [updated] = await db.update(users)
    .set({ divisionId: input.divisionId, updatedAt: new Date() })
    .where(eq(users.id, input.userId))
    .returning();

  auditAsync({
    auth,
    eventType: "user_updated",
    entityType: "user",
    entityId: input.userId,
    summary: `${auth.name} assigned ${user.name} to division ${input.divisionId ?? "none"}`,
    previousState: { divisionId: user.divisionId },
    newState: { divisionId: updated.divisionId },
  });

  return updated;
}
