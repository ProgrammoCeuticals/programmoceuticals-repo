import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { error } from '../utils/response.util';

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string; firstName: string; lastName: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return error(res, 'Unauthorized', 401);
  try {
    req.user = verifyToken(token) as AuthRequest['user'];
    next();
  } catch {
    return error(res, 'Invalid or expired token', 401);
  }
};

export const authorize = (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) return error(res, 'Forbidden', 403);
    next();
  };
