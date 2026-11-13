/**
 * DocumentUploadPipeline — spec §16, §43, user requirement.
 *
 * Upload pipeline:
 *   upload
 *     -> QUARANTINE   (buffer staged before any writes to trusted storage)
 *     -> SIZE_VALIDATION
 *     -> MIME_MAGIC_BYTE_VALIDATION
 *     -> MALWARE_SCAN           ← REQUIRED; BLOCKS if scanner not configured
 *     -> CHECKSUM_COMPUTATION
 *     -> IMMUTABLE_STORE
 *
 * MALWARE_SCAN is not optional. If the scanner is not configured, the
 * upload FAILS with SCANNER_NOT_CONFIGURED. Production upload is blocked
 * until a real scanner is installed — user requirement.
 *
 * To enable uploads: set ECTD_CLAMAV_URL and inject a ClamAvScanner.
 */

import {
  computeChecksum,
  CHECKSUM_ALGORITHM,
} from "../checksum/checksum.service";
import { validateMime } from "./mime-validator";
import {
  NullMalwareScanner,
  SCANNER_NOT_CONFIGURED,
  SCANNER_INFECTED,
  SCANNER_ERROR,
  type MalwareScanner,
} from "./malware-scanner.interface";
import type { StorageService } from "@ectd/shared";

/**
 * Build a content-addressable storage key.
 * Format: <first-8-of-sha256>/<full-sha256>/<sanitized-filename>
 */
export function buildStorageKey(checksum: string, filename: string): string {
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 200);
  return `${checksum.slice(0, 8)}/${checksum}/${sanitized}`;
}

export interface UploadInput {
  buffer: Buffer;
  originalFilename: string;
  declaredMimeType: string;
  language?: string | undefined;
  maxSizeBytes?: number | undefined;
}

export type UploadStepStatus = "PASSED" | "FAILED" | "SKIPPED";

export interface UploadStep {
  name: string;
  status: UploadStepStatus;
  message?: string | undefined;
}

export type UploadOutcome = "SUCCESS" | "FAILED";

export interface UploadResult {
  outcome: UploadOutcome;
  storageKey?: string | undefined;
  checksum?: string | undefined;
  checksumAlgorithm?: string | undefined;
  fileSize?: number | undefined;
  detectedMimeType?: string | undefined;
  steps: UploadStep[];
  errorMessage?: string | undefined;
}

const DEFAULT_MAX_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB

export const UPLOAD_STEPS = {
  QUARANTINE: "QUARANTINE",
  SIZE_VALIDATION: "SIZE_VALIDATION",
  MIME_VALIDATION: "MIME_MAGIC_BYTE_VALIDATION",
  MALWARE_SCAN: "MALWARE_SCAN",
  CHECKSUM: "CHECKSUM_COMPUTATION",
  STORE: "IMMUTABLE_STORE",
} as const;

export class DocumentUploadPipeline {
  private readonly scanner: MalwareScanner;

  constructor(
    private readonly storage: StorageService,
    scanner?: MalwareScanner,
  ) {
    // Default to NullMalwareScanner which blocks all uploads.
    // Pass a configured ClamAvScanner (or equivalent) to enable uploads.
    this.scanner = scanner ?? new NullMalwareScanner();
  }

  async execute(input: UploadInput): Promise<UploadResult> {
    const steps: UploadStep[] = [];
    const maxSize = input.maxSizeBytes ?? DEFAULT_MAX_SIZE_BYTES;

    const pass = (name: string, msg?: string): void => {
      steps.push({ name, status: "PASSED", message: msg });
    };
    const fail = (name: string, msg: string): UploadResult => {
      steps.push({ name, status: "FAILED", message: msg });
      return { outcome: "FAILED", steps, errorMessage: msg };
    };

    // ── QUARANTINE ────────────────────────────────────────────────────────
    // Buffer is held in memory as the quarantine zone.
    // It must NOT be written to trusted storage until all checks pass.
    pass(UPLOAD_STEPS.QUARANTINE, "File received in quarantine.");

    // ── SIZE VALIDATION ───────────────────────────────────────────────────
    if (input.buffer.length === 0) {
      return fail(UPLOAD_STEPS.SIZE_VALIDATION, "File is empty.");
    }
    if (input.buffer.length > maxSize) {
      return fail(
        UPLOAD_STEPS.SIZE_VALIDATION,
        `File size ${input.buffer.length} bytes exceeds maximum ${maxSize} bytes.`,
      );
    }
    pass(UPLOAD_STEPS.SIZE_VALIDATION);

    // ── MIME / MAGIC-BYTE VALIDATION ──────────────────────────────────────
    const mimeResult = validateMime(input.buffer, input.declaredMimeType);
    if (!mimeResult.valid) {
      return fail(
        UPLOAD_STEPS.MIME_VALIDATION,
        mimeResult.message ?? "MIME validation failed.",
      );
    }
    pass(UPLOAD_STEPS.MIME_VALIDATION);

    // ── MALWARE SCAN ──────────────────────────────────────────────────────
    // REQUIRED. Blocks if scanner is not configured or scan fails.
    // This is NOT a skippable step — spec §16, §43, user requirement.
    if (!this.scanner.isConfigured()) {
      return fail(
        UPLOAD_STEPS.MALWARE_SCAN,
        "SCANNER_NOT_CONFIGURED: No malware scanner is configured. " +
          "Set ECTD_CLAMAV_URL (ClamAV daemon) or equivalent. " +
          "Production document upload is blocked until a scanner is installed.",
      );
    }

    const scanResult = await this.scanner.scan(
      input.buffer,
      input.originalFilename,
    );

    if (scanResult.status === SCANNER_NOT_CONFIGURED) {
      return fail(
        UPLOAD_STEPS.MALWARE_SCAN,
        scanResult.message ?? "Scanner not configured.",
      );
    }

    if (scanResult.status === SCANNER_INFECTED) {
      return fail(
        UPLOAD_STEPS.MALWARE_SCAN,
        `File rejected — malware detected: ${scanResult.threatName ?? "unknown threat"}. ` +
          "The file has been discarded from quarantine.",
      );
    }

    if (scanResult.status === SCANNER_ERROR) {
      // Treat scan errors as blocking — fail closed per spec §4.5
      return fail(
        UPLOAD_STEPS.MALWARE_SCAN,
        `Malware scan error: ${scanResult.message ?? "scanner returned an error"}. ` +
          "Upload blocked — scanner must be healthy before accepting files.",
      );
    }

    pass(
      UPLOAD_STEPS.MALWARE_SCAN,
      `Scan clean (engine: ${scanResult.engineVersion ?? "unknown"}).`,
    );

    // ── CHECKSUM ──────────────────────────────────────────────────────────
    const checksumResult = computeChecksum(input.buffer);
    pass(UPLOAD_STEPS.CHECKSUM);

    // ── IMMUTABLE STORE ───────────────────────────────────────────────────
    const storageKey = buildStorageKey(
      checksumResult.checksum,
      input.originalFilename,
    );

    try {
      await this.storage.put(storageKey, input.buffer, {
        mimeType: input.declaredMimeType,
      });
    } catch (err) {
      return fail(
        UPLOAD_STEPS.STORE,
        `Failed to store file: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
    pass(UPLOAD_STEPS.STORE);

    return {
      outcome: "SUCCESS",
      storageKey,
      checksum: checksumResult.checksum,
      checksumAlgorithm: CHECKSUM_ALGORITHM,
      fileSize: checksumResult.sizeBytes,
      detectedMimeType: mimeResult.detectedMimeType ?? undefined,
      steps,
    };
  }
}
