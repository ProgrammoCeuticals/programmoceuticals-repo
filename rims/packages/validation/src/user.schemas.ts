import { z } from 'zod';

/**
 * Invite a new user to the tenant.
 */
export const inviteUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  roleIds: z.array(z.string().uuid()).optional(),
});

export type InviteUserDto = z.infer<typeof inviteUserSchema>;

/**
 * Update an existing user's profile or status.
 */
export const updateUserSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'DEACTIVATED']).optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
