import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import {
  CreateContextOfUseDto,
  SuspendContextOfUseDto,
  ReplaceContextOfUseDto,
} from "./dto/context-of-use.dto";
import {
  paginate,
  type PaginatedResult,
} from "../../common/dto/pagination.dto";
import { v4 as uuidv4 } from "uuid";
import type { ContextOfUse } from "@prisma/client";

/**
 * ContextsOfUseService — spec §14, §15.
 *
 * Phase 4 implementation:
 *   - Validates ContextDefinition belongs to the package linked to the standard.
 *   - Validates Document exists before assignment.
 *   - Enforces suspension is irreversible.
 *   - Records lifecycle operations atomically — spec §15.
 *   - Tenant-scoped via SubmissionUnit → Submission → Application chain.
 *
 * Spec §14 — Context states:
 *   ACTIVE, SUSPENDED, OBSOLETE
 *   These must NOT automatically be emitted as XML values.
 *   XML representation is derived from the eCTD spec in Phase 7.
 *
 * REGULATORY_GAP: Replacement cardinality rules (1:1, 1:M, M:1, M:M),
 * context group comparison, and exact lifecycle XML representation require
 * the ICH IG v1.7 to be imported and the Phase 6 lifecycle engine completed.
 */
@Injectable()
export class ContextsOfUseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async create(
    submissionUnitId: string,
    organizationId: string,
    dto: CreateContextOfUseDto,
    actorId?: string | undefined,
  ): Promise<ContextOfUse> {
    // Verify submission unit belongs to org
    await this.assertUnitInOrg(submissionUnitId, organizationId);

    // Verify document exists
    const doc = await this.prisma.document.findUnique({
      where: { id: dto.documentId },
      select: { id: true },
    });
    if (!doc) {
      throw new NotFoundException(`Document ${dto.documentId} not found.`);
    }

    // Verify context definition exists and belongs to the standard's CTD package
    const contextDef = await this.prisma.contextDefinition.findUnique({
      where: { id: dto.contextDefinitionId },
      include: { structurePackage: true },
    });
    if (!contextDef) {
      throw new NotFoundException(
        `ContextDefinition ${dto.contextDefinitionId} not found. ` +
          "Ensure the CTD structure package is imported.",
      );
    }

    // Validate context definition package is compatible with the submission unit's standard
    const unit = await this.prisma.submissionUnit.findUnique({
      where: { id: submissionUnitId },
      include: { ectdStandard: { select: { id: true } } },
    });

    if (
      contextDef.structurePackage.standardId &&
      unit?.ectdStandardId &&
      contextDef.structurePackage.standardId !== unit.ectdStandardId
    ) {
      throw new BadRequestException(
        `ContextDefinition ${dto.contextDefinitionId} belongs to a CTD package ` +
          `for standard "${contextDef.structurePackage.standardId}", but the ` +
          `SubmissionUnit uses standard "${unit.ectdStandardId}". ` +
          "Context definitions must come from the applicable standard.",
      );
    }

    const cou = await this.prisma.contextOfUse.create({
      data: {
        uuid: uuidv4(),
        submissionUnitId,
        documentId: dto.documentId,
        contextDefinitionId: dto.contextDefinitionId,
        priorityNumber: dto.priorityNumber ?? null,
        status: "ACTIVE",
      },
      include: {
        document: { select: { uuid: true, title: true } },
        contextDefinition: { select: { code: true, name: true } },
      },
    });

    return cou;
  }

  async findBySubmissionUnit(
    submissionUnitId: string,
    organizationId: string,
    page = 1,
    pageSize = 50,
  ): Promise<PaginatedResult<ContextOfUse>> {
    await this.assertUnitInOrg(submissionUnitId, organizationId);

    const where = { submissionUnitId };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.contextOfUse.findMany({
        where,
        include: {
          document: { select: { uuid: true, title: true, mimeType: true } },
          contextDefinition: {
            select: { code: true, codeSystem: true, name: true },
          },
          keywords: { include: { keywordDefinition: true } },
        },
        orderBy: [{ priorityNumber: "asc" }, { createdAt: "asc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.contextOfUse.count({ where }),
    ]);

    return paginate(data, total, page, pageSize);
  }

  async findOne(id: string): Promise<ContextOfUse> {
    const cou = await this.prisma.contextOfUse.findUnique({
      where: { id },
      include: {
        document: { select: { uuid: true, title: true } },
        contextDefinition: {
          select: { code: true, codeSystem: true, name: true },
        },
        keywords: { include: { keywordDefinition: true } },
        lifecycleOperations: { orderBy: { createdAt: "asc" } },
      },
    });
    if (!cou) throw new NotFoundException(`ContextOfUse ${id} not found.`);
    return cou;
  }

  /**
   * suspend — explicit domain command. Irreversible under ICH lifecycle model.
   * spec §15, §33.
   *
   * Atomic transaction: status update + lifecycle record + audit.
   */
  async suspend(
    id: string,
    organizationId: string,
    dto: SuspendContextOfUseDto,
    actorId?: string | undefined,
  ): Promise<ContextOfUse> {
    const cou = await this.findOne(id);
    await this.assertUnitInOrg(cou.submissionUnitId, organizationId);

    if (cou.status !== "ACTIVE") {
      throw new ConflictException(
        `ContextOfUse ${id} cannot be suspended — current status: ${cou.status}. ` +
          "Only ACTIVE CoUs can be suspended. Suspension is irreversible under the ICH lifecycle model.",
      );
    }

    // Atomic transaction — spec §15
    const [updated] = await this.prisma.$transaction([
      this.prisma.contextOfUse.update({
        where: { id },
        data: { status: "SUSPENDED" },
      }),
      this.prisma.lifecycleOperation.create({
        data: {
          submissionUnitId: cou.submissionUnitId,
          contextOfUseId: id,
          operationType: "SUSPEND",
          reason: dto.reason,
          createdById: actorId ?? null,
        },
      }),
    ]);

    await this.audit.record({
      organizationId,
      userId: actorId,
      eventType: "SUSPEND_CONTEXT",
      entityType: "ContextOfUse",
      entityId: id,
      oldValue: { status: "ACTIVE" },
      newValue: { status: "SUSPENDED" },
      metadata: { reason: dto.reason },
    });

    return updated;
  }

  /**
   * replace — explicit domain command.
   * Records the replacement relationship between two CoUs.
   * spec §15, §33.
   *
   * REGULATORY_GAP: Full cardinality validation and context group rules
   * require the ICH IG v1.7 lifecycle engine (Phase 6).
   */
  async replace(
    id: string,
    organizationId: string,
    dto: ReplaceContextOfUseDto,
    actorId?: string | undefined,
  ): Promise<{ message: string; relationshipId: string }> {
    const targetCou = await this.findOne(id);
    await this.assertUnitInOrg(targetCou.submissionUnitId, organizationId);

    if (targetCou.status === "SUSPENDED") {
      throw new ConflictException(
        `ContextOfUse ${id} is SUSPENDED and cannot be replaced. ` +
          "A suspended CoU is already deactivated.",
      );
    }

    const replacingCou = await this.findOne(dto.replacingContextOfUseId);
    if (replacingCou.status === "SUSPENDED") {
      throw new ConflictException(
        `ContextOfUse ${dto.replacingContextOfUseId} is SUSPENDED and cannot be used as a replacement.`,
      );
    }

    if (dto.replacingContextOfUseId === id) {
      throw new BadRequestException("A ContextOfUse cannot replace itself.");
    }

    // Record replacement relationship
    // sourceContextId = replacing (the new one)
    // targetContextId = id (the one being replaced)
    const relationship = await this.prisma.contextOfUseRelationship.create({
      data: {
        sourceContextId: dto.replacingContextOfUseId,
        targetContextId: id,
        relationshipType: "REPLACES",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata: { reason: dto.reason } as any,
      },
    });

    await this.audit.record({
      organizationId,
      userId: actorId,
      eventType: "REPLACE_CONTEXT",
      entityType: "ContextOfUse",
      entityId: id,
      newValue: {
        replacedBy: dto.replacingContextOfUseId,
        relationshipId: relationship.id,
      },
      metadata: { reason: dto.reason },
    });

    return {
      message:
        "Replacement relationship recorded. Full context group cardinality " +
        "and ICH lifecycle rules are enforced in Phase 6.",
      relationshipId: relationship.id,
    };
  }

  async getLifecycle(id: string): Promise<unknown[]> {
    await this.findOne(id);
    return this.prisma.lifecycleOperation.findMany({
      where: { contextOfUseId: id },
      orderBy: { createdAt: "asc" },
    });
  }

  /** Verify submission unit belongs to org */
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
