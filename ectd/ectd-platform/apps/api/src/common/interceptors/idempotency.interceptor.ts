import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { Request } from "express";

/**
 * IdempotencyInterceptor — spec §36.
 *
 * Reads the Idempotency-Key header and attaches it to the request
 * so services can use it for deduplication.
 *
 * Spec §36: Support Idempotency-Key for significant operations:
 *   - validation requests
 *   - XML generation requests
 *   - package publication
 *   - regulatory package import
 *
 * A retry of the same logical operation must not create duplicate artifacts.
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { idempotencyKey?: string | undefined }>();

    const key = request.headers["idempotency-key"];
    if (typeof key === "string" && key.length > 0) {
      request.idempotencyKey = key;
    }

    return next.handle().pipe(
      tap({
        // Could cache responses by key in a future enhancement
      }),
    );
  }
}
