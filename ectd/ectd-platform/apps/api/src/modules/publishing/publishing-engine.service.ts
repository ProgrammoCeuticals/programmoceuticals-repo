import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Inject,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import { STORAGE_SERVICE } from "../storage/storage.token";
import {
  PublishingPipeline,
  runPublishGate,
  type PublishingRepository,
  type PackageStore,
  type PublishingAuditor,
  type PublishGateInput,
  type DocumentToResolve,
} from "@ectd/ectd-publishing";
import type { StorageService } from "@ectd/shared";

/**
 * PublishingEngineService — spec §30, Phase 9.
 *
 * NestJS adapter that wires the pure PublishingPipeline domain service
 * to Prisma persistence and storage.
 *
 * "Publishing is NOT ZIP creation." — spec §30.
 *
 * Spec §32 — Transmission Boundary:
 *   The pipeline stops at READY_FOR_TRANSMISSION.
 *   Do not claim a submission is transmitted without a confirmed
 *   transmission service response.
 */
@Injectable()
export class PublishingEngineService {
  private readonly logger = new Logger(PublishingEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    @Inject(STORAGE_SERVICE) private readonly storage: StorageService,
  ) {}

  /**
   * preparePublication — dry-run gate check, non-destructive.
   * Returns readiness state without creating any artifacts.
   */
  async preparePublication(
    submissionUnitId: string,
  ): Promise<{ ready: boolean; issues: string[] }> {
    const gateInput = await this.loadGateInput(submissionUnitId);
    const result = runPublishGate(gateInput);
    return { ready: result.passed, issues: result.issues };
  }

  /**
   * publish — executes the full 14-step publishing pipeline.
   * NOT a PATCH status change — spec §33.
   *
   * Creates an immutable SubmissionPackage record on success.
   * Status FINALIZED → READY_FOR_TRANSMISSION.
   */
  async publish(
    submissionUnitId: string,
    organizationId: string,
    actorId?: string | undefined,
  ): Promise<{
    packageId: string;
    status: string;
    readyForTransmission: boolean;
    packageChecksum: string;
    steps: unknown[];
  }> {
    const unit = await this.prisma.submissionUnit.findUnique({
      where: { id: submissionUnitId },
      select: { status: true, uuid: true },
    });
    if (!unit)
      throw new NotFoundException(
        `SubmissionUnit ${submissionUnitId} not found.`,
      );

    if (unit.status === "PUBLISHED") {
      throw new ConflictException(
        "Submission Unit is already PUBLISHED and immutable. " +
          "Create a new Submission Unit for a new sequence.",
      );
    }

    const pipeline = new PublishingPipeline(
      this.buildRepository(),
      this.buildPackageStore(submissionUnitId),
      this.buildAuditor(),
    );

    this.logger.log({ event: "PUBLISHING_STARTED", submissionUnitId });

    const result = await pipeline.execute({
      submissionUnitId,
      organizationId,
      actorId,
      generatorVersion: "0.1.0-phase9",
    });

    if (result.outcome !== "SUCCESS") {
      this.logger.warn({
        event: "PUBLISHING_FAILED",
        submissionUnitId,
        outcome: result.outcome,
        gateIssues: result.gateIssues,
        errorMessage: result.errorMessage,
      });

      if (result.outcome === "GATE_BLOCKED") {
        throw new BadRequestException({
          code: "PUBLISH_GATE_BLOCKED",
          message: "Publication blocked — gate checks failed.",
          issues: result.gateIssues,
        });
      }

      throw new BadRequestException({
        code: "PUBLISHING_PIPELINE_FAILED",
        message: result.errorMessage ?? "Publishing pipeline failed.",
        steps: result.steps,
      });
    }

    // Extract internal data from the pipeline result
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const internal = (result as any)._internal as {
      finalStorageKey: string;
      finalFileSize: bigint;
      packageChecksum: string;
      validationRunId: string | null;
      xmlRunId: string | null;
    };

    // Determine next package version
    const lastPkg = await this.prisma.submissionPackage.findFirst({
      where: { submissionUnitId },
      orderBy: { packageVersion: "desc" },
      select: { packageVersion: true },
    });
    const nextVersion = (lastPkg?.packageVersion ?? 0) + 1;

    // Create immutable SubmissionPackage record — spec §31
    const pkg = await this.prisma.submissionPackage.create({
      data: {
        submissionUnitId,
        packageVersion: nextVersion,
        storageKey: internal.finalStorageKey,
        fileSize: internal.finalFileSize,
        checksum: internal.packageChecksum,
        checksumAlgorithm: "SHA-256",
        validationRunId: internal.validationRunId ?? null,
        xmlGenerationRunId: internal.xmlRunId ?? null,
        generatorVersion: "0.1.0-phase9",
        status: "FINALIZED",
        generatedById: actorId ?? null,
      },
    });

    // Mark SubmissionUnit as PUBLISHED (immutable from this point)
    await this.prisma.submissionUnit.update({
      where: { id: submissionUnitId },
      data: { status: "PUBLISHED" },
    });

    await this.audit.record({
      organizationId,
      userId: actorId,
      eventType: "PUBLISH_SUBMISSION_UNIT",
      entityType: "SubmissionUnit",
      entityId: submissionUnitId,
      newValue: {
        packageId: pkg.id,
        packageVersion: nextVersion,
        packageChecksum: internal.packageChecksum,
        status: "READY_FOR_TRANSMISSION",
      },
    });

    this.logger.log({
      event: "PUBLISHING_COMPLETED",
      submissionUnitId,
      packageId: pkg.id,
      packageChecksum: internal.packageChecksum,
    });

    return {
      packageId: pkg.id,
      status: "READY_FOR_TRANSMISSION",
      readyForTransmission: true,
      packageChecksum: internal.packageChecksum,
      steps: result.steps,
    };
  }

  // ── Repository builder ────────────────────────────────────────────────

  private buildRepository(): PublishingRepository {
    const prisma = this.prisma;
    const storage = this.storage;

    return {
      loadGateInput: (id) => this.loadGateInput(id),

      loadDocumentsForDisposition: async (
        submissionUnitId,
      ): Promise<DocumentToResolve[]> => {
        const cous = await prisma.contextOfUse.findMany({
          where: { submissionUnitId },
          include: {
            document: {
              include: {
                currentVersion: { select: { storageKey: true } },
                versions: { select: { id: true }, take: 1 },
              },
            },
          },
        });

        return cous.map((cou) => ({
          contextOfUseId: cou.id,
          couStatus: cou.status,
          documentId: cou.documentId,
          hasVersion: (cou.document?.versions.length ?? 0) > 0,
          currentVersionStorageKey:
            cou.document?.currentVersion?.storageKey ?? undefined,
        }));
      },

      readFileBuffer: async (storageKey: string): Promise<Buffer> => {
        const result = await storage.get(storageKey);
        // Stream to buffer
        return new Promise((resolve, reject) => {
          const chunks: Buffer[] = [];
          result.stream.on("data", (chunk: Buffer | string) =>
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)),
          );
          result.stream.on("end", () => resolve(Buffer.concat(chunks)));
          result.stream.on("error", reject);
        });
      },

      getLatestValidationRunId: async (submissionUnitId) => {
        const run = await prisma.validationRun.findFirst({
          where: { submissionUnitId, status: "SUCCEEDED" },
          orderBy: { startedAt: "desc" },
          select: { id: true },
        });
        return run?.id ?? null;
      },

      getLatestXmlRunId: async (submissionUnitId) => {
        const run = await prisma.xmlGenerationRun.findFirst({
          where: { submissionUnitId, status: "SUCCEEDED" },
          orderBy: { createdAt: "desc" },
          select: { id: true },
        });
        return run?.id ?? null;
      },

      getXmlOutput: async (xmlRunId) => {
        const run = await prisma.xmlGenerationRun.findUnique({
          where: { id: xmlRunId },
          select: { outputStorageKey: true },
        });
        if (!run?.outputStorageKey) return null;
        const result = await storage.get(run.outputStorageKey);
        return new Promise((resolve, reject) => {
          const chunks: Buffer[] = [];
          result.stream.on("data", (c: Buffer | string) =>
            chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)),
          );
          result.stream.on("end", () =>
            resolve(Buffer.concat(chunks).toString("utf-8")),
          );
          result.stream.on("error", reject);
        });
      },

      getSubmissionUnitUuid: async (submissionUnitId) => {
        const unit = await prisma.submissionUnit.findUniqueOrThrow({
          where: { id: submissionUnitId },
          select: { uuid: true },
        });
        return unit.uuid;
      },

      getSequenceNumber: async (submissionUnitId) => {
        const unit = await prisma.submissionUnit.findUniqueOrThrow({
          where: { id: submissionUnitId },
          select: { sequenceNumber: true },
        });
        return unit.sequenceNumber;
      },

      getEctdStandardVersion: async (submissionUnitId) => {
        const unit = await prisma.submissionUnit.findUniqueOrThrow({
          where: { id: submissionUnitId },
          include: { ectdStandard: { select: { name: true, version: true } } },
        });
        return `${unit.ectdStandard.name} ${unit.ectdStandard.version}`;
      },
    };
  }

  private buildPackageStore(submissionUnitId: string): PackageStore {
    const storage = this.storage;
    const stagingRoot = `staging/${submissionUnitId}`;

    return {
      writeToStaging: async (unitId, relativePath, content) => {
        const key = `${stagingRoot}/${relativePath}`;
        const buf =
          typeof content === "string" ? Buffer.from(content, "utf-8") : content;
        const result = await storage.put(key, buf);
        return result.storageKey;
      },

      finalizeStaging: async (unitId) => {
        // For MVP: staging key is the final key (same storage)
        // In production: atomically move from staging bucket to permanent bucket
        const finalKey = `packages/${unitId}/${Date.now()}`;
        // Compute size of staged files (approximate)
        const exists = await storage.exists(stagingRoot);
        return {
          storageKey: finalKey,
          fileSize: BigInt(0), // TODO: sum all staged files
        };
      },

      clearStaging: async (_unitId) => {
        // Best-effort cleanup
        try {
          await storage.delete(stagingRoot);
        } catch {
          // ignore — staging cleanup is best-effort
        }
      },
    };
  }

  private buildAuditor(): PublishingAuditor {
    const audit = this.audit;
    return {
      recordAudit: async ({ organizationId, actorId, entityId, metadata }) => {
        await audit.record({
          organizationId,
          userId: actorId,
          eventType: "PUBLISH_SUBMISSION_UNIT",
          entityType: "SubmissionUnit",
          entityId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          metadata: metadata as any,
        });
      },
    };
  }

  private async loadGateInput(
    submissionUnitId: string,
  ): Promise<PublishGateInput> {
    const unit = await this.prisma.submissionUnit.findUnique({
      where: { id: submissionUnitId },
      include: {
        ectdStandard: {
          include: { implementationGuide: { select: { id: true } } },
        },
        contextsOfUse: {
          include: {
            document: {
              include: { versions: { select: { id: true }, take: 1 } },
            },
          },
        },
      },
    });

    if (!unit) {
      return {
        submissionUnitId,
        unitStatus: "NOT_FOUND",
        hasSnapshot: false,
        hasPassedValidation: false,
        hasSucceededXmlRun: false,
        standardHasImplementationGuide: false,
        documentsWithNoVersions: [],
        couCount: 0,
        senderIdentityConfigured: false,
      };
    }

    const [snapshot, validationRun, xmlRun] = await Promise.all([
      this.prisma.submissionUnitSnapshot.findFirst({
        where: { submissionUnitId },
        select: { id: true },
      }),
      this.prisma.validationRun.findFirst({
        where: { submissionUnitId, status: "SUCCEEDED" },
        select: { id: true },
      }),
      this.prisma.xmlGenerationRun.findFirst({
        where: { submissionUnitId, status: "SUCCEEDED" },
        select: { id: true },
      }),
    ]);

    const documentsWithNoVersions: string[] = unit.contextsOfUse
      .filter((cou) => cou.document && cou.document.versions.length === 0)
      .map((cou) => cou.documentId);

    // Resolve sender identity check
    const { resolveSenderIdentity } = await import("@ectd/ectd-xml");
    const senderResolution = resolveSenderIdentity();

    // Get region/authority for readiness check
    const submissionLink = await this.prisma.submissionSubmissionUnit.findFirst(
      {
        where: { submissionUnitId },
        include: {
          submission: {
            include: {
              application: {
                include: {
                  region: { select: { code: true } },
                  authority: { select: { code: true } },
                },
              },
            },
          },
        },
      },
    );
    const regionCode = submissionLink?.submission.application.region.code;
    const authorityCode = submissionLink?.submission.application.authority.code;

    // Get validation completion status from most recent succeeded run
    const latestRun = await this.prisma.validationRun.findFirst({
      where: { submissionUnitId },
      orderBy: { startedAt: "desc" },
      select: { status: true },
    });
    // Map DB status to completion status
    const validationCompletionStatus =
      latestRun?.status === "SUCCEEDED"
        ? "VALID"
        : latestRun?.status === "FAILED"
          ? "INVALID"
          : undefined;

    return {
      submissionUnitId,
      unitStatus: unit.status,
      hasSnapshot: !!snapshot,
      hasPassedValidation: !!validationRun,
      validationCompletionStatus,
      hasSucceededXmlRun: !!xmlRun,
      standardHasImplementationGuide: !!unit.ectdStandard.implementationGuide,
      documentsWithNoVersions,
      couCount: unit.contextsOfUse.length,
      senderIdentityConfigured: senderResolution.configured,
      regionCode,
      authorityCode,
    };
  }
}
