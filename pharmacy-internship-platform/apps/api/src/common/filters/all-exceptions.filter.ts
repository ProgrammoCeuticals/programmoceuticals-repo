import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response } from "express";
import { ApiError } from "@pharmintern/shared-types";

/**
 * Normalises all exceptions into the standard ApiError shape:
 * { statusCode, error, message, code }
 *
 * Never leaks stack traces or raw Prisma messages in production.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "An unexpected error occurred";
    let code: ApiError["code"] = "INTERNAL_ERROR";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === "string"
          ? res
          : ((res as Record<string, unknown>)["message"]?.toString() ??
            message);
      code = this.codeFromStatus(status);
    } else if (this.isPrismaKnownError(exception)) {
      const prismaCode = (exception as { code: string }).code;
      if (prismaCode === "P2002") {
        status = HttpStatus.CONFLICT;
        message = "A record with these details already exists";
        code = "CONFLICT";
      } else if (prismaCode === "P2025") {
        status = HttpStatus.NOT_FOUND;
        message = "Record not found";
        code = "NOT_FOUND";
      } else {
        this.logger.error(`Prisma error ${prismaCode}`);
      }
    } else {
      this.logger.error(
        "Unhandled exception",
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const body: ApiError = {
      statusCode: status,
      error: HttpStatus[status] ?? "Error",
      message,
      code,
    };

    response.status(status).json(body);
  }

  // Type guard for Prisma known request errors (avoids importing Prisma types directly)
  private isPrismaKnownError(
    e: unknown,
  ): e is { code: string; meta?: unknown } {
    return (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      typeof (e as { code: unknown }).code === "string" &&
      (e as { code: string }).code.startsWith("P")
    );
  }

  private codeFromStatus(status: number): ApiError["code"] {
    switch (status) {
      case 400:
        return "VALIDATION_ERROR";
      case 401:
        return "UNAUTHORISED";
      case 403:
        return "FORBIDDEN";
      case 404:
        return "NOT_FOUND";
      case 409:
        return "CONFLICT";
      case 422:
        return "VALIDATION_ERROR";
      default:
        return "INTERNAL_ERROR";
    }
  }
}
