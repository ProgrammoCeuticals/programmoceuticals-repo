import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq, and, ilike, count } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { auditAsync } from "../../lib/audit.js";
import { parsePagination, buildPaginatedResult } from "../../lib/utils.js";
import type { AuthContext } from "../../types/index.js";

export const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});

function safeUser(user: typeof users.$inferSelect) {
  const { passwordHash, refreshTokenHash, ...safe } = user;
  return safe;
}

export async function listUsersService(auth: AuthContext, query: Record<string, unknown>) {
  const { page, limit, offset } = parsePagination(query);
  const search = String(query.search ?? "");

  const where = search
    ? and(eq(users.organizationId, auth.organizationId), ilike(users.name, `%${search}%`))
    : eq(users.organizationId, auth.organizationId);

  const [total, items] = await Promise.all([
    db.select({ count: count() }).from(users).where(where),
    db.query.users.findMany({ where, limit, offset, orderBy: (u, { asc }) => [asc(u.name)] }),
  ]);

  return buildPaginatedResult(items.map(safeUser), total[0].count, page, limit);
}

export async function getUserService(auth: AuthContext, userId: string) {
  const user = await db.query.users.findFirst({
    where: and(eq(users.id, userId), eq(users.organizationId, auth.organizationId)),
  });
  if (!user) throw new Error("User not found");
  return safeUser(user);
}

export async function createUserService(auth: AuthContext, input: z.infer<typeof createUserSchema>) {
  const existing = await db.query.users.findFirst({ where: eq(users.email, input.email.toLowerCase()) });
  if (existing) throw new Error("An account with this email already exists");

  const passwordHash = await bcrypt.hash(input.password, 12);
  const [user] = await db.insert(users).values({
    organizationId: auth.organizationId,
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash,
  }).returning();

  auditAsync({
    auth,
    eventType: "user_created",
    entityType: "user",
    entityId: user.id,
    summary: `User "${user.name}" created by ${auth.name}`,
    newState: safeUser(user),
  });

  return safeUser(user);
}

export async function updateUserService(
  auth: AuthContext,
  userId: string,
  input: z.infer<typeof updateUserSchema>
) {
  const user = await db.query.users.findFirst({
    where: and(eq(users.id, userId), eq(users.organizationId, auth.organizationId)),
  });
  if (!user) throw new Error("User not found");

  const [updated] = await db.update(users)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();

  auditAsync({
    auth,
    eventType: "user_updated",
    entityType: "user",
    entityId: userId,
    summary: `User "${user.name}" updated by ${auth.name}`,
    previousState: safeUser(user),
    newState: safeUser(updated),
  });

  return safeUser(updated);
}

export async function changePasswordService(
  auth: AuthContext,
  input: z.infer<typeof changePasswordSchema>
) {
  const user = await db.query.users.findFirst({ where: eq(users.id, auth.userId) });
  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!valid) throw new Error("Current password is incorrect");

  const passwordHash = await bcrypt.hash(input.newPassword, 12);
  await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, auth.userId));

  auditAsync({
    auth,
    eventType: "user_updated",
    entityType: "user",
    entityId: auth.userId,
    summary: `${auth.name} changed their password`,
  });
}
