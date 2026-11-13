import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * Ensures that a tenant has been resolved for the current request.
 * Must be used after TenantMiddleware has run.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    if (!req.tenant) {
      throw new ForbiddenException('No tenant context for this request');
    }
    return true;
  }
}
