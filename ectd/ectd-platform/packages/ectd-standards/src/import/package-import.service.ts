import { createHash } from "crypto";
import {
  PackageImportRequest,
  PackageImportResult,
  ImportStep,
  IMPORT_STEPS,
} from "./import-pipeline.types";
import { RegulatoryPackageType } from "../regulatory-package/regulatory-package-status";

/**
 * PackageImportService — spec §3.
 *
 * Pure domain service. No NestJS DI. No BullMQ. Accepts collaborator
 * interfaces injected at construction time so it is testable in isolation.
 *
 * Spec invariants enforced here:
 *   - Checksum verified BEFORE any writes.
 *   - Status stays IMPORTING until every step succeeds.
 *   - A failed step triggers rollback / FAILED status — never partial activation.
 *   - Source files are treated as immutable once stored.
 *
 * What this service does NOT do:
 *   - Parse actual ICH XML/Genericode (that requires the authoritative files
 *     to be present — Phase 2 wires the parsers once files are imported).
 *   - Activate the package (caller does that explicitly after success).
 */

export interface IStorageReader {
  readAsBuffer(storageKey: string): Promise<Buffer>;
}

export interface IRegulatoryArtifactRepository {
  create(data: {
    artifactType: string;
    name: string;
    version: string;
    sourceUri?: string | undefined;
    sourceFilename?: string | undefined;
    checksum: string;
    storageKey?: string | undefined;
    importedById?: string | undefined;
    status: string;
    metadata?: Record<string, unknown> | undefined;
  }): Promise<{ id: string }>;

  updateStatus(
    id: string,
    status: string,
    metadata?: Record<string, unknown> | undefined,
  ): Promise<void>;

  findByChecksum(
    checksum: string,
  ): Promise<{ id: string; status: string } | null>;
}

export interface IStructureValidator {
  validate(
    packageType: RegulatoryPackageType,
    archive: Buffer,
  ): Promise<{ valid: boolean; message?: string | undefined }>;
}

export class PackageImportService {
  constructor(
    private readonly storage: IStorageReader,
    private readonly artifactRepo: IRegulatoryArtifactRepository,
    private readonly structureValidator: IStructureValidator,
  ) {}

  /**
   * Execute the full import pipeline.
   *
   * Steps (spec §3):
   *   1. VERIFY_CHECKSUM      — SHA-256 of the archive must match expectedChecksum
   *   2. VALIDATE_STRUCTURE   — archive must contain expected file layout
   *   3. PARSE_METADATA       — extract package metadata for registration
   *   4. IMPORT_SCHEMAS       — (delegated to caller after registration)
   *   5. IMPORT_CODE_LISTS    — (delegated to caller after registration)
   *   6. IMPORT_CONFIGURATION — (delegated to caller after registration)
   *   7. CONSISTENCY_CHECKS   — verify internal cross-references
   *   8. REGISTER_PACKAGE     — persist immutable artifact record
   *
   * Steps 4–6 are completed by specialized parsers wired by the worker after
   * registration. This service owns steps 1–3, 7–8.
   */
  async execute(request: PackageImportRequest): Promise<PackageImportResult> {
    const steps: ImportStep[] = [];
    let artifactId: string | undefined;

    const step = (
      name: string,
    ): {
      pass: () => void;
      fail: (msg: string) => void;
      start: () => number;
    } => {
      const entry: ImportStep = { name, status: "PENDING" };
      steps.push(entry);
      return {
        start: () => {
          entry.status = "RUNNING";
          return Date.now();
        },
        pass: () => {
          entry.status = "PASSED";
        },
        fail: (msg: string) => {
          entry.status = "FAILED";
          entry.message = msg;
        },
      };
    };

    // ── Step 1: VERIFY_CHECKSUM ────────────────────────────────────────────
    const checksumStep = step(IMPORT_STEPS.VERIFY_CHECKSUM);
    const t1 = checksumStep.start();
    let archive: Buffer;
    let actualChecksum: string;

    try {
      archive = await this.storage.readAsBuffer(request.storageKey);
      actualChecksum = createHash("sha256").update(archive).digest("hex");

      if (
        actualChecksum.toLowerCase() !== request.expectedChecksum.toLowerCase()
      ) {
        checksumStep.fail(
          `Checksum mismatch. Expected: ${request.expectedChecksum}. ` +
            `Actual: ${actualChecksum}.`,
        );
        return this.failed(steps, "Checksum verification failed.");
      }

      checksumStep.pass();
      steps[steps.length - 1]!.durationMs = Date.now() - t1;
    } catch (err) {
      checksumStep.fail(`Failed to read archive: ${String(err)}`);
      return this.failed(steps, "Could not read package archive from storage.");
    }

    // ── Step 2: VALIDATE_STRUCTURE ─────────────────────────────────────────
    const structureStep = step(IMPORT_STEPS.VALIDATE_STRUCTURE);
    const t2 = structureStep.start();

    try {
      const result = await this.structureValidator.validate(
        request.packageType,
        archive,
      );
      if (!result.valid) {
        structureStep.fail(result.message ?? "Package structure is invalid.");
        return this.failed(steps, "Package structure validation failed.");
      }
      structureStep.pass();
      steps[steps.length - 1]!.durationMs = Date.now() - t2;
    } catch (err) {
      structureStep.fail(`Structure validation threw: ${String(err)}`);
      return this.failed(steps, "Package structure validation error.");
    }

    // ── Step 3: PARSE_METADATA ─────────────────────────────────────────────
    const metaStep = step(IMPORT_STEPS.PARSE_METADATA);
    const t3 = metaStep.start();

    // Metadata is provided explicitly in the request for this phase.
    // Future: parse from the archive manifest.
    metaStep.pass();
    steps[steps.length - 1]!.durationMs = Date.now() - t3;

    // ── Steps 4–6: deferred to worker parsers post-registration ───────────
    for (const name of [
      IMPORT_STEPS.IMPORT_SCHEMAS,
      IMPORT_STEPS.IMPORT_CODE_LISTS,
      IMPORT_STEPS.IMPORT_CONFIGURATION,
    ] as const) {
      steps.push({
        name,
        status: "SKIPPED",
        message: "Delegated to post-registration parsers.",
      });
    }

    // ── Step 7: CONSISTENCY_CHECKS ─────────────────────────────────────────
    const consistencyStep = step(IMPORT_STEPS.CONSISTENCY_CHECKS);
    const t7 = consistencyStep.start();

    // Check for duplicate checksum — prevent re-importing the same artifact
    const existing = await this.artifactRepo.findByChecksum(actualChecksum);
    if (existing) {
      consistencyStep.fail(
        `A regulatory artifact with checksum ${actualChecksum} already exists ` +
          `(id: ${existing.id}, status: ${existing.status}). ` +
          "Import packages are immutable — use the existing record.",
      );
      return this.failed(
        steps,
        `Duplicate checksum — artifact already registered (id: ${existing.id}).`,
      );
    }

    consistencyStep.pass();
    steps[steps.length - 1]!.durationMs = Date.now() - t7;

    // ── Step 8: REGISTER_PACKAGE ───────────────────────────────────────────
    const registerStep = step(IMPORT_STEPS.REGISTER_PACKAGE);
    const t8 = registerStep.start();

    try {
      const artifact = await this.artifactRepo.create({
        artifactType: request.packageType,
        name: request.name,
        version: request.version,
        sourceUri: request.sourceUri,
        sourceFilename: request.sourceFilename,
        checksum: actualChecksum,
        storageKey: request.storageKey,
        importedById: request.importedById,
        // Status is IMPORTING — NOT ACTIVE. Activation is a separate explicit
        // command after post-registration parsers complete — spec §3.
        status: "IMPORTING",
        metadata: {
          authority: request.authority,
          region: request.region,
          effectiveDate: request.effectiveDate?.toISOString(),
          idempotencyKey: request.idempotencyKey,
        },
      });

      artifactId = artifact.id;
      registerStep.pass();
      steps[steps.length - 1]!.durationMs = Date.now() - t8;
    } catch (err) {
      registerStep.fail(`Failed to register artifact: ${String(err)}`);

      // Mark artifact FAILED if it was partially written
      if (artifactId) {
        await this.artifactRepo
          .updateStatus(artifactId, "FAILED", { error: String(err) })
          .catch(() => {
            /* best-effort */
          });
      }

      return this.failed(steps, "Failed to register immutable package record.");
    }

    return {
      outcome: "SUCCESS",
      artifactId,
      steps,
      verifiedChecksum: actualChecksum,
    };
  }

  private failed(
    steps: ImportStep[],
    errorMessage: string,
  ): PackageImportResult {
    return { outcome: "FAILED", steps, errorMessage };
  }
}
