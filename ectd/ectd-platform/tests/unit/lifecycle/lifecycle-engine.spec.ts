/**
 * Unit tests — LifecycleEngine
 * spec §15, §49.
 *
 * Tests cover:
 *   SUSPEND:
 *     + active CoU can be suspended
 *     - already suspended CoU throws SuspensionError(ALREADY_SUSPENDED)
 *     - OBSOLETE CoU throws SuspensionError(ALREADY_OBSOLETE)
 *     - non-existent CoU throws SuspensionError(NOT_ACTIVE)
 *     + audit is always called after suspension
 *
 *   REPLACE:
 *     + active source replaces active target
 *     - self-replacement throws ReplacementError(SELF_REPLACEMENT)
 *     - suspended source throws ReplacementError(SOURCE_SUSPENDED)
 *     - suspended target throws ReplacementError(TARGET_SUSPENDED)
 *     - cycle detection throws ReplacementError(CARDINALITY_VIOLATION)
 *     + mismatched context groups produce a warning, not a block (REGULATORY_GAP)
 *     + relationships are persisted with correct source/target
 *
 *   REPLACE MANY:
 *     + M:1 replacement succeeds and returns correct cardinality
 *     + 1:M replacement succeeds
 *
 *   RELATIONSHIP GRAPH:
 *     + cycle detected correctly
 *     + no false positive for non-cyclic chain
 *
 * SYNTHETIC — not based on real ICH lifecycle data.
 */

import {
  LifecycleEngine,
  SuspensionError,
  ReplacementError,
  RelationshipGraph,
} from "../../../packages/ectd-lifecycle/src/index";
import type {
  LifecycleRepository,
  ContextOfUseState,
} from "../../../packages/ectd-lifecycle/src/engine/lifecycle-engine";
import type { CoURelationship } from "../../../packages/ectd-lifecycle/src/graph/relationship-graph";

// ── Test double builders ───────────────────────────────────────────────────

type CouStatusType = "ACTIVE" | "SUSPENDED" | "OBSOLETE";

function makeState(
  id: string,
  status: CouStatusType = "ACTIVE",
  contextCode = "3.2.P.1",
): ContextOfUseState {
  return {
    id,
    status,
    submissionUnitId: "unit-001",
    contextDefinitionId: "cd-001",
    contextGroup: {
      contextCode,
      codeSystem: "test.oid",
      keywords: [],
    },
  };
}

function makeRepo(
  states: Map<string, ContextOfUseState>,
  existingRels: CoURelationship[] = [],
): LifecycleRepository & {
  suspensions: string[];
  replacements: Array<{ sourceContextId: string; targetContextId: string }>;
  audits: string[];
} {
  const suspensions: string[] = [];
  const replacements: Array<{
    sourceContextId: string;
    targetContextId: string;
  }> = [];
  const audits: string[] = [];
  let relIdCounter = 0;

  return {
    suspensions,
    replacements,
    audits,

    findContextOfUse: async (id) => states.get(id) ?? null,
    findRelationships: async () => existingRels,

    persistSuspension: async ({ contextOfUseId }) => {
      suspensions.push(contextOfUseId);
      // Mutate the state to simulate DB update
      const state = states.get(contextOfUseId);
      if (state) states.set(contextOfUseId, { ...state, status: "SUSPENDED" });
    },

    persistReplacement: async ({ sourceContextId, targetContextId }) => {
      replacements.push({ sourceContextId, targetContextId });
      return { relationshipId: `rel-${++relIdCounter}` };
    },

    recordAudit: async ({ eventType }) => {
      audits.push(eventType);
    },
  };
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("LifecycleEngine — suspend (spec §15)", () => {
  it("should suspend an ACTIVE CoU successfully", async () => {
    const states = new Map([["cou-1", makeState("cou-1", "ACTIVE")]]);
    const repo = makeRepo(states);
    const engine = new LifecycleEngine(repo);

    const result = await engine.suspendContextOfUse({
      contextOfUseId: "cou-1",
      organizationId: "org-1",
      reason: "No longer relevant",
      actorId: "user-1",
    });

    expect(result.contextOfUseId).toBe("cou-1");
    expect(result.previousStatus).toBe("ACTIVE");
    expect(repo.suspensions).toContain("cou-1");
    expect(repo.audits).toContain("SUSPEND_CONTEXT");
  });

  it("should throw SuspensionError(ALREADY_SUSPENDED) for a suspended CoU", async () => {
    const states = new Map([["cou-1", makeState("cou-1", "SUSPENDED")]]);
    const engine = new LifecycleEngine(makeRepo(states));

    await expect(
      engine.suspendContextOfUse({
        contextOfUseId: "cou-1",
        organizationId: "org-1",
      }),
    ).rejects.toMatchObject({ code: "ALREADY_SUSPENDED" });
  });

  it("should throw SuspensionError(ALREADY_OBSOLETE) for an obsolete CoU", async () => {
    const states = new Map([["cou-1", makeState("cou-1", "OBSOLETE")]]);
    const engine = new LifecycleEngine(makeRepo(states));

    await expect(
      engine.suspendContextOfUse({
        contextOfUseId: "cou-1",
        organizationId: "org-1",
      }),
    ).rejects.toBeInstanceOf(SuspensionError);
  });

  it("should throw SuspensionError(NOT_ACTIVE) for a non-existent CoU", async () => {
    const engine = new LifecycleEngine(makeRepo(new Map()));

    await expect(
      engine.suspendContextOfUse({
        contextOfUseId: "missing",
        organizationId: "org-1",
      }),
    ).rejects.toMatchObject({ code: "NOT_ACTIVE" });
  });

  it("should always record an audit event on successful suspension", async () => {
    const states = new Map([["cou-a", makeState("cou-a", "ACTIVE")]]);
    const repo = makeRepo(states);
    const engine = new LifecycleEngine(repo);

    await engine.suspendContextOfUse({
      contextOfUseId: "cou-a",
      organizationId: "org-1",
    });

    expect(repo.audits).toHaveLength(1);
    expect(repo.audits[0]).toBe("SUSPEND_CONTEXT");
  });

  it("should NOT record an audit event when suspension fails", async () => {
    const states = new Map([["cou-s", makeState("cou-s", "SUSPENDED")]]);
    const repo = makeRepo(states);
    const engine = new LifecycleEngine(repo);

    await expect(
      engine.suspendContextOfUse({
        contextOfUseId: "cou-s",
        organizationId: "org-1",
      }),
    ).rejects.toThrow();

    expect(repo.audits).toHaveLength(0);
  });
});

describe("LifecycleEngine — replace (spec §15)", () => {
  it("should create a replacement relationship between two ACTIVE CoUs", async () => {
    const states = new Map([
      ["cou-old", makeState("cou-old", "ACTIVE")],
      ["cou-new", makeState("cou-new", "ACTIVE")],
    ]);
    const repo = makeRepo(states);
    const engine = new LifecycleEngine(repo);

    const result = await engine.replaceContextOfUse({
      targetContextOfUseId: "cou-old",
      sourceContextOfUseId: "cou-new",
      organizationId: "org-1",
    });

    expect(result.relationshipIds).toHaveLength(1);
    expect(repo.replacements[0]).toEqual({
      sourceContextId: "cou-new",
      targetContextId: "cou-old",
    });
    expect(repo.audits).toContain("REPLACE_CONTEXT");
  });

  it("should throw ReplacementError(SELF_REPLACEMENT) when source === target", async () => {
    const states = new Map([["cou-1", makeState("cou-1", "ACTIVE")]]);
    const engine = new LifecycleEngine(makeRepo(states));

    await expect(
      engine.replaceContextOfUse({
        targetContextOfUseId: "cou-1",
        sourceContextOfUseId: "cou-1",
        organizationId: "org-1",
      }),
    ).rejects.toMatchObject({ code: "SELF_REPLACEMENT" });
  });

  it("should throw ReplacementError(SOURCE_SUSPENDED) when source is SUSPENDED", async () => {
    const states = new Map([
      ["cou-old", makeState("cou-old", "ACTIVE")],
      ["cou-new", makeState("cou-new", "SUSPENDED")],
    ]);
    const engine = new LifecycleEngine(makeRepo(states));

    await expect(
      engine.replaceContextOfUse({
        targetContextOfUseId: "cou-old",
        sourceContextOfUseId: "cou-new",
        organizationId: "org-1",
      }),
    ).rejects.toMatchObject({ code: "SOURCE_SUSPENDED" });
  });

  it("should throw ReplacementError(TARGET_SUSPENDED) when target is SUSPENDED", async () => {
    const states = new Map([
      ["cou-old", makeState("cou-old", "SUSPENDED")],
      ["cou-new", makeState("cou-new", "ACTIVE")],
    ]);
    const engine = new LifecycleEngine(makeRepo(states));

    await expect(
      engine.replaceContextOfUse({
        targetContextOfUseId: "cou-old",
        sourceContextOfUseId: "cou-new",
        organizationId: "org-1",
      }),
    ).rejects.toMatchObject({ code: "TARGET_SUSPENDED" });
  });

  it("should produce a REGULATORY_GAP warning (not block) for mismatched context groups", async () => {
    const states = new Map([
      ["cou-old", makeState("cou-old", "ACTIVE", "3.2.P.1")],
      ["cou-new", makeState("cou-new", "ACTIVE", "3.2.S.1")], // different code
    ]);
    const engine = new LifecycleEngine(makeRepo(states));

    const result = await engine.replaceContextOfUse({
      targetContextOfUseId: "cou-old",
      sourceContextOfUseId: "cou-new",
      organizationId: "org-1",
    });

    // Should succeed but warn
    expect(result.relationshipIds).toHaveLength(1);
    const gap = result.warnings.find((w) => w.includes("REGULATORY_GAP"));
    expect(gap).toBeTruthy();
  });

  it("should throw ReplacementError(CARDINALITY_VIOLATION) on cycle", async () => {
    // A → B (existing), now trying B → A (would create cycle)
    const states = new Map([
      ["cou-a", makeState("cou-a", "ACTIVE")],
      ["cou-b", makeState("cou-b", "ACTIVE")],
    ]);

    const existingRels: CoURelationship[] = [
      {
        id: "rel-existing",
        sourceContextId: "cou-a", // A replaces B
        targetContextId: "cou-b",
        relationshipType: "REPLACES",
      },
    ];

    const engine = new LifecycleEngine(makeRepo(states, existingRels));

    // Now try B → A — would create a cycle
    await expect(
      engine.replaceContextOfUse({
        targetContextOfUseId: "cou-a", // target: A
        sourceContextOfUseId: "cou-b", // source: B (B replaces A)
        organizationId: "org-1",
      }),
    ).rejects.toMatchObject({ code: "CARDINALITY_VIOLATION" });
  });
});

describe("LifecycleEngine — replaceMany (spec §15)", () => {
  it("should handle M:1 replacement (two sources, one target)", async () => {
    const states = new Map([
      ["target", makeState("target", "ACTIVE")],
      ["source-1", makeState("source-1", "ACTIVE")],
      ["source-2", makeState("source-2", "ACTIVE")],
    ]);
    const repo = makeRepo(states);
    const engine = new LifecycleEngine(repo);

    const result = await engine.replaceManyContextsOfUse({
      targetContextOfUseIds: ["target"],
      sourceContextOfUseIds: ["source-1", "source-2"],
      organizationId: "org-1",
    });

    expect(result.cardinality).toBe("M:1");
    expect(result.relationshipIds).toHaveLength(2);
  });

  it("should handle 1:M replacement (one source, two targets)", async () => {
    const states = new Map([
      ["target-1", makeState("target-1", "ACTIVE")],
      ["target-2", makeState("target-2", "ACTIVE")],
      ["source", makeState("source", "ACTIVE")],
    ]);
    const repo = makeRepo(states);
    const engine = new LifecycleEngine(repo);

    const result = await engine.replaceManyContextsOfUse({
      targetContextOfUseIds: ["target-1", "target-2"],
      sourceContextOfUseIds: ["source"],
      organizationId: "org-1",
    });

    expect(result.cardinality).toBe("1:M");
    expect(result.relationshipIds).toHaveLength(2);
  });

  it("should throw when no targets specified", async () => {
    const engine = new LifecycleEngine(makeRepo(new Map()));

    await expect(
      engine.replaceManyContextsOfUse({
        targetContextOfUseIds: [],
        sourceContextOfUseIds: ["source"],
        organizationId: "org-1",
      }),
    ).rejects.toBeInstanceOf(ReplacementError);
  });
});

describe("RelationshipGraph", () => {
  it("should detect a direct cycle (A→B, try B→A)", () => {
    const graph = new RelationshipGraph();
    graph.addNode("A", "ACTIVE");
    graph.addNode("B", "ACTIVE");
    graph.addRelationship({
      id: "r1",
      sourceContextId: "A",
      targetContextId: "B",
      relationshipType: "REPLACES",
    });

    expect(graph.wouldCreateCycle("B", "A")).toBe(true);
  });

  it("should detect a transitive cycle (A→B, B→C, try C→A)", () => {
    const graph = new RelationshipGraph();
    ["A", "B", "C"].forEach((id) => graph.addNode(id, "ACTIVE"));
    graph.addRelationship({
      id: "r1",
      sourceContextId: "A",
      targetContextId: "B",
      relationshipType: "REPLACES",
    });
    graph.addRelationship({
      id: "r2",
      sourceContextId: "B",
      targetContextId: "C",
      relationshipType: "REPLACES",
    });

    expect(graph.wouldCreateCycle("C", "A")).toBe(true);
  });

  it("should NOT report a cycle for a valid linear chain", () => {
    const graph = new RelationshipGraph();
    ["A", "B", "C", "D"].forEach((id) => graph.addNode(id, "ACTIVE"));
    graph.addRelationship({
      id: "r1",
      sourceContextId: "A",
      targetContextId: "B",
      relationshipType: "REPLACES",
    });
    graph.addRelationship({
      id: "r2",
      sourceContextId: "B",
      targetContextId: "C",
      relationshipType: "REPLACES",
    });

    // Adding D→C should not create a cycle
    expect(graph.wouldCreateCycle("D", "C")).toBe(false);
  });

  it("should return getReplaces lineage correctly", () => {
    const graph = new RelationshipGraph();
    ["A", "B", "C"].forEach((id) => graph.addNode(id, "ACTIVE"));
    graph.addRelationship({
      id: "r1",
      sourceContextId: "A",
      targetContextId: "B",
      relationshipType: "REPLACES",
    });
    graph.addRelationship({
      id: "r2",
      sourceContextId: "B",
      targetContextId: "C",
      relationshipType: "REPLACES",
    });

    const replacedByA = graph.getReplaces("A");
    expect(replacedByA).toContain("B");
    expect(replacedByA).toContain("C");
  });
});
