import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { ResolvedTenant } from '../../modules/tenant/tenant.middleware';

/**
 * Extracts the resolved tenant from the request object.
 * Requires TenantMiddleware to have run and TenantGuard to be applied.
 */
export const CurrentTenant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ResolvedTenant | undefined => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return req.tenant;
  },
);
