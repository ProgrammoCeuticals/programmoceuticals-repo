import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { error } from './response.util';

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const messages = (result.error as ZodError).errors
        .map(e => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      return error(res, messages, 422);
    }
    req.body = result.data;
    next();
  };
