import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '@rims/shared-types';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Guard that allows access only to users with a 'Platform Super Admin' system role.
 * Requires JwtAuthGuard to have run first (user attached to request).
 */
@Injectable()
export class PlatformAdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('Platform admin access required');
    }

    const assignment = await this.prisma.userRoleAssignment.findFirst({
      where: {
        userId: user.sub,
        role: { name: 'Platform Super Admin', isSystem: true },
      },
      include: { role: true },
    });

    if (!assignment) {
      throw new ForbiddenException('Platform admin access required');
    }

    return true;
  }
}
