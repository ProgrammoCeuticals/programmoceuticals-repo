/**
 * PublishingService interface — spec §30
 *
 * Publishing is NOT ZIP creation.
 *
 * Pipeline:
 *   Draft Submission Unit
 *   -> freeze snapshot
 *   -> resolve regulatory profile
 *   -> full validation
 *   -> publish gate
 *   -> generate XML
 *   -> XSD validation
 *   -> resolve document dispositions
 *   -> verify physical file checksums
 *   -> construct staging package
 *   -> validate package
 *   -> calculate package integrity values
 *   -> finalize atomically
 *   -> create immutable SubmissionPackage
 *   -> audit
 *   -> READY FOR TRANSMISSION
 *
 * A generated package is NOT the same thing as a transmitted submission.
 * Transmission is a separate subsystem (spec §32).
 * The core MVP stops at READY_FOR_TRANSMISSION.
 */

export interface PublishingService {
  /**
   * Freeze a Draft Submission Unit, creating an immutable snapshot.
   * Only DRAFT units can be frozen.
   */
  freeze(submissionUnitId: string, userId: string): Promise<void>;

  /**
   * Execute the full publication pipeline for a frozen, validated Submission Unit.
   * Must be atomic — failure rolls back the entire operation.
   */
  publish(
    submissionUnitId: string,
    userId: string,
  ): Promise<{ packageId: string }>;

  /**
   * Invalidate a published package.
   * Creates an audit event; does not delete the package record.
   */
  invalidate(packageId: string, reason: string, userId: string): Promise<void>;
}

export const PUBLISHING_SERVICE = Symbol("PUBLISHING_SERVICE");
