import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import type { JwtPayload } from "../../modules/auth/auth.service";
import { PrismaService } from "../../modules/database/prisma.service";

/**
 * Permission guard — spec §40, §42.
 *
 * Authorization is always enforced server-side. Never authorize solely
 * from frontend state.
 *
 * Usage:
 *   @UseGuards(JwtAuthGuard, PermissionGuard)
 *   @RequirePermission('PUBLISH')
 *
 * Super Admins bypass permission checks for system-level operations — spec §41.
 * Super Admins still require explicit permissions for high-impact commands
 * such as publishing — spec §6A.1.
 */

export const PERMISSION_KEY = "required_permission";
export const RequirePermission = (
  permission: string,
): ClassDecorator & MethodDecorator => SetMetadata(PERMISSION_KEY, permission);

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string | undefined>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No permission requirement — pass through
    if (!required) return true;

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: JwtPayload }>();

    const user = request.user;

    // Super Admins have all permissions — spec §41
    if (user?.isSuperAdmin) return true;

    if (!user?.sub) throw new ForbiddenException("Not authenticated.");

    // Load user's permissions via role assignments
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId: user.sub },
      include: {
        role: {
          include: {
            permissions: { include: { permission: true } },
          },
        },
      },
    });

    const permissionCodes = new Set(
      userRoles.flatMap((ur) =>
        ur.role.permissions.map((rp) => rp.permission.code),
      ),
    );

    if (!permissionCodes.has(required)) {
      throw new ForbiddenException(
        `Permission "${required}" is required for this operation.`,
      );
    }

    return true;
  }
}
