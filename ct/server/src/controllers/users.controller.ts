import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "../db/client.js";
import { users } from "../db/schema.js";
import { HttpError, asyncHandler } from "../utils/http.js";

const publicUser = (user: typeof users.$inferSelect) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isActive: user.isActive,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, req.body.email)).limit(1);
  if (existing.length > 0) throw new HttpError(409, "A user with this email already exists");

  const passwordHash = await bcrypt.hash(req.body.password, 12);
  const [user] = await db
    .insert(users)
    .values({ fullName: req.body.fullName, email: req.body.email.toLowerCase(), phone: req.body.phone, passwordHash, role: req.body.role })
    .returning();

  res.status(201).json({ user: publicUser(user) });
});

export const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  const rows = await db.select().from(users).orderBy(users.fullName);
  res.json({ users: rows.map(publicUser) });
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) throw new HttpError(404, "User not found");
  res.json({ user: publicUser(user) });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const [user] = await db
    .update(users)
    .set({ ...req.body, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
  if (!user) throw new HttpError(404, "User not found");
  res.json({ user: publicUser(user) });
});

// Any authenticated user can update their own name/phone
export const updateOwnProfile = asyncHandler(async (req: Request, res: Response) => {
  const [user] = await db
    .update(users)
    .set({ fullName: req.body.fullName, phone: req.body.phone, updatedAt: new Date() })
    .where(eq(users.id, req.user!.id))
    .returning();
  res.json({ user: publicUser(user) });
});

// Any authenticated user can change their own password
export const changeOwnPassword = asyncHandler(async (req: Request, res: Response) => {
  const [user] = await db.select().from(users).where(eq(users.id, req.user!.id)).limit(1);
  if (!user) throw new HttpError(404, "User not found");

  const matches = await bcrypt.compare(req.body.currentPassword, user.passwordHash);
  if (!matches) throw new HttpError(400, "Current password is incorrect");

  const passwordHash = await bcrypt.hash(req.body.newPassword, 12);
  await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, user.id));

  res.json({ message: "Password changed successfully" });
});

export const deactivateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const [user] = await db
    .update(users)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
  if (!user) throw new HttpError(404, "User not found");
  res.json({ user: publicUser(user) });
});

export const reactivateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const [user] = await db
    .update(users)
    .set({ isActive: true, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
  if (!user) throw new HttpError(404, "User not found");
  res.json({ user: publicUser(user) });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  if (userId === req.user!.id) throw new HttpError(400, "You cannot delete your own account");
  await db.delete(users).where(eq(users.id, userId));
  res.status(204).send();
});
