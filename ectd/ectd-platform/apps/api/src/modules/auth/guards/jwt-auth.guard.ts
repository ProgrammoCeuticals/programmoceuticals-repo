import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Standard JWT guard — attaches validated payload to request.user.
 * Use this on any endpoint requiring authentication.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
