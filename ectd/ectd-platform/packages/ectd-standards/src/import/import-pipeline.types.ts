/**
 * Import pipeline types — spec §3.
 *
 * The import pipeline is:
 *   Receive package
 *     -> verify archive/checksum
 *     -> validate package structure
 *     -> parse metadata
 *     -> import schemas
 *     -> import code lists/Genericode
 *     -> import relevant configuration
 *     -> run consistency checks
 *     -> register immutable package
 *     -> activate ONLY after successful import
 *
 * A failed import must NEVER partially activate.
 * Once imported, source files are immutable — spec §3, §8.
 */

import { RegulatoryPackageType } from "../regulatory-package/regulatory-package-status";

export interface PackageImportRequest {
  /** SHA-256 checksum supplied by the submitter for pre-verification */
  expectedChecksum: string;
  /** Logical storage key where the archive has been placed in quarantine */
  storageKey: string;
  /** Original source filename (e.g. "ICH_eCTD_v40_IG_v1.7.zip") */
  sourceFilename: string;
  /** Source URI for provenance (e.g. ICH website URL) */
  sourceUri?: string | undefined;
  packageType: RegulatoryPackageType;
  name: string;
  version: string;
  /** Authority this package applies to (e.g. "FDA", "ICH") */
  authority?: string | undefined;
  /** Region code (e.g. "US", "ICH") */
  region?: string | undefined;
  effectiveDate?: Date | undefined;
  /** Idempotency key — spec §36 */
  idempotencyKey?: string | undefined;
  importedById?: string | undefined;
}

export type ImportStepStatus =
  | "PENDING"
  | "RUNNING"
  | "PASSED"
  | "FAILED"
  | "SKIPPED";

export interface ImportStep {
  name: string;
  status: ImportStepStatus;
  message?: string | undefined;
  durationMs?: number | undefined;
}

export type ImportOutcome = "SUCCESS" | "FAILED";

export interface PackageImportResult {
  outcome: ImportOutcome;
  artifactId?: string | undefined;
  steps: ImportStep[];
  errorMessage?: string | undefined;
  /**
   * Verified SHA-256 checksum of the actual archive.
   * Must match expectedChecksum for the import to succeed.
   */
  verifiedChecksum?: string | undefined;
}

/** Named steps in the import pipeline — used for structured progress reporting */
export const IMPORT_STEPS = {
  VERIFY_CHECKSUM: "VERIFY_CHECKSUM",
  VALIDATE_STRUCTURE: "VALIDATE_STRUCTURE",
  PARSE_METADATA: "PARSE_METADATA",
  IMPORT_SCHEMAS: "IMPORT_SCHEMAS",
  IMPORT_CODE_LISTS: "IMPORT_CODE_LISTS",
  IMPORT_CONFIGURATION: "IMPORT_CONFIGURATION",
  CONSISTENCY_CHECKS: "CONSISTENCY_CHECKS",
  REGISTER_PACKAGE: "REGISTER_PACKAGE",
} as const;

export type ImportStepName = (typeof IMPORT_STEPS)[keyof typeof IMPORT_STEPS];
