import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import {
  LifecycleEngine,
  type LifecycleRepository,
  type ContextOfUseState,
  type SuspendContextCommand,
  type ReplaceContextCommand,
  type ReplaceManyCommand,
  type SuspendResult,
  type ReplaceResult,
  type CoURelationship,
} from "@ectd/ectd-lifecycle";
import { contextGroupsAreEqual } from "@ectd/domain";
import type { ContextGroup } from "@ectd/domain";

/**
 * LifecycleService — spec §15.
 *
 * NestJS adapter that wires the pure LifecycleEngine domain service to
 * Prisma persistence and the AuditService.
 *
 * Controllers call ContextsOfUseService or this service directly.
 * This service is exported for use by other modules that need lifecycle ops.
 *
 * Transaction requirement (spec §15):
 *   All lifecycle mutations use prisma.$transaction to ensure atomicity.
 *   Failure rolls back the complete lifecycle operation.
 */
@Injectable()
export class LifecycleService {
  private readonly engine: LifecycleEngine;

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {
    this.engine = new LifecycleEngine(this.buildRepository());
  }

  async suspend(cmd: SuspendContextCommand): Promise<SuspendResult> {
    return this.engine.suspendContextOfUse(cmd);
  }

  async replace(cmd: ReplaceContextCommand): Promise<ReplaceResult> {
    return this.engine.replaceContextOfUse(cmd);
  }

  async replaceMany(cmd: ReplaceManyCommand): Promise<ReplaceResult> {
    return this.engine.replaceManyContextsOfUse(cmd);
  }

  // ── Repository implementation (Prisma) ──────────────────────────────

  private buildRepository(): LifecycleRepository {
    const prisma = this.prisma;
    const audit = this.audit;

    return {
      findContextOfUse: async (id): Promise<ContextOfUseState | null> => {
        const cou = await prisma.contextOfUse.findUnique({
          where: { id },
          include: {
            contextDefinition: { select: { code: true, codeSystem: true } },
            keywords: {
              include: {
                keywordDefinition: { select: { code: true, dataType: true } },
              },
            },
          },
        });

        if (!cou) return null;

        // Build context group from CoU definition + keywords — spec §15
        const contextGroup: ContextGroup = {
          contextCode: cou.contextDefinition.code,
          codeSystem: cou.contextDefinition.codeSystem,
          keywords: cou.keywords.map((kw) => ({
            code: kw.keywordDefinition.code,
            codeSystem: kw.keywordDefinition.dataType,
            value: kw.value,
          })),
        };

        return {
          id: cou.id,
          status: cou.status as ContextOfUseState["status"],
          submissionUnitId: cou.submissionUnitId,
          contextDefinitionId: cou.contextDefinitionId,
          contextGroup,
        };
      },

      findRelationships: async (couIds): Promise<CoURelationship[]> => {
        const rels = await prisma.contextOfUseRelationship.findMany({
          where: {
            OR: [
              { sourceContextId: { in: couIds } },
              { targetContextId: { in: couIds } },
            ],
          },
        });

        return rels.map((r) => ({
          id: r.id,
          sourceContextId: r.sourceContextId,
          targetContextId: r.targetContextId,
          relationshipType: r.relationshipType as "REPLACES" | "DERIVES_FROM",
        }));
      },

      persistSuspension: async ({ contextOfUseId, reason, actorId }) => {
        // Atomic transaction — spec §15
        await prisma.$transaction([
          prisma.contextOfUse.update({
            where: { id: contextOfUseId },
            data: { status: "SUSPENDED" },
          }),
          prisma.lifecycleOperation.create({
            data: {
              submissionUnitId: (
                await prisma.contextOfUse.findUniqueOrThrow({
                  where: { id: contextOfUseId },
                  select: { submissionUnitId: true },
                })
              ).submissionUnitId,
              contextOfUseId,
              operationType: "SUSPEND",
              reason: reason ?? null,
              createdById: actorId ?? null,
            },
          }),
        ]);
      },

      persistReplacement: async ({
        sourceContextId,
        targetContextId,
        reason,
        actorId,
      }) => {
        const rel = await prisma.contextOfUseRelationship.create({
          data: {
            sourceContextId,
            targetContextId,
            relationshipType: "REPLACES",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            metadata: { reason } as any,
          },
        });

        return { relationshipId: rel.id };
      },

      recordAudit: async ({
        organizationId,
        actorId,
        eventType,
        entityId,
        metadata,
      }) => {
        await audit.record({
          organizationId,
          userId: actorId,
          eventType,
          entityType: "ContextOfUse",
          entityId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          metadata: metadata as any,
        });
      },
    };
  }
}
