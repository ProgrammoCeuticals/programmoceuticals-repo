import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const requestId = req.requestId || 'unknown';
    const isProduction = process.env['NODE_ENV'] === 'production';

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected error occurred';
    let details: unknown = undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exResponse = exception.getResponse();

      if (typeof exResponse === 'string') {
        message = exResponse;
        code = exception.constructor.name
          .replace(/Exception$/, '')
          .replace(/([A-Z])/g, (m) => `_${m}`)
          .toUpperCase()
          .replace(/^_/, '');
      } else if (typeof exResponse === 'object' && exResponse !== null) {
        const r = exResponse as Record<string, unknown>;
        message = (r['message'] as string) || message;
        code = (r['error'] as string) || HttpStatus[statusCode] || code;
        // class-validator puts validation errors in message array
        if (Array.isArray(r['message'])) {
          details = r['message'];
          message = 'Validation failed';
        }
      }
    } else if (exception instanceof Error) {
      // Never expose internal error details in production
      if (!isProduction) {
        message = exception.message;
      }
      this.logger.error(`Unhandled exception: ${exception.message}`, exception.stack);
    }

    res.status(statusCode).json({
      error: {
        code,
        message,
        ...(details !== undefined ? { details } : {}),
        requestId,
      },
    });
  }
}
