import {
  RegulatoryProfile,
  RegulatoryResolver,
} from "../interfaces/regulatory-resolver.interface";

/**
 * RegulatoryResolverService — spec §2, §57 Rule 15.
 *
 * Resolves the exact regulatory profile for a Submission Unit.
 *
 * Critical rule (spec §2):
 *   Never use a generic "latest" configuration while validating a historical
 *   Submission Unit. The profile must be pinned to exact package checksums.
 *
 * This service is pure domain logic. It depends on a repository interface,
 * not directly on Prisma, so it can be unit-tested in isolation.
 */

export interface ISubmissionUnitProfileRepository {
  findSubmissionUnit(id: string): Promise<{
    ectdStandardId: string;
    regionalSpecificationId?: string | null | undefined;
  } | null>;

  findEctdStandard(id: string): Promise<{
    name: string;
    version: string;
    implementationGuideId?: string | null | undefined;
  } | null>;

  findImplementationGuide(id: string): Promise<{
    version: string;
    checksum?: string | null | undefined;
    sourceArtifactId?: string | null | undefined;
  } | null>;

  findControlledVocabularyForStandard(standardId: string): Promise<{
    version: string;
    checksum?: string | null | undefined;
    sourceArtifactId?: string | null | undefined;
  } | null>;

  findArtifact(id: string): Promise<{
    checksum: string;
    status: string;
  } | null>;

  findRegionalSpecification(id: string): Promise<{
    name: string;
    version: string;
  } | null>;
}

export class RegulatoryResolverService implements RegulatoryResolver {
  constructor(private readonly repo: ISubmissionUnitProfileRepository) {}

  /**
   * Resolve the regulatory profile for a Submission Unit.
   *
   * Throws if:
   *   - The Submission Unit does not exist.
   *   - The EctdStandard has no Implementation Guide linked.
   *   - The Implementation Guide artifact has no verified checksum.
   *   - The Controlled Vocabulary package has no verified checksum.
   *   - Any artifact is in FAILED or IMPORTING status (not yet ACTIVE).
   *
   * Spec §4.5 — Fail closed: missing schema or unresolved identifier blocks.
   */
  async resolveForSubmissionUnit(
    submissionUnitId: string,
  ): Promise<RegulatoryProfile> {
    const unit = await this.repo.findSubmissionUnit(submissionUnitId);
    if (!unit) {
      throw new Error(
        `RegulatoryResolver: SubmissionUnit "${submissionUnitId}" not found. ` +
          "Cannot resolve regulatory profile.",
      );
    }

    const standard = await this.repo.findEctdStandard(unit.ectdStandardId);
    if (!standard) {
      throw new Error(
        `RegulatoryResolver: EctdStandard "${unit.ectdStandardId}" not found.`,
      );
    }

    // ── Implementation Guide ───────────────────────────────────────────────
    if (!standard.implementationGuideId) {
      throw new Error(
        `RegulatoryResolver: EctdStandard "${standard.name} ${standard.version}" ` +
          "has no Implementation Guide linked. Import the IG package first.",
      );
    }

    const ig = await this.repo.findImplementationGuide(
      standard.implementationGuideId,
    );
    if (!ig) {
      throw new Error(
        `RegulatoryResolver: ImplementationGuide "${standard.implementationGuideId}" not found.`,
      );
    }

    // Resolve IG artifact checksum
    let igChecksum = ig.checksum ?? null;
    if (!igChecksum && ig.sourceArtifactId) {
      const artifact = await this.repo.findArtifact(ig.sourceArtifactId);
      if (!artifact) {
        throw new Error(
          `RegulatoryResolver: Source artifact "${ig.sourceArtifactId}" for IG not found.`,
        );
      }
      if (artifact.status !== "ACTIVE") {
        throw new Error(
          `RegulatoryResolver: IG artifact "${ig.sourceArtifactId}" is not ACTIVE ` +
            `(status: ${artifact.status}). Activate the package before use.`,
        );
      }
      igChecksum = artifact.checksum;
    }

    if (!igChecksum) {
      throw new Error(
        `RegulatoryResolver: No checksum available for Implementation Guide ` +
          `"${ig.version}". Package may not be fully imported.`,
      );
    }

    // ── Controlled Vocabulary ──────────────────────────────────────────────
    const cv = await this.repo.findControlledVocabularyForStandard(
      unit.ectdStandardId,
    );
    if (!cv) {
      throw new Error(
        `RegulatoryResolver: No Controlled Vocabulary package linked to ` +
          `EctdStandard "${unit.ectdStandardId}". Import the CV package first.`,
      );
    }

    let cvChecksum = cv.checksum ?? null;
    if (!cvChecksum && cv.sourceArtifactId) {
      const artifact = await this.repo.findArtifact(cv.sourceArtifactId);
      if (!artifact) {
        throw new Error(
          `RegulatoryResolver: Source artifact "${cv.sourceArtifactId}" for CV not found.`,
        );
      }
      if (artifact.status !== "ACTIVE") {
        throw new Error(
          `RegulatoryResolver: CV artifact "${cv.sourceArtifactId}" is not ACTIVE ` +
            `(status: ${artifact.status}). Activate the package before use.`,
        );
      }
      cvChecksum = artifact.checksum;
    }

    if (!cvChecksum) {
      throw new Error(
        `RegulatoryResolver: No checksum available for Controlled Vocabulary ` +
          `"${cv.version}". Package may not be fully imported.`,
      );
    }

    // ── Regional Specification ─────────────────────────────────────────────
    let regionalSpecificationId: string | undefined;
    let regionalSpecificationVersion: string | undefined;

    if (unit.regionalSpecificationId) {
      const regional = await this.repo.findRegionalSpecification(
        unit.regionalSpecificationId,
      );
      if (!regional) {
        throw new Error(
          `RegulatoryResolver: RegionalSpecification "${unit.regionalSpecificationId}" ` +
            "not found. Register the regional profile before use.",
        );
      }
      regionalSpecificationId = unit.regionalSpecificationId;
      regionalSpecificationVersion = regional.version;
    }

    return {
      ectdStandardId: unit.ectdStandardId,
      implementationGuideVersion: ig.version,
      implementationGuideChecksum: igChecksum,
      controlledVocabularyVersion: cv.version,
      controlledVocabularyChecksum: cvChecksum,
      // Schema package checksum: same artifact as IG for combined IG+schema packages,
      // or resolved separately if the schema was imported independently.
      // For now, use IG artifact checksum as schema package checksum.
      // REGULATORY_GAP: If ICH distributes schema separately from IG in future,
      // this must be updated to resolve separately.
      schemaPackageChecksum: igChecksum,
      regionalSpecificationId,
      regionalSpecificationVersion,
    };
  }

  /**
   * Validate that a code value exists in a code list at a specific version.
   * Returns false rather than throwing for unknown codes.
   */
  async validateCodeValue(
    _codeListId: string,
    _version: string,
    _code: string,
  ): Promise<boolean> {
    // TODO Phase 8: implement code list value lookup from imported CV package
    // REGULATORY_GAP: Full code list lookup requires CV package to be imported
    // and code list values loaded into the database (Phase 2 post-registration).
    throw new Error(
      "RegulatoryResolver.validateCodeValue: Full code list validation is " +
        "implemented after CV package import in Phase 2.",
    );
  }
}
