import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import { PublishingEngineService } from "../publishing/publishing-engine.service";
import { JOB_QUEUE } from "../jobs/job-queue.token";
import {
  CreateSubmissionUnitDto,
  ValidateSubmissionUnitDto,
  PublishSubmissionUnitDto,
} from "./dto/submission-unit.dto";
import {
  paginate,
  type PaginatedResult,
} from "../../common/dto/pagination.dto";
import { v4 as uuidv4 } from "uuid";
import type { SubmissionUnit } from "@prisma/client";
import type { JobQueue } from "@ectd/shared";

/**
 * SubmissionUnitsService — spec §7.9, §29, §30, §33.
 *
 * Lifecycle commands are explicit domain operations — spec §33.
 * Published Submission Units are immutable — spec §4.4, §8.
 *
 * Command methods: freeze, validate, generateXml, preparePublication, publish.
 * None of these are PATCH status changes — spec §33.
 */
@Injectable()
export class SubmissionUnitsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly publishingEngine: PublishingEngineService,
    @Inject(JOB_QUEUE) private readonly jobQueue: JobQueue,
  ) {}

  async create(
    submissionId: string,
    organizationId: string,
    dto: CreateSubmissionUnitDto,
    actorId?: string | undefined,
  ): Promise<SubmissionUnit> {
    // Verify submission belongs to org
    const sub = await this.prisma.submission.findFirst({
      where: { id: submissionId, application: { organizationId } },
      select: { id: true, applicationId: true },
    });
    if (!sub) {
      throw new NotFoundException(
        `Submission ${submissionId} not found in this organization.`,
      );
    }

    // Validate standard exists
    const standard = await this.prisma.ectdStandard.findUnique({
      where: { id: dto.ectdStandardId },
    });
    if (!standard || standard.status !== "ACTIVE") {
      throw new BadRequestException(
        `EctdStandard ${dto.ectdStandardId} not found or not ACTIVE.`,
      );
    }

    // Validate regional spec if provided
    if (dto.regionalSpecificationId) {
      const spec = await this.prisma.regionalSpecification.findUnique({
        where: { id: dto.regionalSpecificationId },
      });
      if (!spec || spec.status !== "ACTIVE") {
        throw new BadRequestException(
          `RegionalSpecification ${dto.regionalSpecificationId} not found or not ACTIVE.`,
        );
      }
    }

    const unit = await this.prisma.submissionUnit.create({
      data: {
        uuid: uuidv4(),
        sequenceNumber: dto.sequenceNumber,
        priorityNumber: dto.priorityNumber ?? null,
        ectdStandardId: dto.ectdStandardId,
        regionalSpecificationId: dto.regionalSpecificationId ?? null,
        status: "DRAFT",
      },
    });

    // Link to submission — spec §11 (M:M relationship)
    await this.prisma.submissionSubmissionUnit.create({
      data: { submissionId, submissionUnitId: unit.id },
    });

    await this.audit.record({
      organizationId,
      userId: actorId,
      eventType: "CREATE_SUBMISSION_UNIT",
      entityType: "SubmissionUnit",
      entityId: unit.id,
      newValue: {
        uuid: unit.uuid,
        sequenceNumber: unit.sequenceNumber,
        submissionId,
      },
    });

    return unit;
  }

  async findBySubmission(
    submissionId: string,
    organizationId: string,
    page = 1,
    pageSize = 50,
  ): Promise<PaginatedResult<SubmissionUnit>> {
    const sub = await this.prisma.submission.findFirst({
      where: { id: submissionId, application: { organizationId } },
      select: { id: true },
    });
    if (!sub) {
      throw new NotFoundException(
        `Submission ${submissionId} not found in this organization.`,
      );
    }

    const links = await this.prisma.submissionSubmissionUnit.findMany({
      where: { submissionId },
      include: { submissionUnit: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    const total = await this.prisma.submissionSubmissionUnit.count({
      where: { submissionId },
    });

    return paginate(
      links.map((l) => l.submissionUnit),
      total,
      page,
      pageSize,
    );
  }

  async findOne(id: string): Promise<SubmissionUnit> {
    const unit = await this.prisma.submissionUnit.findUnique({
      where: { id },
      include: {
        ectdStandard: { select: { name: true, version: true } },
        regionalSpecification: { select: { name: true, version: true } },
      },
    });
    if (!unit) throw new NotFoundException(`SubmissionUnit ${id} not found.`);
    return unit;
  }

  /**
   * freeze — creates an immutable snapshot of the current Submission Unit state.
   * Required before validation, XML generation, and publishing.
   * Published units cannot be mutated — spec §4.4, §8.
   */
  async freeze(
    id: string,
    organizationId: string,
    actorId?: string | undefined,
  ): Promise<{ snapshotId: string; snapshotVersion: number; submissionUnitId: string }> {
    const unit = await this.findOne(id);
    await this.assertUnitInOrg(id, organizationId);

    if (unit.status === "PUBLISHED") {
      throw new ConflictException(
        "Published Submission Units are immutable and cannot be frozen again. " +
          "Create a new Submission Unit for subsequent sequences.",
      );
    }

    const last = await this.prisma.submissionUnitSnapshot.findFirst({
      where: { submissionUnitId: id },
      orderBy: { snapshotVersion: "desc" },
      select: { snapshotVersion: true },
    });
    const snapshotVersion = (last?.snapshotVersion ?? 0) + 1;

    // Build full snapshot payload — spec §29:
    // Must capture: Application metadata, Submission metadata, SubmissionUnit metadata,
    // CoUs, Documents + selected DocumentVersions (with checksums), Keywords,
    // Relationships, Regulatory package references, Regional package references.
    const [cous, submissionLinks, ectdStandard, cvLinks] = await Promise.all([
      this.prisma.contextOfUse.findMany({
        where: { submissionUnitId: id },
        include: {
          document: {
            include: {
              currentVersion: {
                select: { id: true, versionNumber: true, checksum: true, checksumAlgorithm: true, storageKey: true },
              },
            },
          },
          contextDefinition: { select: { code: true, codeSystem: true } },
          keywords: { include: { keywordDefinition: { select: { code: true } } } },
          sourceRelationships: { select: { targetContextId: true, relationshipType: true } },
        },
        orderBy: { createdAt: "asc" },
      }),
      this.prisma.submissionSubmissionUnit.findMany({
        where: { submissionUnitId: id },
        include: {
          submission: {
            include: {
              application: {
                include: {
                  authority: { select: { code: true } },
                  region: { select: { code: true } },
                },
              },
            },
          },
        },
      }),
      this.prisma.ectdStandard.findUnique({
        where: { id: unit.ectdStandardId },
        include: { implementationGuide: { select: { version: true, checksum: true } } },
      }),
      this.prisma.regulatoryStandardCvLink.findMany({
        where: { ectdStandardId: unit.ectdStandardId },
        include: { controlledVocabularyPackage: { select: { version: true, checksum: true } } },
      }),
    ]);

    const snapshot = await this.prisma.submissionUnitSnapshot.create({
      data: {
        submissionUnitId: id,
        snapshotVersion,
        ectdStandardId: unit.ectdStandardId,
        regionalSpecificationId: unit.regionalSpecificationId ?? null,
        ctdStructurePackageId: unit.ctdStructurePackageId ?? null,
        createdById: actorId ?? null,
        // Full frozen projection — spec §29
        payload: {
          frozenAt: new Date().toISOString(),
          submissionUnit: {
            id,
            uuid: unit.uuid,
            sequenceNumber: unit.sequenceNumber,
            priorityNumber: unit.priorityNumber,
            status: unit.status,
            ectdStandardId: unit.ectdStandardId,
            regionalSpecificationId: unit.regionalSpecificationId,
            ctdStructurePackageId: unit.ctdStructurePackageId,
          },
          regulatoryPackages: {
            ectdStandard: {
              id: unit.ectdStandardId,
              name: ectdStandard?.name,
              version: ectdStandard?.version,
              implementationGuideVersion: ectdStandard?.implementationGuide?.version ?? null,
              implementationGuideChecksum: ectdStandard?.implementationGuide?.checksum ?? null,
            },
            controlledVocabularies: cvLinks.map((l) => ({
              version: l.controlledVocabularyPackage.version,
              checksum: l.controlledVocabularyPackage.checksum,
            })),
          },
          submissions: submissionLinks.map((l) => ({
            id: l.submission.id,
            uuid: l.submission.uuid,
            submissionType: l.submission.submissionType,
            application: {
              id: l.submission.application.id,
              uuid: l.submission.application.uuid,
              applicationNumber: l.submission.application.applicationNumber,
              applicationType: l.submission.application.applicationType,
              authorityCode: l.submission.application.authority.code,
              regionCode: l.submission.application.region.code,
            },
          })),
          contextsOfUse: cous.map((cou) => ({
            id: cou.id,
            uuid: cou.uuid,
            status: cou.status,
            priorityNumber: cou.priorityNumber,
            contextCode: cou.contextDefinition.code,
            contextCodeSystem: cou.contextDefinition.codeSystem,
            document: {
              id: cou.document.id,
              uuid: cou.document.uuid,
              title: cou.document.title,
              selectedVersion: cou.document.currentVersion
                ? {
                    id: cou.document.currentVersion.id,
                    versionNumber: cou.document.currentVersion.versionNumber,
                    checksum: cou.document.currentVersion.checksum,
                    checksumAlgorithm: cou.document.currentVersion.checksumAlgorithm,
                    storageKey: cou.document.currentVersion.storageKey,
                  }
                : null,
            },
            keywords: cou.keywords.map((kw) => ({
              code: kw.keywordDefinition.code,
              value: kw.value,
            })),
            relationships: cou.sourceRelationships.map((r) => ({
              targetContextId: r.targetContextId,
              relationshipType: r.relationshipType,
            })),
          })),
        },
      },
    });

    await this.audit.record({
      organizationId,
      userId: actorId,
      eventType: "FREEZE_SUBMISSION_UNIT",
      entityType: "SubmissionUnit",
      entityId: id,
      newValue: { snapshotVersion, snapshotId: snapshot.id },
    });

    return { snapshotId: snapshot.id, snapshotVersion, submissionUnitId: id };
  }

  /**
   * validate — creates a ValidationRun record and enqueues VALIDATE_SUBMISSION_UNIT.
   * Explicit domain command — spec §33.
   * Spec §39: expensive tasks are enqueued, not run synchronously.
   * Spec §36: idempotencyKey prevents duplicate runs on retry.
   */
  async validate(
    id: string,
    dto: ValidateSubmissionUnitDto,
    organizationId: string,
    actorId?: string | undefined,
    idempotencyKey?: string | undefined,
  ): Promise<{ validationRunId: string; status: string }> {
    const unit = await this.findOne(id);
    await this.assertUnitInOrg(id, organizationId);

    if (unit.status === "PUBLISHED") {
      throw new ConflictException(
        "Published Submission Units cannot be re-validated. " +
          "Create a new Submission Unit.",
      );
    }

    const profile = await this.prisma.validationProfile.findUnique({
      where: { id: dto.validationProfileId },
    });
    if (!profile || !profile.active) {
      throw new BadRequestException(
        `ValidationProfile ${dto.validationProfileId} not found or inactive.`,
      );
    }

    // Idempotency: if a run already exists for this key, return it — spec §36
    if (idempotencyKey) {
      const existing = await this.prisma.job.findUnique({
        where: { idempotencyKey },
        select: { payload: true },
      });
      if (existing) {
        const payload = existing.payload as Record<string, unknown> | null;
        const existingRunId = payload?.["validationRunId"] as string | undefined;
        if (existingRunId) return { validationRunId: existingRunId, status: "QUEUED" };
      }
    }

    const run = await this.prisma.validationRun.create({
      data: {
        submissionUnitId: id,
        validationProfileId: dto.validationProfileId,
        status: "QUEUED",
        profileVersion: profile.rulesetVersion,
      },
    });

    // Persist job record for idempotency tracking — spec §36
    await this.prisma.job.create({
      data: {
        jobType: "VALIDATE_SUBMISSION_UNIT",
        status: "QUEUED",
        idempotencyKey: idempotencyKey ?? null,
        payload: { submissionUnitId: id, validationRunId: run.id, validationProfileId: dto.validationProfileId },
      },
    });

    // Enqueue to worker — spec §39
    await this.jobQueue.enqueue(
      "VALIDATE_SUBMISSION_UNIT",
      { submissionUnitId: id, runId: run.id, validationProfileId: dto.validationProfileId, organizationId, actorId },
      { ...(idempotencyKey !== undefined ? { idempotencyKey } : {}) },
    );

    await this.audit.record({
      organizationId,
      userId: actorId,
      eventType: "RUN_VALIDATION",
      entityType: "SubmissionUnit",
      entityId: id,
      newValue: { validationRunId: run.id, profileId: dto.validationProfileId },
    });

    return { validationRunId: run.id, status: "QUEUED" };
  }

  /**
   * generateXml — creates an XmlGenerationRun record and enqueues GENERATE_XML.
   * Explicit domain command — spec §33.
   * Spec §39: expensive tasks are enqueued, not run synchronously.
   * Spec §36: idempotencyKey prevents duplicate runs on retry.
   */
  async generateXml(
    id: string,
    organizationId: string,
    actorId?: string | undefined,
    idempotencyKey?: string | undefined,
  ): Promise<{ xmlRunId: string; status: string }> {
    const unit = await this.findOne(id);
    await this.assertUnitInOrg(id, organizationId);

    if (unit.status === "PUBLISHED") {
      throw new ConflictException("Published Submission Units are immutable.");
    }

    // Require a frozen snapshot before XML generation — spec §21
    const snapshot = await this.prisma.submissionUnitSnapshot.findFirst({
      where: { submissionUnitId: id },
      select: { id: true },
    });
    if (!snapshot) {
      throw new BadRequestException(
        "No frozen snapshot found. Run POST /submission-units/:id/freeze before generating XML.",
      );
    }

    // Idempotency — spec §36
    if (idempotencyKey) {
      const existing = await this.prisma.job.findUnique({
        where: { idempotencyKey },
        select: { payload: true },
      });
      if (existing) {
        const payload = existing.payload as Record<string, unknown> | null;
        const existingRunId = payload?.["xmlRunId"] as string | undefined;
        if (existingRunId) return { xmlRunId: existingRunId, status: "QUEUED" };
      }
    }

    const run = await this.prisma.xmlGenerationRun.create({
      data: {
        submissionUnitId: id,
        standardId: unit.ectdStandardId,
        generatorVersion: "0.1.0-phase7",
        status: "QUEUED",
      },
    });

    await this.prisma.job.create({
      data: {
        jobType: "GENERATE_XML",
        status: "QUEUED",
        idempotencyKey: idempotencyKey ?? null,
        payload: { submissionUnitId: id, xmlRunId: run.id },
      },
    });

    // Enqueue to publishing worker — spec §39
    await this.jobQueue.enqueue(
      "GENERATE_XML",
      { submissionUnitId: id, xmlRunId: run.id, organizationId, actorId },
      { ...(idempotencyKey !== undefined ? { idempotencyKey } : {}) },
    );

    await this.audit.record({
      organizationId,
      userId: actorId,
      eventType: "GENERATE_XML",
      entityType: "SubmissionUnit",
      entityId: id,
      newValue: { xmlRunId: run.id, status: "QUEUED" },
    });

    return { xmlRunId: run.id, status: "QUEUED" };
  }

  /**
   * preparePublication — dry-run publish gate via PublishingEngineService.
   * Non-destructive — spec §30.
   */
  async preparePublication(
    id: string,
    organizationId: string,
  ): Promise<{ ready: boolean; blockingIssues: Array<{ code: string; message: string }>; warnings: Array<{ code: string; message: string }> }> {
    await this.findOne(id);
    await this.assertUnitInOrg(id, organizationId);
    const result = await this.publishingEngine.preparePublication(id);
    // Map string[] issues to structured objects the frontend expects
    const blockingIssues = result.issues.map((msg) => ({ code: "GATE_BLOCKED", message: msg }));
    return { ready: result.ready, blockingIssues, warnings: [] };
  }

  /**
   * publish — full publication pipeline command.
   * NOT a PATCH status change — spec §33.
   * Delegates to PublishingEngineService (Phase 9).
   */
  async publish(
    id: string,
    dto: PublishSubmissionUnitDto,
    organizationId: string,
    actorId?: string | undefined,
  ): Promise<{ jobId: string; submissionUnitId: string; status: string }> {
    await this.findOne(id);
    await this.assertUnitInOrg(id, organizationId);

    const result = await this.publishingEngine.publish(id, organizationId, actorId);
    // Return shape aligned to frontend PublishResult contract
    return { jobId: result.packageId, submissionUnitId: id, status: result.status };
  }

  /** Verify the submission unit belongs to the given org via submission → application chain */
  private async assertUnitInOrg(
    submissionUnitId: string,
    organizationId: string,
  ): Promise<void> {
    const link = await this.prisma.submissionSubmissionUnit.findFirst({
      where: {
        submissionUnitId,
        submission: { application: { organizationId } },
      },
      select: { id: true },
    });
    if (!link) {
      throw new NotFoundException(
        `SubmissionUnit ${submissionUnitId} not found in this organization.`,
      );
    }
  }
}
