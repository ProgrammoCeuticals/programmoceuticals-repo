import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "../db/client.js";
import { applicantProfiles, users } from "../db/schema.js";
import { HttpError, asyncHandler } from "../utils/http.js";
import { signAccessToken } from "../utils/tokens.js";

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

export const registerApplicant = asyncHandler(async (req: Request, res: Response) => {
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, req.body.email)).limit(1);

  if (existing.length > 0) {
    throw new HttpError(409, "A user with this email already exists");
  }

  const passwordHash = await bcrypt.hash(req.body.password, 12);

  const [user] = await db
    .insert(users)
    .values({
      fullName: req.body.fullName,
      email: req.body.email.toLowerCase(),
      phone: req.body.phone,
      passwordHash,
      role: "applicant",
    })
    .returning();

  await db.insert(applicantProfiles).values({
    userId: user.id,
    companyName: req.body.companyName,
    contactPersonName: req.body.contactPersonName,
    contactPersonTitle: req.body.contactPersonTitle,
    companyEmail: req.body.companyEmail,
    companyPhone: req.body.companyPhone,
    companyAddress: req.body.companyAddress,
    rcNumber: req.body.rcNumber,
    marketAuthorisationHolder: req.body.marketAuthorisationHolder,
  });

  res.status(201).json({
    token: signAccessToken(user.id),
    user: publicUser(user),
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const [user] = await db.select().from(users).where(eq(users.email, req.body.email.toLowerCase())).limit(1);

  if (!user || !user.isActive) {
    throw new HttpError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(req.body.password, user.passwordHash);

  if (!passwordMatches) {
    throw new HttpError(401, "Invalid email or password");
  }

  await db.update(users).set({ lastLoginAt: new Date(), updatedAt: new Date() }).where(eq(users.id, user.id));

  res.json({
    token: signAccessToken(user.id),
    user: publicUser(user),
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const [user] = await db.select().from(users).where(eq(users.id, req.user!.id)).limit(1);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  res.json({ user: publicUser(user) });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.status(204).send();
});
