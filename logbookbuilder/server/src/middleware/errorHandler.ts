import type { Request, Response, NextFunction } from "express";
import { serverError } from "../lib/response.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const message = err instanceof Error ? err.message : "Unexpected server error";
  console.error("[error]", err);

  if (message.includes("duplicate key") || message.includes("unique constraint")) {
    res.status(409).json({ success: false, message: "A record with that value already exists" });
    return;
  }

  serverError(res, message);
}
