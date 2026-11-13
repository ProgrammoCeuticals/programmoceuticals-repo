/**
 * DocumentDispositionResolver — spec §30.
 *
 * Determines whether each document in a Submission Unit should be:
 *   INCLUDE   — physical file included in the submission package
 *   REFERENCE — referenced by logical ID only (file not included)
 *   EXCLUDE   — not present in this submission
 *
 * "Do not include every historical Document blindly." — spec §30.
 *
 * REGULATORY_GAP: The exact rules for when INCLUDE vs REFERENCE vs EXCLUDE
 * applies must come from:
 *   - ICH eCTD v4.0 Implementation Guide v1.7
 *   - Applicable regional Technical Conformance Guide (e.g. FDA TCG)
 *
 * The current implementation uses conservative defaults:
 *   - ACTIVE CoU with a current document version → INCLUDE
 *   - SUSPENDED CoU → EXCLUDE (already deactivated)
 *   - Document with no versions → EXCLUDE (blocks publish gate anyway)
 *
 * A future extension point exists for regional disposition rules.
 */

export type DocumentDisposition = "INCLUDE" | "REFERENCE" | "EXCLUDE";

export interface DocumentToResolve {
  contextOfUseId: string;
  couStatus: string;
  documentId: string;
  hasVersion: boolean;
  currentVersionStorageKey?: string | undefined;
  /** Whether this document is a reuse reference (not physically in this sequence) */
  isReuse?: boolean | undefined;
}

export interface DispositionResult {
  contextOfUseId: string;
  documentId: string;
  disposition: DocumentDisposition;
  storageKey?: string | undefined;
  reason: string;
}

/**
 * Resolve the disposition for each document in a Submission Unit.
 *
 * REGULATORY_GAP: Full disposition logic requires ICH IG v1.7 and
 * applicable regional TCG. Conservative defaults applied here.
 */
export function resolveDocumentDispositions(
  documents: DocumentToResolve[],
): DispositionResult[] {
  return documents.map((doc) => {
    // SUSPENDED CoU — document should not appear in this sequence
    if (doc.couStatus === "SUSPENDED") {
      return {
        contextOfUseId: doc.contextOfUseId,
        documentId: doc.documentId,
        disposition: "EXCLUDE",
        reason: "Context of Use is SUSPENDED — document excluded from package.",
      };
    }

    // No physical version — cannot include
    if (!doc.hasVersion || !doc.currentVersionStorageKey) {
      return {
        contextOfUseId: doc.contextOfUseId,
        documentId: doc.documentId,
        disposition: "EXCLUDE",
        reason:
          "Document has no uploaded version — excluded. " +
          "(Blocked at gate; should not reach disposition step.)",
      };
    }

    // Reuse — REGULATORY_GAP: exact reuse disposition from IG v1.7
    if (doc.isReuse) {
      return {
        contextOfUseId: doc.contextOfUseId,
        documentId: doc.documentId,
        disposition: "REFERENCE",
        reason:
          "Document is marked as reuse. " +
          "REGULATORY_GAP: Confirm REFERENCE vs INCLUDE for reuse from ICH IG v1.7.",
      };
    }

    // Default: include physical file
    return {
      contextOfUseId: doc.contextOfUseId,
      documentId: doc.documentId,
      disposition: "INCLUDE",
      storageKey: doc.currentVersionStorageKey,
      reason: "Active CoU with physical document version — included.",
    };
  });
}
