import { z } from 'zod';

/**
 * Update institution profile (name, type, address, contact info).
 */
export const updateInstitutionSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  type: z.string().min(1).max(100).optional(),
  address: z.string().max(500).optional(),
  phone: z.string().max(30).optional(),
  website: z.string().url().optional().or(z.literal('')),
});

export type UpdateInstitutionDto = z.infer<typeof updateInstitutionSchema>;

/**
 * Create a new department within the tenant.
 */
export const createDepartmentSchema = z.object({
  name: z.string().min(1, 'Department name is required').max(255),
  parentId: z.string().uuid().optional(),
});

export type CreateDepartmentDto = z.infer<typeof createDepartmentSchema>;

/**
 * Update an existing department.
 */
export const updateDepartmentSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  parentId: z.string().uuid().nullable().optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
});

export type UpdateDepartmentDto = z.infer<typeof updateDepartmentSchema>;

/**
 * Create a new team within a department.
 */
export const createTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(255),
  departmentId: z.string().uuid('Department ID must be a valid UUID'),
});

export type CreateTeamDto = z.infer<typeof createTeamSchema>;
