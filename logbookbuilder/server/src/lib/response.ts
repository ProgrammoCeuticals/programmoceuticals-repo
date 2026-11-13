import type { Response } from "express";
import type { ApiResponse, PaginatedResult } from "../types/index.js";

export function ok<T>(res: Response, data: T, status = 200): void {
  const body: ApiResponse<T> = { success: true, data };
  res.status(status).json(body);
}

export function created<T>(res: Response, data: T): void {
  ok(res, data, 201);
}

export function noContent(res: Response): void {
  res.status(204).send();
}

export function paginated<T>(res: Response, result: PaginatedResult<T>): void {
  const body: ApiResponse<PaginatedResult<T>> = { success: true, data: result };
  res.status(200).json(body);
}

export function fail(res: Response, message: string, status = 400): void {
  const body: ApiResponse = { success: false, message };
  res.status(status).json(body);
}

export function unauthorized(res: Response, message = "Authentication required"): void {
  fail(res, message, 401);
}

export function forbidden(res: Response, message = "Access denied"): void {
  fail(res, message, 403);
}

export function notFound(res: Response, entity = "Resource"): void {
  fail(res, `${entity} not found`, 404);
}

export function conflict(res: Response, message: string): void {
  fail(res, message, 409);
}

export function validationError(res: Response, errors: Record<string, string[]>): void {
  const body: ApiResponse = { success: false, message: "Validation failed", errors };
  res.status(422).json(body);
}

export function serverError(res: Response, message = "An unexpected error occurred"): void {
  fail(res, message, 500);
}
