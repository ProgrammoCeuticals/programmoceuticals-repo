import { z } from "zod";

export const userIdParamSchema = z.object({
  params: z.object({ userId: z.string().uuid() }),
});

export const createUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string().min(8),
    role: z.enum(["assessor", "admin", "super_admin"]),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({ userId: z.string().uuid() }),
  body: z.object({
    fullName: z.string().min(2).optional(),
    phone: z.string().optional().nullable(),
    role: z.enum(["assessor", "admin", "super_admin"]).optional(),
  }),
});

export const updateOwnProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    phone: z.string().optional().nullable(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
  }),
});
