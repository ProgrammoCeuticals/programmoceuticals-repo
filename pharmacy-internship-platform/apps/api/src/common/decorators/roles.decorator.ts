import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@pharmintern/shared-types';

export const ROLES_KEY = 'roles';

/**
 * Marks a route as requiring one of the specified platform roles.
 * Usage: @Roles(UserRole.PLATFORM_ADMIN, UserRole.EMPLOYER_STAFF)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
