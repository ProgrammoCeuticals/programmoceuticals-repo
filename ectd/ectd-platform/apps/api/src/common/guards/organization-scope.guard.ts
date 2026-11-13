import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Request } from "express";
import type { JwtPayload } from "../../modules/auth/auth.service";

/**
 * OrganizationScopeGuard — spec §42.
 *
 * Every organization-owned query must be scoped to the authenticated
 * organization unless the caller has Super Admin privileges.
 *
 * This guard verifies that the JWT contains a non-null orgId, or that
 * the user is a Super Admin who can operate across organizations.
 *
 * Object-level authorization is mandatory — spec §42.
 */
@Injectable()
export class OrganizationScopeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: JwtPayload }>();

    const user = request.user;

    // Super Admin can cross organization boundaries
    if (user?.isSuperAdmin) return true;

    // Regular users must belong to an organization
    if (!user?.orgId) {
      throw new ForbiddenException(
        "This operation requires an organization context. " +
          "Your account is not associated with an organization.",
      );
    }

    return true;
  }
}
