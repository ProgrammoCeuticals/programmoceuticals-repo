import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Request } from "express";

/**
 * Wraps every response in the standard envelope:
 *   { data: T, meta: { requestId, timestamp } }
 *
 * For paginated responses that already carry their own meta
 * (i.e. the service returned { data: [], meta: { total, page, … } }),
 * we merge the requestId/timestamp into the existing meta instead of
 * double-wrapping.
 */
@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, unknown>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const requestId = req.requestId ?? "unknown";

    return next.handle().pipe(
      map((payload) => {
        // Already-paginated: { data: [...], meta: { total, page, pageSize, totalPages } }
        if (this.isPaginated(payload)) {
          const { data, meta } = payload as {
            data: unknown;
            meta: Record<string, unknown>;
          };
          return {
            data,
            meta: {
              ...meta,
              requestId,
              timestamp: new Date().toISOString(),
            },
          };
        }

        // Single-item or plain response
        return {
          data: payload,
          meta: {
            requestId,
            timestamp: new Date().toISOString(),
          },
        };
      }),
    );
  }

  private isPaginated(payload: unknown): boolean {
    if (payload === null || typeof payload !== "object") return false;
    const p = payload as Record<string, unknown>;
    return (
      Array.isArray(p["data"]) &&
      typeof p["meta"] === "object" &&
      p["meta"] !== null &&
      typeof (p["meta"] as Record<string, unknown>)["total"] === "number"
    );
  }
}
