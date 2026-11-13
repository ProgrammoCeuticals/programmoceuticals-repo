import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

/**
 * Unified API error contract — spec §35.
 *
 * All errors return:
 * {
 *   "error": {
 *     "code": "ERROR_CODE",
 *     "message": "...",
 *     "category": "DOMAIN|VALIDATION|AUTH|SYSTEM",
 *     "details": {},
 *     "correlationId": "..."
 *   }
 * }
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const correlationId =
      (request.headers["x-correlation-id"] as string | undefined) ?? uuidv4();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = "INTERNAL_SERVER_ERROR";
    let message = "An unexpected error occurred.";
    let category: "DOMAIN" | "VALIDATION" | "AUTH" | "SYSTEM" = "SYSTEM";
    let details: Record<string, unknown> = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === "object") {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp["message"] as string) ?? message;
        code = (resp["code"] as string) ?? this.statusToCode(status);
        category =
          (resp["category"] as "DOMAIN" | "VALIDATION" | "AUTH" | "SYSTEM") ??
          this.statusToCategory(status);
        details = (resp["details"] as Record<string, unknown>) ?? {};
      }

      code =
        code === "INTERNAL_SERVER_ERROR" ? this.statusToCode(status) : code;
      category = this.statusToCategory(status);
    } else if (exception instanceof Error) {
      this.logger.error(
        {
          event: "UNHANDLED_EXCEPTION",
          correlationId,
          path: request.url,
          error: exception.message,
          stack: exception.stack,
        },
        exception.message,
      );
    }

    response.status(status).json({
      error: {
        code,
        message,
        category,
        details,
        correlationId,
      },
    });
  }

  private statusToCode(status: number): string {
    const map: Record<number, string> = {
      400: "BAD_REQUEST",
      401: "UNAUTHORIZED",
      403: "FORBIDDEN",
      404: "NOT_FOUND",
      409: "CONFLICT",
      422: "UNPROCESSABLE_ENTITY",
      429: "TOO_MANY_REQUESTS",
      500: "INTERNAL_SERVER_ERROR",
    };
    return map[status] ?? "UNKNOWN_ERROR";
  }

  private statusToCategory(
    status: number,
  ): "DOMAIN" | "VALIDATION" | "AUTH" | "SYSTEM" {
    if (status === 401 || status === 403) return "AUTH";
    if (status === 400 || status === 422) return "VALIDATION";
    if (status >= 400 && status < 500) return "DOMAIN";
    return "SYSTEM";
  }
}
