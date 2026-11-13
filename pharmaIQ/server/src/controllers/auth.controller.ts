import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../config/database';
import { users } from '../models/schema';
import { signToken } from '../utils/jwt.util';
import { success, error } from '../utils/response.util';
import { audit } from '../utils/audit.util';
import { AuthRequest } from '../middleware/auth.middleware';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'pharmacist', 'assistant', 'reviewer']).optional(),
});

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return error(res, 'Email and password required', 400);

  const { email, password } = parsed.data;
  const [user] = await db.select().from(users).where(eq(users.email, email));

  // Generic message — do not reveal whether email exists
  if (!user || !user.isActive) {
    await audit({ action: 'login_failed', entityType: 'user', outcome: 'failure' });
    return error(res, 'Invalid credentials', 401);
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    await audit({ action: 'login_failed', entityType: 'user', entityId: user.id, outcome: 'failure' });
    return error(res, 'Invalid credentials', 401);
  }

  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));
  await audit({ actorUserId: user.id, action: 'login', entityType: 'user', entityId: user.id });

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  });

  return success(res, {
    token,
    user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
  });
};

export const register = async (req: AuthRequest, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
    return error(res, msg, 422);
  }

  const { firstName, lastName, email, password, role } = parsed.data;
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (existing) return error(res, 'Email already in use', 409);

  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db
    .insert(users)
    .values({ firstName, lastName, email, passwordHash, role: role ?? 'assistant' })
    .returning({ id: users.id, firstName: users.firstName, lastName: users.lastName, email: users.email, role: users.role });

  await audit({ actorUserId: req.user?.id, action: 'user_created', entityType: 'user', entityId: user.id });
  return success(res, user, 'User created', 201);
};

export const getMe = async (req: AuthRequest, res: Response) => {
  const [user] = await db
    .select({ id: users.id, firstName: users.firstName, lastName: users.lastName, email: users.email, role: users.role })
    .from(users)
    .where(eq(users.id, req.user!.id));
  if (!user) return error(res, 'User not found', 404);
  return success(res, user);
};
