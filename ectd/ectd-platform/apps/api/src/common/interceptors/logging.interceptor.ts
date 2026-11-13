import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

/**
 * Structured request/response logging — spec §45.
 *
 * Logs: timestamp, level, service, event, correlationId, method, path,
 *       statusCode, durationMs.
 * Never logs: passwords, tokens, document contents, secrets.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP");

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const correlationId =
      (req.headers["x-correlation-id"] as string | undefined) ?? uuidv4();

    // Attach correlationId to request for downstream use
    (req as Request & { correlationId: string }).correlationId = correlationId;

    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse<Response>();
          this.logger.log({
            event: "HTTP_REQUEST",
            correlationId,
            method: req.method,
            path: req.url,
            statusCode: res.statusCode,
            durationMs: Date.now() - start,
          });
        },
        error: (err: unknown) => {
          const res = context.switchToHttp().getResponse<Response>();
          this.logger.error({
            event: "HTTP_REQUEST_ERROR",
            correlationId,
            method: req.method,
            path: req.url,
            statusCode: res.statusCode,
            durationMs: Date.now() - start,
            error: err instanceof Error ? err.message : String(err),
          });
        },
      }),
    );
  }
}
