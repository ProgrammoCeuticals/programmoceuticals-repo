import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { env } from "../config/env.js";
import type { USER_ROLES } from "../constants/workflow.js";
import { db } from "../db/client.js";
import { users } from "../db/schema.js";
import { HttpError } from "../utils/http.js";

type JwtPayload = {
  sub: string;
};

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

    if (!token) {
      throw new HttpError(401, "Authentication required");
    }

    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    const [user] = await db.select().from(users).where(eq(users.id, payload.sub)).limit(1);

    if (!user || !user.isActive) {
      throw new HttpError(401, "Invalid authentication token");
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };

    next();
  } catch (error) {
    next(error instanceof HttpError ? error : new HttpError(401, "Invalid authentication token"));
  }
};

export const requireRoles =
  (...roles: Array<(typeof USER_ROLES)[number]>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new HttpError(401, "Authentication required"));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new HttpError(403, "You do not have permission to perform this action"));
      return;
    }

    next();
  };
