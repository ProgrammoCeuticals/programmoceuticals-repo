import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../config/database';
import { users } from '../models/schema';
import { success, error } from '../utils/response.util';
import { AuthRequest } from '../middleware/auth.middleware';
import { audit } from '../utils/audit.util';

const createSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'pharmacist', 'assistant', 'reviewer']),
});

const updateSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  role: z.enum(['admin', 'pharmacist', 'assistant', 'reviewer']).optional(),
  isActive: z.boolean().optional(),
});

const cols = {
  id: users.id, firstName: users.firstName, lastName: users.lastName,
  email: users.email, role: users.role, isActive: users.isActive,
  lastLoginAt: users.lastLoginAt, createdAt: users.createdAt,
};

export const listUsers = async (_req: Request, res: Response) => {
  const rows = await db.select(cols).from(users).orderBy(users.createdAt);
  return success(res, rows);
};

export const createUser = async (req: AuthRequest, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => e.message).join('; '), 422);

  const { firstName, lastName, email, password, role } = parsed.data;
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (existing) return error(res, 'Email already in use', 409);

  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db.insert(users).values({ firstName, lastName, email, passwordHash, role }).returning(cols);
  await audit({ actorUserId: req.user?.id, action: 'user_created', entityType: 'user', entityId: user.id });
  return success(res, user, 'User created', 201);
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return error(res, parsed.error.errors.map(e => e.message).join('; '), 422);

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.id, id));
  if (!existing) return error(res, 'User not found', 404);

  const [updated] = await db.update(users).set({ ...parsed.data, updatedAt: new Date() }).where(eq(users.id, id)).returning(cols);
  await audit({ actorUserId: req.user?.id, action: 'user_updated', entityType: 'user', entityId: id });
  return success(res, updated);
};

export const deactivateUser = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (id === req.user?.id) return error(res, 'Cannot deactivate your own account', 400);
  const [updated] = await db.update(users).set({ isActive: false, updatedAt: new Date() }).where(eq(users.id, id)).returning(cols);
  if (!updated) return error(res, 'User not found', 404);
  await audit({ actorUserId: req.user?.id, action: 'user_deactivated', entityType: 'user', entityId: id });
  return success(res, updated);
};
