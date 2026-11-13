import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { AuthContext } from "../types/index.js";
import { unauthorized } from "../lib/response.js";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

const accessSecret = () => process.env.JWT_ACCESS_SECRET ?? "dev-access-secret";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    unauthorized(res);
    return;
  }

  try {
    req.auth = jwt.verify(token, accessSecret()) as AuthContext;
    next();
  } catch {
    unauthorized(res, "Invalid or expired token");
  }
}
