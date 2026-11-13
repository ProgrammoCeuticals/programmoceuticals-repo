import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http.js";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      issues: error.issues,
    });
    return;
  }

  const statusCode = error instanceof HttpError ? error.statusCode : 500;

  res.status(statusCode).json({
    message: error.message || "Internal server error",
    ...(env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  });
};
