import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq, and } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users, organizations } from "../../db/schema.js";
import { auditAsync } from "../../lib/audit.js";
import type { AuthContext } from "../../types/index.js";
import { randomUUID } from "node:crypto";
import { createHash } from "node:crypto";

const accessSecret = () => process.env.JWT_ACCESS_SECRET ?? "dev-access-secret";
const refreshSecret = () => process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret";

export const registerSchema = z.object({
  organizationName: z.string().min(2).max(100),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function signAccess(ctx: AuthContext): string {
  return jwt.sign(ctx, accessSecret(), { expiresIn: "15m" });
}

function signRefresh(ctx: AuthContext): string {
  return jwt.sign(ctx, refreshSecret(), { expiresIn: "7d" });
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function registerService(input: z.infer<typeof registerSchema>) {
  const existing = await db.query.users.findFirst({
    where: eq(users.email, input.email.toLowerCase()),
  });
  if (existing) throw new Error("An account with this email already exists");

  const passwordHash = await bcrypt.hash(input.password, 12);

  let slug = slugify(input.organizationName);
  const slugExists = await db.query.organizations.findFirst({
    where: eq(organizations.slug, slug),
  });
  if (slugExists) slug = `${slug}-${randomUUID().slice(0, 6)}`;

  const [org] = await db.insert(organizations).values({
    name: input.organizationName,
    slug,
  }).returning();

  const [user] = await db.insert(users).values({
    organizationId: org.id,
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash,
    isAdmin: true,
  }).returning();

  const ctx: AuthContext = {
    userId: user.id,
    organizationId: org.id,
    divisionId: null,
    isAdmin: true,
    email: user.email,
    name: user.name,
  };

  const accessToken = signAccess(ctx);
  const refreshToken = signRefresh(ctx);

  await db.update(users)
    .set({ refreshTokenHash: hashToken(refreshToken) })
    .where(eq(users.id, user.id));

  auditAsync({
    auth: ctx,
    eventType: "user_registered",
    entityType: "user",
    entityId: user.id,
    summary: `${user.name} registered and created organization "${org.name}"`,
    newState: { userId: user.id, organizationId: org.id },
  });

  return { accessToken, refreshToken, user: ctx };
}

export async function loginService(input: z.infer<typeof loginSchema>) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, input.email.toLowerCase()),
  });

  if (!user || user.status !== "active") {
    auditAsync({
      auth: null,
      eventType: "user_login_failed",
      entityType: "user",
      summary: `Failed login attempt for email: ${input.email}`,
      metadata: { email: input.email },
    });
    throw new Error("Invalid email or password");
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    auditAsync({
      auth: null,
      eventType: "user_login_failed",
      entityType: "user",
      entityId: user.id,
      summary: `Failed login attempt for ${user.email}`,
    });
    throw new Error("Invalid email or password");
  }

  const ctx: AuthContext = {
    userId: user.id,
    organizationId: user.organizationId,
    divisionId: user.divisionId ?? null,
    isAdmin: user.isAdmin,
    email: user.email,
    name: user.name,
  };

  const accessToken = signAccess(ctx);
  const refreshToken = signRefresh(ctx);

  await db.update(users)
    .set({ refreshTokenHash: hashToken(refreshToken), lastLoginAt: new Date() })
    .where(eq(users.id, user.id));

  auditAsync({
    auth: ctx,
    eventType: "user_login",
    entityType: "user",
    entityId: user.id,
    summary: `${user.name} logged in`,
  });

  return { accessToken, refreshToken, user: ctx };
}

export async function refreshService(input: z.infer<typeof refreshSchema>) {
  let payload: AuthContext;
  try {
    payload = jwt.verify(input.refreshToken, refreshSecret()) as AuthContext;
  } catch {
    throw new Error("Invalid or expired refresh token");
  }

  const user = await db.query.users.findFirst({
    where: and(eq(users.id, payload.userId), eq(users.organizationId, payload.organizationId)),
  });

  if (!user || user.status !== "active") throw new Error("Invalid or expired refresh token");

  const tokenHash = hashToken(input.refreshToken);
  if (user.refreshTokenHash !== tokenHash) throw new Error("Invalid or expired refresh token");

  const ctx: AuthContext = {
    userId: user.id,
    organizationId: user.organizationId,
    divisionId: user.divisionId ?? null,
    isAdmin: user.isAdmin,
    email: user.email,
    name: user.name,
  };

  const accessToken = signAccess(ctx);
  const newRefreshToken = signRefresh(ctx);

  await db.update(users)
    .set({ refreshTokenHash: hashToken(newRefreshToken) })
    .where(eq(users.id, user.id));

  auditAsync({
    auth: ctx,
    eventType: "token_refreshed",
    entityType: "user",
    entityId: user.id,
    summary: `Token refreshed for ${user.name}`,
  });

  return { accessToken, refreshToken: newRefreshToken };
}

export async function logoutService(auth: AuthContext): Promise<void> {
  await db.update(users)
    .set({ refreshTokenHash: null })
    .where(eq(users.id, auth.userId));

  auditAsync({
    auth,
    eventType: "user_logout",
    entityType: "user",
    entityId: auth.userId,
    summary: `${auth.name} logged out`,
  });
}
