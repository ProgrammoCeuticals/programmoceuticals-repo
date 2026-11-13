/**
 * LifecycleEngine — spec §15.
 *
 * The definitive domain service for lifecycle operations at Context of Use level.
 *
 * Replaces the stub in apps/api/src/modules/lifecycle/lifecycle.service.ts.
 * This is a pure domain service — no NestJS, no Prisma. All persistence is
 * via the repository interfaces below.
 *
 * Commands (spec §15):
 *   suspendContextOfUse   — irreversible, only ACTIVE CoUs
 *   replaceContextOfUse   — context-group compatible, supports 1:1/1:M/M:1/M:M
 *   changeContextGroup    — where the spec permits it (REGULATORY_GAP)
 *   reuseDocument         — distinct from replacement
 *
 * Transaction requirement (spec §15):
 *   load current state -> validate -> persist -> audit -> commit
 *   Failure rolls back the complete operation.
 *
 * REGULATORY_GAP: Context group compatibility rules for replacement are
 * structural only. Authoritative context-code-specific rules require ICH
 * IG v1.7 to be parsed and the rules engine implemented (Phase 8).
 */

import { contextGroupsAreEqual } from "@ectd/domain";
import type { ContextGroup } from "@ectd/domain";
import {
  SuspensionError,
  ReplacementError,
  LifecycleError,
} from "../errors/lifecycle.errors";
import {
  inferCardinality,
  validateCardinality,
} from "../cardinality/relationship-cardinality";
import { RelationshipGraph } from "../graph/relationship-graph";
import type { CoURelationship } from "../graph/relationship-graph";

// ── Repository interfaces ────────────────────────────────────────────────

export interface ContextOfUseState {
  id: string;
  status: "ACTIVE" | "SUSPENDED" | "OBSOLETE";
  submissionUnitId: string;
  contextDefinitionId: string;
  /** Resolved context group for this CoU */
  contextGroup: ContextGroup;
}

export interface LifecycleRepository {
  /**
   * Load a CoU state. Returns null if not found.
   */
  findContextOfUse(id: string): Promise<ContextOfUseState | null>;

  /**
   * Load all existing REPLACES relationships for a set of CoU ids.
   * Used to build the relationship graph for cycle detection.
   */
  findRelationships(couIds: string[]): Promise<CoURelationship[]>;

  /**
   * Persist a suspension atomically.
   * Must update CoU status to SUSPENDED and create a LifecycleOperation record
   * in the same database transaction.
   */
  persistSuspension(params: {
    contextOfUseId: string;
    reason: string | undefined;
    actorId: string | undefined;
  }): Promise<void>;

  /**
   * Persist a replacement relationship atomically.
   * Creates a ContextOfUseRelationship record.
   */
  persistReplacement(params: {
    sourceContextId: string; // the replacing CoU
    targetContextId: string; // the CoU being replaced
    reason: string | undefined;
    actorId: string | undefined;
  }): Promise<{ relationshipId: string }>;

  /**
   * Record an audit event for the lifecycle operation.
   */
  recordAudit(params: {
    organizationId: string;
    actorId: string | undefined;
    eventType: "SUSPEND_CONTEXT" | "REPLACE_CONTEXT";
    entityId: string;
    metadata: Record<string, unknown>;
  }): Promise<void>;
}

// ── Commands ─────────────────────────────────────────────────────────────

export interface SuspendContextCommand {
  contextOfUseId: string;
  organizationId: string;
  reason?: string | undefined;
  actorId?: string | undefined;
}

export interface ReplaceContextCommand {
  /** The CoU being replaced */
  targetContextOfUseId: string;
  /** The new CoU that replaces it */
  sourceContextOfUseId: string;
  organizationId: string;
  reason?: string | undefined;
  actorId?: string | undefined;
  /**
   * When true, skip context-group equality check.
   * REGULATORY_GAP: When this is required is unclear without IG v1.7.
   * Default: false (enforces context group compatibility).
   */
  skipContextGroupCheck?: boolean | undefined;
}

export interface ReplaceManyCommand {
  /** CoUs being replaced (targets) */
  targetContextOfUseIds: string[];
  /** CoUs doing the replacing (sources) */
  sourceContextOfUseIds: string[];
  organizationId: string;
  reason?: string | undefined;
  actorId?: string | undefined;
}

// ── Results ───────────────────────────────────────────────────────────────

export interface SuspendResult {
  contextOfUseId: string;
  previousStatus: string;
}

export interface ReplaceResult {
  relationshipIds: string[];
  cardinality: string;
  warnings: string[];
}

// ── Engine ────────────────────────────────────────────────────────────────

export class LifecycleEngine {
  constructor(private readonly repo: LifecycleRepository) {}

  /**
   * suspendContextOfUse — spec §15.
   *
   * Rules:
   *   - Only ACTIVE CoU can be suspended.
   *   - Suspension is irreversible.
   *   - No reactivation command exists.
   *   - Must be atomic: status update + lifecycle operation record.
   */
  async suspendContextOfUse(
    cmd: SuspendContextCommand,
  ): Promise<SuspendResult> {
    // ── Load state ─────────────────────────────────────────────────────
    const cou = await this.repo.findContextOfUse(cmd.contextOfUseId);
    if (!cou) {
      throw new SuspensionError(
        "NOT_ACTIVE",
        `ContextOfUse ${cmd.contextOfUseId} not found.`,
      );
    }

    // ── Validate ────────────────────────────────────────────────────────
    if (cou.status === "SUSPENDED") {
      throw new SuspensionError(
        "ALREADY_SUSPENDED",
        `ContextOfUse ${cmd.contextOfUseId} is already SUSPENDED. ` +
          "Suspension is irreversible under the ICH lifecycle model — no reactivation exists.",
      );
    }

    if (cou.status === "OBSOLETE") {
      throw new SuspensionError(
        "ALREADY_OBSOLETE",
        `ContextOfUse ${cmd.contextOfUseId} is OBSOLETE and cannot be suspended.`,
      );
    }

    if (cou.status !== "ACTIVE") {
      throw new SuspensionError(
        "NOT_ACTIVE",
        `ContextOfUse ${cmd.contextOfUseId} has status "${cou.status}". ` +
          "Only ACTIVE CoUs can be suspended.",
      );
    }

    // ── Persist (atomic) ────────────────────────────────────────────────
    await this.repo.persistSuspension({
      contextOfUseId: cmd.contextOfUseId,
      reason: cmd.reason,
      actorId: cmd.actorId,
    });

    // ── Audit ────────────────────────────────────────────────────────────
    await this.repo.recordAudit({
      organizationId: cmd.organizationId,
      actorId: cmd.actorId,
      eventType: "SUSPEND_CONTEXT",
      entityId: cmd.contextOfUseId,
      metadata: {
        previousStatus: cou.status,
        reason: cmd.reason,
        irreversible: true,
      },
    });

    return { contextOfUseId: cmd.contextOfUseId, previousStatus: cou.status };
  }

  /**
   * replaceContextOfUse — spec §15.
   *
   * Rules:
   *   - Source and target must not be SUSPENDED.
   *   - Source and target must not be the same CoU.
   *   - No cycles in the replacement graph.
   *   - Context groups must be equal (unless skipContextGroupCheck is set).
   *   - REGULATORY_GAP: Cardinality per context code awaits IG v1.7.
   */
  async replaceContextOfUse(
    cmd: ReplaceContextCommand,
  ): Promise<ReplaceResult> {
    const warnings: string[] = [];

    // ── Load state ─────────────────────────────────────────────────────
    const [target, source] = await Promise.all([
      this.repo.findContextOfUse(cmd.targetContextOfUseId),
      this.repo.findContextOfUse(cmd.sourceContextOfUseId),
    ]);

    if (!target) {
      throw new ReplacementError(
        "NOT_ACTIVE",
        `Target ContextOfUse ${cmd.targetContextOfUseId} not found.`,
      );
    }
    if (!source) {
      throw new ReplacementError(
        "NOT_ACTIVE",
        `Source (replacing) ContextOfUse ${cmd.sourceContextOfUseId} not found.`,
      );
    }

    // ── Validate ────────────────────────────────────────────────────────

    // Self-replacement
    if (cmd.targetContextOfUseId === cmd.sourceContextOfUseId) {
      throw new ReplacementError(
        "SELF_REPLACEMENT",
        "A ContextOfUse cannot replace itself.",
      );
    }

    // Source suspended
    if (source.status === "SUSPENDED") {
      throw new ReplacementError(
        "SOURCE_SUSPENDED",
        `Source (replacing) ContextOfUse ${cmd.sourceContextOfUseId} is SUSPENDED ` +
          "and cannot be used as a replacement.",
      );
    }

    // Target suspended — already deactivated, no need to replace
    if (target.status === "SUSPENDED") {
      throw new ReplacementError(
        "TARGET_SUSPENDED",
        `Target ContextOfUse ${cmd.targetContextOfUseId} is already SUSPENDED. ` +
          "A suspended CoU is already deactivated — replacement is not meaningful.",
      );
    }

    // Context group equality
    if (!cmd.skipContextGroupCheck) {
      const equal = contextGroupsAreEqual(
        source.contextGroup,
        target.contextGroup,
      );
      if (!equal) {
        warnings.push(
          "REGULATORY_GAP: Source and target context groups differ. " +
            "Context group compatibility rules for replacement require " +
            "ICH eCTD v4.0 IG v1.7 verification. " +
            "The relationship has been recorded but must be reviewed.",
        );
        // Record as warning, not blocking, until authoritative rules are available.
        // REGULATORY_GAP: This may need to be a hard block once IG v1.7 is parsed.
      }
    }

    // Cycle detection
    const existingRels = await this.repo.findRelationships([
      cmd.targetContextOfUseId,
      cmd.sourceContextOfUseId,
    ]);

    const graph = new RelationshipGraph();
    graph.addNode(cmd.targetContextOfUseId, target.status);
    graph.addNode(cmd.sourceContextOfUseId, source.status);
    for (const rel of existingRels) {
      graph.addRelationship(rel);
    }

    if (
      graph.wouldCreateCycle(cmd.sourceContextOfUseId, cmd.targetContextOfUseId)
    ) {
      throw new ReplacementError(
        "CARDINALITY_VIOLATION",
        `Adding replacement relationship from ${cmd.sourceContextOfUseId} → ` +
          `${cmd.targetContextOfUseId} would create a cycle in the lifecycle graph.`,
      );
    }

    // Cardinality check (1:1 is default — log gap for non-1:1)
    const cardinality = inferCardinality({ sourceCount: 1, targetCount: 1 });
    const cardResult = validateCardinality(
      cardinality,
      target.contextGroup.contextCode,
    );
    if (cardResult.message) warnings.push(cardResult.message);

    // ── Persist ─────────────────────────────────────────────────────────
    const { relationshipId } = await this.repo.persistReplacement({
      sourceContextId: cmd.sourceContextOfUseId,
      targetContextId: cmd.targetContextOfUseId,
      reason: cmd.reason,
      actorId: cmd.actorId,
    });

    // ── Audit ────────────────────────────────────────────────────────────
    await this.repo.recordAudit({
      organizationId: cmd.organizationId,
      actorId: cmd.actorId,
      eventType: "REPLACE_CONTEXT",
      entityId: cmd.targetContextOfUseId,
      metadata: {
        replacedBy: cmd.sourceContextOfUseId,
        relationshipId,
        reason: cmd.reason,
        warnings,
      },
    });

    return { relationshipIds: [relationshipId], cardinality, warnings };
  }

  /**
   * replaceManyContextsOfUse — M:1, 1:M, or M:M replacement.
   * Executes as a series of 1:1 replacements.
   * spec §15.
   */
  async replaceManyContextsOfUse(
    cmd: ReplaceManyCommand,
  ): Promise<ReplaceResult> {
    if (cmd.targetContextOfUseIds.length === 0) {
      throw new ReplacementError(
        "NOT_ACTIVE",
        "At least one target ContextOfUse must be specified.",
      );
    }
    if (cmd.sourceContextOfUseIds.length === 0) {
      throw new ReplacementError(
        "NOT_ACTIVE",
        "At least one source ContextOfUse must be specified.",
      );
    }

    const cardinality = inferCardinality({
      sourceCount: cmd.sourceContextOfUseIds.length,
      targetCount: cmd.targetContextOfUseIds.length,
    });

    const cardResult = validateCardinality(cardinality);
    const warnings: string[] = cardResult.message ? [cardResult.message] : [];
    const relationshipIds: string[] = [];

    // For each source-target pair, record a replacement relationship
    for (const sourceId of cmd.sourceContextOfUseIds) {
      for (const targetId of cmd.targetContextOfUseIds) {
        const result = await this.replaceContextOfUse({
          sourceContextOfUseId: sourceId,
          targetContextOfUseId: targetId,
          organizationId: cmd.organizationId,
          reason: cmd.reason,
          actorId: cmd.actorId,
          skipContextGroupCheck: false,
        });
        relationshipIds.push(...result.relationshipIds);
        warnings.push(...result.warnings.filter((w) => !warnings.includes(w)));
      }
    }

    return { relationshipIds, cardinality, warnings };
  }
}
