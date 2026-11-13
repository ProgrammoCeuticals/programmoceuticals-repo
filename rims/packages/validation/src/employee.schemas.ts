import { z } from 'zod';

/**
 * Create a new employee record.
 */
export const createEmployeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email().optional(),
  departmentId: z.string().uuid('Department ID must be a valid UUID').optional(),
  positionId: z.string().uuid('Position ID must be a valid UUID').optional(),
  hireDate: z.coerce.date().optional(),
  userId: z.string().uuid().optional(),
});

export type CreateEmployeeDto = z.infer<typeof createEmployeeSchema>;

/**
 * Update an existing employee record.
 */
export const updateEmployeeSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  departmentId: z.string().uuid().nullable().optional(),
  positionId: z.string().uuid().nullable().optional(),
  hireDate: z.coerce.date().optional(),
  status: z.enum(['ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED', 'ARCHIVED']).optional(),
});

export type UpdateEmployeeDto = z.infer<typeof updateEmployeeSchema>;
