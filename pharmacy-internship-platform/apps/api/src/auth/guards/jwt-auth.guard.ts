import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Apply to any route that requires an authenticated user.
 * Validates the Bearer JWT and attaches the payload to request.user.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
