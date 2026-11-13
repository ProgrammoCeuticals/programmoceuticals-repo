import { SetMetadata } from '@nestjs/common';

export const REQUIRE_PERMISSIONS_KEY = 'requiredPermissions';

/**
 * Marks a route handler as requiring specific RBAC permissions.
 * The PermissionsGuard reads this metadata to enforce access.
 *
 * @example
 *   @RequirePermissions('audit.view', 'audit.export')
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(REQUIRE_PERMISSIONS_KEY, permissions);
