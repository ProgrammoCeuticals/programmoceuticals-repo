/**
 * RegulatoryResolver interface — spec §57 Rule 15, §4.3
 *
 * Resolves the exact regulatory profile (IG version, CV version, schema
 * checksums) for a given Submission Unit.
 *
 * A Submission Unit must resolve to a concrete regulatory profile containing
 * exact versions/checksums — never a generic "latest" configuration.
 */

export interface RegulatoryProfile {
  ectdStandardId: string;
  implementationGuideVersion: string;
  implementationGuideChecksum: string;
  controlledVocabularyVersion: string;
  controlledVocabularyChecksum: string;
  schemaPackageChecksum: string;
  regionalSpecificationId?: string | undefined;
  regionalSpecificationVersion?: string | undefined;
}

export interface RegulatoryResolver {
  /**
   * Resolve the exact regulatory profile for a Submission Unit.
   * Must never fall back silently to a newer package version.
   */
  resolveForSubmissionUnit(
    submissionUnitId: string,
  ): Promise<RegulatoryProfile>;

  /**
   * Validate that a code value exists in the specified code list version.
   * Returns false if the code is not found — never invents a valid code.
   */
  validateCodeValue(
    codeListId: string,
    version: string,
    code: string,
  ): Promise<boolean>;
}

export const REGULATORY_RESOLVER = Symbol("REGULATORY_RESOLVER");
