import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import {
  PackageImportService,
  ZipStructureValidator,
  PackageConsistencyChecker,
  RegulatoryPackageType,
  type PackageImportResult,
} from "@ectd/standards";
import type {
  EctdStandard,
  RegulatoryArtifact,
  RegionalSpecification,
  ControlledVocabularyPackage,
} from "@prisma/client";
import {
  ImportPackageDto,
  ActivatePackageDto,
  RegisterEctdStandardDto,
  RegisterRegionalSpecDto,
} from "./dto/regulatory.dto";

/**
 * RegulatoryService — spec §3, Phase 2.
 *
 * Full import pipeline:
 *   Receive -> verify checksum -> validate structure -> parse metadata
 *   -> import schemas -> import code lists/Genericode
 *   -> import configuration -> consistency checks
 *   -> register immutable package -> activate ONLY after success
 *
 * Invariants (spec §3, §8):
 *   - A failed import NEVER partially activates.
 *   - Once imported, source files are immutable.
 *   - Old packages remain available for historical validation.
 *   - The selected Submission Unit profile is never silently replaced.
 */
@Injectable()
export class RegulatoryService {
  private readonly logger = new Logger(RegulatoryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  // ── Query endpoints ──────────────────────────────────────────────────────

  async getStandards(): Promise<EctdStandard[]> {
    return this.prisma.ectdStandard.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });
  }

  async getStandardById(id: string): Promise<EctdStandard> {
    const std = await this.prisma.ectdStandard.findUnique({ where: { id } });
    if (!std) throw new NotFoundException(`EctdStandard ${id} not found.`);
    return std;
  }

  async getRegions() {
    return this.prisma.regulatoryRegion.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });
  }

  async getAuthorities() {
    return this.prisma.regulatoryAuthority.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });
  }

  async getRegionalReadiness() {
    const { REGIONAL_READINESS_REGISTRY, getRegionalReadiness } = await import(
      "@ectd/standards"
    );
    return Object.keys(REGIONAL_READINESS_REGISTRY).map((key) => {
      const [regionCode, authorityCode] = key.split(":") as [string, string];
      return getRegionalReadiness(regionCode, authorityCode);
    });
  }

  async getRegionalReadinessFor(regionCode: string, authorityCode: string) {
    const { getRegionalReadiness } = await import("@ectd/standards");
    return getRegionalReadiness(regionCode, authorityCode);
  }

  async getSpecifications(): Promise<RegionalSpecification[]> {
    return this.prisma.regionalSpecification.findMany({
      where: { status: "ACTIVE" },
      include: { region: true, authority: true, ectdStandard: true },
    });
  }

  async getValidationProfiles() {
    return this.prisma.validationProfile.findMany({
      where: { active: true },
      include: { ectdStandard: true, regionalSpecification: true },
    });
  }

  async getCodeSystems() {
    return this.prisma.codeSystem.findMany({ where: { active: true } });
  }

  async getCodeLists() {
    return this.prisma.codeList.findMany({
      include: { versions: { orderBy: { createdAt: "desc" }, take: 1 } },
    });
  }

  async getCodeListValues(codeListId: string, version?: string) {
    const list = await this.prisma.codeList.findUnique({
      where: { id: codeListId },
    });
    if (!list) throw new NotFoundException(`CodeList ${codeListId} not found.`);

    const listVersion = await this.prisma.codeListVersion.findFirst({
      where: {
        codeListId,
        ...(version ? { version } : {}),
        status: "ACTIVE",
      },
      orderBy: { createdAt: "desc" },
    });

    if (!listVersion) {
      throw new NotFoundException(
        `No active version${version ? ` "${version}"` : ""} found for CodeList ${codeListId}.`,
      );
    }

    return this.prisma.codeListValue.findMany({
      where: { codeListVersionId: listVersion.id },
      orderBy: { order: "asc" },
    });
  }

  async getArtifacts(status?: string | undefined) {
    return this.prisma.regulatoryArtifact.findMany({
      ...(status ? { where: { status } } : {}),
      orderBy: { importedAt: "desc" },
    });
  }

  async getArtifactById(id: string): Promise<RegulatoryArtifact> {
    const artifact = await this.prisma.regulatoryArtifact.findUnique({
      where: { id },
    });
    if (!artifact)
      throw new NotFoundException(`RegulatoryArtifact ${id} not found.`);
    return artifact;
  }

  // ── Import pipeline ──────────────────────────────────────────────────────

  /**
   * importPackage — executes the full import pipeline synchronously.
   *
   * For large archives, this should be moved to a background job (Phase 2+).
   * For now it runs synchronously to keep the pipeline observable and testable.
   *
   * Spec §3: A failed import NEVER partially activates.
   */
  async importPackage(
    dto: ImportPackageDto,
    organizationId: string,
    actorId?: string | undefined,
  ): Promise<PackageImportResult & { artifactId?: string | undefined }> {
    this.logger.log({
      event: "REGULATORY_IMPORT_STARTED",
      name: dto.name,
      version: dto.version,
      packageType: dto.packageType,
      actorId,
    });

    // Build collaborators
    const storageReader = this.buildStorageReader();
    const structureValidator = new ZipStructureValidator();
    const artifactRepo = this.buildArtifactRepository();
    const importService = new PackageImportService(
      storageReader,
      artifactRepo,
      structureValidator,
    );

    const result = await importService.execute({
      expectedChecksum: dto.expectedChecksum,
      storageKey: dto.storageKey,
      sourceFilename: dto.sourceFilename,
      sourceUri: dto.sourceUri,
      packageType: dto.packageType as RegulatoryPackageType,
      name: dto.name,
      version: dto.version,
      authority: dto.authority,
      region: dto.region,
      effectiveDate: dto.effectiveDate
        ? new Date(dto.effectiveDate)
        : undefined,
      idempotencyKey: dto.idempotencyKey,
      importedById: actorId,
    });

    await this.audit.record({
      organizationId,
      userId: actorId,
      eventType: "IMPORT_REGULATORY_PACKAGE",
      entityType: "RegulatoryArtifact",
      entityId: result.artifactId ?? `${dto.name}@${dto.version}`,
      newValue: {
        name: dto.name,
        version: dto.version,
        packageType: dto.packageType,
        outcome: result.outcome,
      },
    });

    if (result.outcome === "FAILED") {
      this.logger.warn({
        event: "REGULATORY_IMPORT_FAILED",
        name: dto.name,
        version: dto.version,
        error: result.errorMessage,
        steps: result.steps,
      });
    } else {
      this.logger.log({
        event: "REGULATORY_IMPORT_SUCCEEDED",
        artifactId: result.artifactId,
        verifiedChecksum: result.verifiedChecksum,
      });
    }

    return result;
  }

  /**
   * activatePackage — explicit activation after successful import.
   *
   * Runs consistency checks before activating.
   * Never activates a FAILED or still-IMPORTING artifact.
   * spec §3, §8.
   */
  async activatePackage(
    id: string,
    dto: ActivatePackageDto,
    organizationId: string,
    actorId?: string | undefined,
  ): Promise<{ id: string; status: string; findings: unknown[] }> {
    const artifact = await this.getArtifactById(id);

    if (artifact.status === "ACTIVE") {
      throw new ConflictException(
        `RegulatoryArtifact ${id} is already ACTIVE.`,
      );
    }

    if (artifact.status === "FAILED") {
      throw new BadRequestException(
        `RegulatoryArtifact ${id} has status FAILED and cannot be activated. ` +
          "Re-import the package to start a new import pipeline.",
      );
    }

    if (artifact.status === "IMPORTING") {
      throw new BadRequestException(
        `RegulatoryArtifact ${id} is still IMPORTING. ` +
          "Wait for all import pipeline steps to complete before activating.",
      );
    }

    // Consistency checks
    const consistencyRepo = this.buildConsistencyRepository();
    const checker = new PackageConsistencyChecker(consistencyRepo);
    const meta = artifact.metadata as Record<string, unknown> | null;

    const consistencyResult = await checker.check({
      artifactId: id,
      name: artifact.name,
      version: artifact.version,
      packageType: artifact.artifactType,
      effectiveDate: meta?.["effectiveDate"]
        ? new Date(meta["effectiveDate"] as string)
        : undefined,
    });

    if (!consistencyResult.canActivate) {
      throw new ConflictException({
        code: "REGULATORY_CONSISTENCY_FAILED",
        message: "Package cannot be activated — consistency checks failed.",
        findings: consistencyResult.findings,
      });
    }

    // Activate
    await this.prisma.regulatoryArtifact.update({
      where: { id },
      data: { status: "ACTIVE" },
    });

    await this.audit.record({
      organizationId,
      userId: actorId,
      eventType: "ACTIVATE_REGULATORY_PACKAGE",
      entityType: "RegulatoryArtifact",
      entityId: id,
      oldValue: { status: artifact.status },
      newValue: { status: "ACTIVE" },
      metadata: { reason: dto.reason, findings: consistencyResult.findings },
    });

    this.logger.log({
      event: "REGULATORY_PACKAGE_ACTIVATED",
      artifactId: id,
      name: artifact.name,
      version: artifact.version,
      actorId,
    });

    return {
      id,
      status: "ACTIVE",
      findings: consistencyResult.findings,
    };
  }

  /**
   * supersede — marks an older package as SUPERSEDED.
   * Does NOT delete it — historical packages must remain available.
   * spec §3, §8.
   */
  async supersedePackage(
    id: string,
    reason: string | undefined,
    organizationId: string,
    actorId?: string | undefined,
  ): Promise<{ id: string; status: string }> {
    const artifact = await this.getArtifactById(id);

    if (artifact.status === "SUPERSEDED" || artifact.status === "RETIRED") {
      throw new ConflictException(
        `RegulatoryArtifact ${id} is already ${artifact.status}.`,
      );
    }

    await this.prisma.regulatoryArtifact.update({
      where: { id },
      data: { status: "SUPERSEDED" },
    });

    await this.audit.record({
      organizationId,
      userId: actorId,
      eventType: "ACTIVATE_REGULATORY_PACKAGE", // closest event type for supersession
      entityType: "RegulatoryArtifact",
      entityId: id,
      oldValue: { status: artifact.status },
      newValue: { status: "SUPERSEDED" },
      metadata: { reason },
    });

    return { id, status: "SUPERSEDED" };
  }

  // ── Standard / specification registration ────────────────────────────────

  /**
   * registerEctdStandard — registers a new EctdStandard entry.
   * The standard must be linked to its Implementation Guide artifact
   * separately after import.
   */
  async registerEctdStandard(
    dto: RegisterEctdStandardDto,
    organizationId: string,
    actorId?: string | undefined,
  ): Promise<EctdStandard> {
    const existing = await this.prisma.ectdStandard.findUnique({
      where: { name_version: { name: dto.name, version: dto.version } },
    });

    if (existing) {
      throw new ConflictException(
        `EctdStandard "${dto.name}" v${dto.version} already exists (id: ${existing.id}).`,
      );
    }

    const standard = await this.prisma.ectdStandard.create({
      data: {
        name: dto.name,
        version: dto.version,
        implementationGuideVersion: dto.implementationGuideVersion ?? null,
        controlledVocabularyVersion: dto.controlledVocabularyVersion ?? null,
        status: "ACTIVE",
        effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : null,
      },
    });

    await this.audit.record({
      organizationId,
      userId: actorId,
      eventType: "ACTIVATE_REGULATORY_PACKAGE",
      entityType: "EctdStandard",
      entityId: standard.id,
      newValue: { name: dto.name, version: dto.version },
    });

    return standard;
  }

  /**
   * linkArtifactToStandard — links an imported ImplementationGuide artifact
   * to an EctdStandard. Called after successful import + activation.
   */
  async linkImplementationGuide(
    standardId: string,
    artifactId: string,
    organizationId: string,
    actorId?: string | undefined,
  ): Promise<{ standardId: string; implementationGuideId: string }> {
    await this.getStandardById(standardId);
    const artifact = await this.getArtifactById(artifactId);

    if (artifact.status !== "ACTIVE") {
      throw new BadRequestException(
        `Artifact ${artifactId} is not ACTIVE (status: ${artifact.status}). ` +
          "Activate the package before linking it to a standard.",
      );
    }

    // Upsert ImplementationGuide record
    const ig = await this.prisma.implementationGuide.upsert({
      where: {
        name_version: { name: artifact.name, version: artifact.version },
      },
      update: { sourceArtifactId: artifactId, status: "ACTIVE" },
      create: {
        name: artifact.name,
        version: artifact.version,
        sourceUri: artifact.sourceUri ?? null,
        checksum: artifact.checksum,
        status: "ACTIVE",
        sourceArtifactId: artifactId,
      },
    });

    await this.prisma.ectdStandard.update({
      where: { id: standardId },
      data: { implementationGuideId: ig.id },
    });

    return { standardId, implementationGuideId: ig.id };
  }

  /**
   * linkControlledVocabulary — links an imported CV artifact to an EctdStandard.
   */
  async linkControlledVocabulary(
    standardId: string,
    artifactId: string,
    organizationId: string,
    actorId?: string | undefined,
  ): Promise<{ standardId: string; cvPackageId: string }> {
    await this.getStandardById(standardId);
    const artifact = await this.getArtifactById(artifactId);

    if (artifact.status !== "ACTIVE") {
      throw new BadRequestException(
        `Artifact ${artifactId} is not ACTIVE. Activate before linking.`,
      );
    }

    const cvPackage = await this.prisma.controlledVocabularyPackage.upsert({
      where: {
        name_version: { name: artifact.name, version: artifact.version },
      },
      update: { sourceArtifactId: artifactId, status: "ACTIVE" },
      create: {
        name: artifact.name,
        version: artifact.version,
        sourceUri: artifact.sourceUri ?? null,
        checksum: artifact.checksum,
        status: "ACTIVE",
        sourceArtifactId: artifactId,
      },
    });

    // Create standard <-> CV link
    await this.prisma.regulatoryStandardCvLink.upsert({
      where: {
        ectdStandardId_controlledVocabularyPackageId: {
          ectdStandardId: standardId,
          controlledVocabularyPackageId: cvPackage.id,
        },
      },
      update: {},
      create: {
        ectdStandardId: standardId,
        controlledVocabularyPackageId: cvPackage.id,
      },
    });

    return { standardId, cvPackageId: cvPackage.id };
  }

  /**
   * registerRegionalSpecification — registers a regional spec profile.
   * NAFDAC may be registered as a region+authority but must NOT have a
   * fabricated spec — spec §62.
   */
  async registerRegionalSpecification(
    dto: RegisterRegionalSpecDto,
    organizationId: string,
    actorId?: string | undefined,
  ): Promise<RegionalSpecification> {
    // Validate standard exists
    await this.getStandardById(dto.ectdStandardId);

    // Validate region exists
    const region = await this.prisma.regulatoryRegion.findUnique({
      where: { id: dto.regionId },
    });
    if (!region)
      throw new NotFoundException(
        `RegulatoryRegion ${dto.regionId} not found.`,
      );

    // Validate authority if provided
    if (dto.authorityId) {
      const auth = await this.prisma.regulatoryAuthority.findUnique({
        where: { id: dto.authorityId },
      });
      if (!auth)
        throw new NotFoundException(
          `RegulatoryAuthority ${dto.authorityId} not found.`,
        );
    }

    const spec = await this.prisma.regionalSpecification.create({
      data: {
        name: dto.name,
        version: dto.version,
        regionId: dto.regionId,
        authorityId: dto.authorityId ?? null,
        ectdStandardId: dto.ectdStandardId,
        status: "ACTIVE",
        effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : null,
      },
    });

    return spec;
  }

  /**
   * resolveProfile — resolves the exact regulatory profile for a Submission Unit.
   * Used by the XML engine, validation engine, and publishing pipeline.
   * spec §2.
   */
  async resolveProfile(submissionUnitId: string): Promise<{
    ectdStandardId: string;
    implementationGuideVersion: string;
    implementationGuideChecksum: string;
    controlledVocabularyVersion: string;
    controlledVocabularyChecksum: string;
    schemaPackageChecksum: string;
    regionalSpecificationId?: string | undefined;
    regionalSpecificationVersion?: string | undefined;
  }> {
    const unit = await this.prisma.submissionUnit.findUnique({
      where: { id: submissionUnitId },
      include: {
        ectdStandard: {
          include: {
            implementationGuide: { include: { sourceArtifact: true } },
            controlledVocabularyLinks: {
              include: {
                controlledVocabularyPackage: {
                  include: { sourceArtifact: true },
                },
              },
            },
          },
        },
        regionalSpecification: true,
      },
    });

    if (!unit) {
      throw new NotFoundException(
        `SubmissionUnit ${submissionUnitId} not found.`,
      );
    }

    const standard = unit.ectdStandard;

    // ── Implementation Guide ───────────────────────────────────────────────
    if (!standard.implementationGuide) {
      throw new BadRequestException(
        `EctdStandard "${standard.name} ${standard.version}" has no Implementation ` +
          "Guide linked. Import and activate the IG package first.",
      );
    }

    const ig = standard.implementationGuide;
    const igArtifact = ig.sourceArtifact;
    const igChecksum = ig.checksum ?? igArtifact?.checksum;

    if (!igChecksum) {
      throw new BadRequestException(
        "No checksum available for Implementation Guide. Package may not be fully imported.",
      );
    }

    if (igArtifact && igArtifact.status !== "ACTIVE") {
      throw new BadRequestException(
        `IG artifact status is "${igArtifact.status}" — must be ACTIVE to use in submissions.`,
      );
    }

    // ── Controlled Vocabulary ──────────────────────────────────────────────
    const cvLink = standard.controlledVocabularyLinks[0];
    if (!cvLink) {
      throw new BadRequestException(
        `EctdStandard "${standard.name} ${standard.version}" has no Controlled ` +
          "Vocabulary package linked. Import and activate the CV package first.",
      );
    }

    const cv = cvLink.controlledVocabularyPackage;
    const cvArtifact = cv.sourceArtifact;
    const cvChecksum = cv.checksum ?? cvArtifact?.checksum;

    if (!cvChecksum) {
      throw new BadRequestException(
        "No checksum available for Controlled Vocabulary package.",
      );
    }

    if (cvArtifact && cvArtifact.status !== "ACTIVE") {
      throw new BadRequestException(
        `CV artifact status is "${cvArtifact.status}" — must be ACTIVE.`,
      );
    }

    return {
      ectdStandardId: unit.ectdStandardId,
      implementationGuideVersion: ig.version,
      implementationGuideChecksum: igChecksum,
      controlledVocabularyVersion: cv.version,
      controlledVocabularyChecksum: cvChecksum,
      schemaPackageChecksum: igChecksum, // IG package includes schemas — see REGULATORY_GAP in resolver
      regionalSpecificationId: unit.regionalSpecificationId ?? undefined,
      regionalSpecificationVersion: unit.regionalSpecification?.version,
    };
  }

  // ── Collaborator factories ───────────────────────────────────────────────

  private buildStorageReader() {
    const prisma = this.prisma;
    return {
      async readAsBuffer(storageKey: string): Promise<Buffer> {
        // Phase 5 will replace this with the StorageService abstraction.
        // For Phase 2, read from local filesystem using storage key as path.
        // NEVER expose this path via the API — spec §16.
        const fs = await import("fs/promises");
        const storageRoot = process.env["STORAGE_ROOT"] ?? "/tmp/ectd-storage";
        const fullPath = `${storageRoot}/${storageKey}`;
        try {
          return await fs.readFile(fullPath);
        } catch (err) {
          throw new Error(
            `StorageReader: Cannot read "${storageKey}" from "${storageRoot}". ` +
              "Ensure the file was uploaded to the storage root before importing. " +
              `Detail: ${String(err)}`,
          );
        }
      },
    };
  }

  private buildArtifactRepository() {
    const prisma = this.prisma;
    return {
      async create(data: {
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
      }) {
        return prisma.regulatoryArtifact.create({
          data: {
            artifactType: data.artifactType,
            name: data.name,
            version: data.version,
            sourceUri: data.sourceUri ?? null,
            sourceFilename: data.sourceFilename ?? null,
            checksum: data.checksum,
            storageKey: data.storageKey ?? null,
            importedById: data.importedById ?? null,
            status: data.status,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            metadata: (data.metadata ?? undefined) as any,
          },
        });
      },

      async updateStatus(
        id: string,
        status: string,
        metadata?: Record<string, unknown> | undefined,
      ) {
        await prisma.regulatoryArtifact.update({
          where: { id },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: { status, ...(metadata ? { metadata: metadata as any } : {}) },
        });
      },

      async findByChecksum(checksum: string) {
        return prisma.regulatoryArtifact.findFirst({
          where: { checksum },
          select: { id: true, status: true },
        });
      },
    };
  }

  private buildConsistencyRepository() {
    const prisma = this.prisma;
    return {
      async findActiveByName(name: string) {
        return prisma.regulatoryArtifact.findMany({
          where: { name, status: "ACTIVE" },
          select: { id: true, name: true, version: true, status: true },
        });
      },
    };
  }
}
