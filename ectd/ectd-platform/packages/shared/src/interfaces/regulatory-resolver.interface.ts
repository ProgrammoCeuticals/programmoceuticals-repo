/**
 * RegulatoryResolver interface — spec §57 Rule 15, §4.3.
 *
 * Resolves the exact regulatory profile for a Submission Unit.
 * A Submission Unit must resolve to a concrete regulatory profile
 * containing exact package versions/checksums — spec §2.
 *
 * Never use a generic "latest" config while validating a historical
 * Submission Unit — spec §2.
 */

export interface ResolvedRegulatoryProfile {
  ectdStandardId: string;
  ectdStandardVersion: string;
  implementationGuideVersion: string;
  implementationGuideChecksum: string;
  controlledVocabularyVersion: string;
  controlledVocabularyChecksum: string;
  schemaPackageChecksum: string;
  regionalSpecificationId?: string;
  regionalSpecificationVersion?: string;
  ctdStructurePackageId?: string;
  resolvedAt: Date;
}

export interface RegulatoryResolver {
  /**
   * Resolve the regulatory profile for a given Submission Unit.
   * Returns the exact pinned versions/checksums of all regulatory packages.
   * Throws if the profile cannot be resolved or packages are missing.
   */
  resolveProfile(submissionUnitId: string): Promise<ResolvedRegulatoryProfile>;

  /**
   * Resolve profile for a historical snapshot (for reproducibility).
   */
  resolveProfileForSnapshot(
    snapshotId: string,
  ): Promise<ResolvedRegulatoryProfile>;
}
