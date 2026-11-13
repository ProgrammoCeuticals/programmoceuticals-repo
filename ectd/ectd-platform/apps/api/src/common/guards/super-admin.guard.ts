import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Request } from "express";
import type { JwtPayload } from "../../modules/auth/auth.service";

/**
 * SuperAdminGuard — spec §41, §42.
 *
 * SUPER_ADMIN is a system-level role distinct from ORGANIZATION_ADMIN.
 * This guard verifies isSuperAdmin flag from the JWT payload.
 *
 * Authorization is always enforced server-side — spec §42.
 * Never authorize solely from frontend UI state.
 */
@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: JwtPayload }>();

    const user = request.user;

    if (!user?.isSuperAdmin) {
      throw new ForbiddenException(
        "This operation requires Super Admin privileges.",
      );
    }

    return true;
  }
}
