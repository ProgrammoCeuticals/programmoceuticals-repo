/**
 * Lifecycle domain errors — spec §15, §4.5.
 *
 * These are domain errors, not HTTP errors. The NestJS layer maps them to
 * appropriate HTTP status codes. Domain logic throws these.
 *
 * All lifecycle invariant violations must use typed errors so the calling
 * layer can distinguish between different failure modes.
 */

export type LifecycleErrorCode =
  | "NOT_ACTIVE"
  | "ALREADY_SUSPENDED"
  | "ALREADY_OBSOLETE"
  | "SELF_REPLACEMENT"
  | "SOURCE_SUSPENDED"
  | "TARGET_SUSPENDED"
  | "CONTEXT_GROUP_MISMATCH"
  | "CARDINALITY_VIOLATION"
  | "UNIT_PUBLISHED"
  | "DOCUMENT_NOT_FOUND"
  | "DOCUMENT_NO_VERSION"
  | "REGULATORY_GAP";

export class LifecycleError extends Error {
  constructor(
    public readonly code: LifecycleErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "LifecycleError";
  }
}

export class SuspensionError extends LifecycleError {
  constructor(code: LifecycleErrorCode, message: string) {
    super(code, message);
    this.name = "SuspensionError";
  }
}

export class ReplacementError extends LifecycleError {
  constructor(code: LifecycleErrorCode, message: string) {
    super(code, message);
    this.name = "ReplacementError";
  }
}
