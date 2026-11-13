import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../guards/jwt-auth.guard';

/**
 * Marks a route handler as public — the JwtAuthGuard will skip token validation.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
