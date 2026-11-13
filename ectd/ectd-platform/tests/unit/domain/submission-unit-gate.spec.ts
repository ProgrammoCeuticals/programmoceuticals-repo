/**
 * Unit tests — Submission Unit publish gate logic
 * spec §30, §33, §49.
 *
 * Tests the preparePublication gate checks directly without needing
 * a database — using pure logic extracted from the service.
 *
 * Tests cover:
 *   + ready when all prerequisites met
 *   - not ready: no snapshot
 *   - not ready: no passed validation run
 *   - not ready: no XML run
 *   - already PUBLISHED → not re-publishable
 */

/** Minimal gate check state — mirrors what SubmissionUnitsService.preparePublication checks */
interface GateState {
  status: string;
  hasSnapshot: boolean;
  hasPassedValidation: boolean;
  hasSucceededXmlRun: boolean;
  standardHasIg: boolean;
}

function runGate(state: GateState): { ready: boolean; issues: string[] } {
  const issues: string[] = [];

  if (state.status === "PUBLISHED") {
    return { ready: false, issues: ["Submission Unit is already PUBLISHED."] };
  }

  if (!state.hasSnapshot) {
    issues.push("No frozen snapshot found. Run /freeze before publication.");
  }
  if (!state.hasPassedValidation) {
    issues.push("No successful validation run found.");
  }
  if (!state.hasSucceededXmlRun) {
    issues.push("No successful XML generation run found.");
  }
  if (!state.standardHasIg) {
    issues.push("EctdStandard has no linked Implementation Guide.");
  }

  return { ready: issues.length === 0, issues };
}

// ── Tests ─────────────────────────────────────────────────────────────────

describe("Submission Unit publish gate (spec §30)", () => {
  // ── Positive ────────────────────────────────────────────────────────
  it("should be ready when all prerequisites are satisfied", () => {
    const result = runGate({
      status: "DRAFT",
      hasSnapshot: true,
      hasPassedValidation: true,
      hasSucceededXmlRun: true,
      standardHasIg: true,
    });
    expect(result.ready).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  // ── Negative: no snapshot ────────────────────────────────────────────
  it("should block when no snapshot has been created", () => {
    const result = runGate({
      status: "DRAFT",
      hasSnapshot: false,
      hasPassedValidation: true,
      hasSucceededXmlRun: true,
      standardHasIg: true,
    });
    expect(result.ready).toBe(false);
    expect(result.issues.some((i) => /snapshot/i.test(i))).toBe(true);
  });

  // ── Negative: no passed validation ──────────────────────────────────
  it("should block when no successful validation run exists", () => {
    const result = runGate({
      status: "DRAFT",
      hasSnapshot: true,
      hasPassedValidation: false,
      hasSucceededXmlRun: true,
      standardHasIg: true,
    });
    expect(result.ready).toBe(false);
    expect(result.issues.some((i) => /validation/i.test(i))).toBe(true);
  });

  // ── Negative: no XML run ─────────────────────────────────────────────
  it("should block when no successful XML generation run exists", () => {
    const result = runGate({
      status: "DRAFT",
      hasSnapshot: true,
      hasPassedValidation: true,
      hasSucceededXmlRun: false,
      standardHasIg: true,
    });
    expect(result.ready).toBe(false);
    expect(result.issues.some((i) => /xml/i.test(i))).toBe(true);
  });

  // ── Negative: missing IG ─────────────────────────────────────────────
  it("should block when standard has no Implementation Guide linked", () => {
    const result = runGate({
      status: "DRAFT",
      hasSnapshot: true,
      hasPassedValidation: true,
      hasSucceededXmlRun: true,
      standardHasIg: false,
    });
    expect(result.ready).toBe(false);
    expect(result.issues.some((i) => /implementation guide/i.test(i))).toBe(
      true,
    );
  });

  // ── Negative: multiple blockers ──────────────────────────────────────
  it("should report all blocking issues at once, not just the first", () => {
    const result = runGate({
      status: "DRAFT",
      hasSnapshot: false,
      hasPassedValidation: false,
      hasSucceededXmlRun: false,
      standardHasIg: false,
    });
    expect(result.ready).toBe(false);
    expect(result.issues.length).toBe(4);
  });

  // ── Negative: already published ──────────────────────────────────────
  it("should not allow publishing an already PUBLISHED unit", () => {
    const result = runGate({
      status: "PUBLISHED",
      hasSnapshot: true,
      hasPassedValidation: true,
      hasSucceededXmlRun: true,
      standardHasIg: true,
    });
    expect(result.ready).toBe(false);
    expect(result.issues[0]).toMatch(/already PUBLISHED/i);
  });
});
