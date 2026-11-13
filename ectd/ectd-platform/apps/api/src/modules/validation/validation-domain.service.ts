import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import {
  ValidationEngineImpl,
  ValidationEngineAdapter,
  InMemoryValidationCache,
  STRUCTURAL_RULE_DEFINITIONS,
  VALIDATION_ENGINE_VERSION,
  DEFAULT_SEVERITY_POLICY,
  type StructuralCheckInput,
  type ResolvedValidationProfile,
  type ValidationEngineRepository,
} from "@ectd/validation";

/**
 * ValidationDomainService — spec §24–28, Phase 8.
 *
 * NestJS adapter that wires the ValidationEngine to Prisma.
 *
 * Layers implemented:
 *   Layer 1 (STRUCTURAL): runs with INTERNAL rules — no package needed.
 *   Layers 2–6: REGULATORY_GAP until authoritative packages imported.
 *
 * Severity is profile-driven — spec §25. The engine asks the profile,
 * not a global constant, whether an error is blocking.
 *
 * Validation caching — spec §28: cached by checksum + engine + profile version.
 * Currently uses InMemoryValidationCache; replace with Redis adapter for production.
 */
@Injectable()
export class ValidationDomainService {
  private readonly logger = new Logger(ValidationDomainService.name);
  private readonly cache = new InMemoryValidationCache();

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  // ── Validation run ────────────────────────────────────────────────────

  async runValidation(
    submissionUnitId: string,
    runId: string,
    validationProfileId: string,
    organizationId: string,
    actorId?: string | undefined,
  ): Promise<{
    validationRunId: string;
    status: string;
    completionStatus: string;
    hasBlockingErrors: boolean;
    findingCount: number;
    findings: unknown[];
  }> {
    // Load the snapshot — spec §29: validation operates on a frozen snapshot
    const snapshot = await this.prisma.submissionUnitSnapshot.findFirst({
      where: { submissionUnitId },
      orderBy: { snapshotVersion: "desc" },
    });
    if (!snapshot) {
      throw new BadRequestException(
        "No frozen snapshot found. Run /freeze before validating.",
      );
    }

    // Transition run to RUNNING using the actual run ID — spec §26
    await this.prisma.validationRun
      .update({
        where: { id: runId },
        data: { status: "RUNNING", startedAt: new Date() },
      })
      .catch(() => null);

    const repo = this.buildRepository();
    const engine = new ValidationEngineImpl(repo, this.cache);
    const profile = await this.resolveProfile(validationProfileId);

    this.logger.log({
      event: "VALIDATION_STARTED",
      submissionUnitId,
      runId,
      profileId: validationProfileId,
      engineVersion: VALIDATION_ENGINE_VERSION,
    });

    let result;
    try {
      result = await engine.validate(submissionUnitId, snapshot.id, profile);
    } catch (err) {
      await this.prisma.validationRun
        .update({
          where: { id: runId },
          data: { status: "FAILED", completedAt: new Date() },
        })
        .catch(() => null);
      throw err;
    }

    await this.persistFindings(
      runId,
      result.findings as unknown as Record<string, unknown>[],
    );

    const completionStatus =
      result.completionStatus ??
      (result.hasBlockingErrors ? "INVALID" : "VALID");
    const finalStatus = result.hasBlockingErrors ? "FAILED" : "SUCCEEDED";

    await this.prisma.validationRun
      .update({
        where: { id: runId },
        data: {
          status: finalStatus,
          completedAt: result.completedAt,
          engineVersion: VALIDATION_ENGINE_VERSION,
          profileVersion: profile.rulesetVersion,
        },
      })
      .catch(() => null);

    await this.audit.record({
      organizationId,
      userId: actorId,
      eventType: "RUN_VALIDATION",
      entityType: "SubmissionUnit",
      entityId: submissionUnitId,
      newValue: {
        validationRunId: runId,
        status: finalStatus,
        completionStatus,
        hasBlockingErrors: result.hasBlockingErrors,
        findingCount: result.findings.length,
      },
    });

    this.logger.log({
      event: "VALIDATION_COMPLETED",
      submissionUnitId,
      runId,
      status: finalStatus,
      completionStatus,
      hasBlockingErrors: result.hasBlockingErrors,
      findingCount: result.findings.length,
    });

    return {
      validationRunId: runId,
      status: finalStatus,
      completionStatus,
      hasBlockingErrors: result.hasBlockingErrors,
      findingCount: result.findings.length,
      findings: result.findings,
    };
  }

  // ── Read endpoints ────────────────────────────────────────────────────

  async getValidationRun(id: string) {
    const run = await this.prisma.validationRun.findUnique({
      where: { id },
      include: { validationProfile: true },
    });
    if (!run) throw new NotFoundException(`ValidationRun ${id} not found.`);
    return run;
  }

  async getValidationResults(runId: string) {
    await this.getValidationRun(runId);
    return this.prisma.validationResult.findMany({
      where: { validationRunId: runId },
      include: {
        rule: {
          select: { ruleCode: true, name: true, source: true, severity: true },
        },
      },
      orderBy: [{ severity: "asc" }, { createdAt: "asc" }],
    });
  }

  async getValidationResult(id: string) {
    const result = await this.prisma.validationResult.findUnique({
      where: { id },
    });
    if (!result)
      throw new NotFoundException(`ValidationResult ${id} not found.`);
    return result;
  }

  // ── Profile resolver ─────────────────────────────────────────────────

  private async resolveProfile(
    profileId: string,
  ): Promise<ResolvedValidationProfile> {
    const profile = await this.prisma.validationProfile.findUnique({
      where: { id: profileId },
      include: { ectdStandard: true, regionalSpecification: true },
    });

    if (!profile) {
      throw new NotFoundException(`ValidationProfile ${profileId} not found.`);
    }

    // Load rules registered for this profile's standard
    // REGULATORY_GAP: authoritative rules are loaded from imported regulatory
    // packages. Currently only STRUCTURAL (INTERNAL) rules are available.
    const dbRules = await this.prisma.validationRule.findMany({
      where: {
        active: true,
        OR: [
          { standardId: profile.ectdStandardId },
          { standardId: null }, // global rules
        ],
      },
    });

    // Convert DB rules to domain types, with STRUCTURAL fallback
    const domainRules = [
      // Always include built-in structural rules
      ...STRUCTURAL_RULE_DEFINITIONS,
      // Add any authoritative rules loaded from DB
      // REGULATORY_GAP: DB rules come from imported packages (Phase 2)
    ];

    return {
      id: profile.id,
      name: profile.name,
      version: profile.version,
      rulesetVersion: profile.rulesetVersion,
      ectdStandardId: profile.ectdStandardId,
      regionalSpecificationId: profile.regionalSpecificationId ?? undefined,
      rules: domainRules,
      // REGULATORY_GAP: severity policy should be loaded from the authority's
      // validation criteria. Using conservative defaults.
      severityPolicy: DEFAULT_SEVERITY_POLICY,
    };
  }

  // ── Findings persistence ─────────────────────────────────────────────

  private async persistFindings(
    validationRunId: string,
    findings: Record<string, unknown>[],
  ): Promise<void> {
    // Find or create ValidationRule records for INTERNAL structural rules
    for (const finding of findings as unknown as Array<{
      ruleCode: string;
      severity: string;
      status: string;
      message: string;
      entityType?: string;
      entityId?: string;
      location?: string;
      remediation?: string;
      source: string;
    }>) {
      let rule = await this.prisma.validationRule.findFirst({
        where: { ruleCode: finding.ruleCode, active: true },
      });

      if (!rule) {
        // Auto-register INTERNAL structural rules on first encounter
        const structDef = STRUCTURAL_RULE_DEFINITIONS.find(
          (r) => r.ruleCode === finding.ruleCode,
        );
        if (structDef) {
          rule = await this.prisma.validationRule.upsert({
            where: {
              ruleCode_version: {
                ruleCode: structDef.ruleCode,
                version: structDef.version,
              },
            },
            update: {},
            create: {
              ruleCode: structDef.ruleCode,
              name: structDef.name,
              description: structDef.description ?? null,
              severity: structDef.severity,
              scope: structDef.scope,
              source: structDef.source,
              version: structDef.version,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ruleDefinition: structDef.definition as any,
              active: true,
            },
          });
        }
      }

      if (!rule) continue;

      await this.prisma.validationResult.create({
        data: {
          validationRunId,
          ruleId: rule.id,
          severity: finding.severity,
          status: finding.status,
          message: finding.message,
          entityType: finding.entityType ?? null,
          entityId: finding.entityId ?? null,
          location: finding.location ?? null,
          remediation: finding.remediation ?? null,
        },
      });
    }
  }

  // ── Repository builder ────────────────────────────────────────────────

  private buildRepository(): ValidationEngineRepository {
    const prisma = this.prisma;
    return {
      loadStructuralCheckInput: async (
        submissionUnitId,
      ): Promise<StructuralCheckInput> => {
        const unit = await prisma.submissionUnit.findUnique({
          where: { id: submissionUnitId },
          include: {
            ectdStandard: { select: { status: true } },
            contextsOfUse: {
              include: {
                document: {
                  include: {
                    versions: { select: { id: true }, take: 1 },
                  },
                },
              },
            },
          },
        });

        if (!unit) {
          return {
            submissionUnitId,
            hasSnapshot: false,
            couCount: 0,
            cousMissingDocuments: [],
            documentsWithNoVersions: [],
            standardIsActive: false,
            obsoleteCouIds: [],
          };
        }

        const snapshot = await prisma.submissionUnitSnapshot.findFirst({
          where: { submissionUnitId },
          select: { id: true },
        });

        const cousMissingDocuments: string[] = [];
        const documentsWithNoVersions: string[] = [];
        const obsoleteCouIds: string[] = [];

        for (const cou of unit.contextsOfUse) {
          if (!cou.documentId) {
            cousMissingDocuments.push(cou.id);
          } else if (cou.document && cou.document.versions.length === 0) {
            documentsWithNoVersions.push(cou.documentId);
          }
          if (cou.status === "OBSOLETE") {
            obsoleteCouIds.push(cou.id);
          }
        }

        return {
          submissionUnitId,
          hasSnapshot: !!snapshot,
          couCount: unit.contextsOfUse.length,
          cousMissingDocuments,
          documentsWithNoVersions,
          standardIsActive: unit.ectdStandard.status === "ACTIVE",
          obsoleteCouIds,
        };
      },

      isSchemaPackageAvailable: async (ectdStandardId) => {
        const standard = await prisma.ectdStandard.findUnique({
          where: { id: ectdStandardId },
          include: {
            implementationGuide: { include: { sourceArtifact: true } },
          },
        });
        return (
          standard?.implementationGuide?.sourceArtifact?.status === "ACTIVE"
        );
      },

      isCvPackageAvailable: async (ectdStandardId) => {
        const link = await prisma.regulatoryStandardCvLink.findFirst({
          where: { ectdStandardId },
          include: {
            controlledVocabularyPackage: { include: { sourceArtifact: true } },
          },
        });
        return (
          link?.controlledVocabularyPackage?.sourceArtifact?.status === "ACTIVE"
        );
      },

      getEctdStandardId: async (submissionUnitId) => {
        const unit = await prisma.submissionUnit.findUnique({
          where: { id: submissionUnitId },
          select: { ectdStandardId: true },
        });
        return unit?.ectdStandardId ?? null;
      },
    };
  }
}
