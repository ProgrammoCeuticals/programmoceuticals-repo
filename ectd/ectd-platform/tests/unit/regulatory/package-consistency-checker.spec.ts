/**
 * Unit tests — PackageConsistencyChecker
 * spec §49, §3, §8.
 *
 * Tests cover:
 *   + positive: no conflicts → canActivate = true
 *   - negative: duplicate version → canActivate = false (ERROR finding)
 *   ~ warning: existing active older version → warning but still activatable
 *   ~ warning: missing effective date on standards package → warning finding
 *
 * SYNTHETIC — not based on real ICH package data.
 */

import { PackageConsistencyChecker } from "../../../packages/ectd-standards/src/consistency/package-consistency-checker";
import type { IPackageConsistencyRepository } from "../../../packages/ectd-standards/src/consistency/package-consistency-checker";

function makeRepo(
  existing: Array<{
    id: string;
    name: string;
    version: string;
    status: string;
  }> = [],
): IPackageConsistencyRepository {
  return {
    findActiveByName: async () => existing,
  };
}

describe("PackageConsistencyChecker", () => {
  // ── Positive: clean slate ────────────────────────────────────────────
  describe("check — no conflicts", () => {
    it("should allow activation when no other active versions exist", async () => {
      const checker = new PackageConsistencyChecker(makeRepo([]));

      const result = await checker.check({
        artifactId: "art-new",
        name: "ICH eCTD v4.0 IG",
        version: "1.7",
        packageType: "IMPLEMENTATION_GUIDE",
        effectiveDate: new Date("2024-01-01"),
      });

      expect(result.canActivate).toBe(true);
      const errors = result.findings.filter((f) => f.severity === "ERROR");
      expect(errors).toHaveLength(0);
    });
  });

  // ── Negative: exact duplicate version ───────────────────────────────
  describe("check — duplicate version", () => {
    it("should block activation with ERROR when exact name+version already ACTIVE", async () => {
      const checker = new PackageConsistencyChecker(
        makeRepo([
          {
            id: "art-existing",
            name: "ICH eCTD v4.0 IG",
            version: "1.7",
            status: "ACTIVE",
          },
        ]),
      );

      const result = await checker.check({
        artifactId: "art-new-different-id",
        name: "ICH eCTD v4.0 IG",
        version: "1.7",
        packageType: "IMPLEMENTATION_GUIDE",
        effectiveDate: new Date("2024-01-01"),
      });

      expect(result.canActivate).toBe(false);

      const errors = result.findings.filter((f) => f.severity === "ERROR");
      expect(errors).toHaveLength(1);
      expect(errors[0]?.code).toBe("DUPLICATE_VERSION");
    });

    it("should NOT block if the only match is the artifact itself (idempotent re-check)", async () => {
      // Same artifact id — not a conflict with itself
      const checker = new PackageConsistencyChecker(
        makeRepo([
          {
            id: "art-self",
            name: "ICH eCTD v4.0 IG",
            version: "1.7",
            status: "ACTIVE",
          },
        ]),
      );

      const result = await checker.check({
        artifactId: "art-self", // same id as the existing one
        name: "ICH eCTD v4.0 IG",
        version: "1.7",
        packageType: "IMPLEMENTATION_GUIDE",
        effectiveDate: new Date("2024-01-01"),
      });

      // Should not count itself as a duplicate
      const errors = result.findings.filter((f) => f.severity === "ERROR");
      expect(errors).toHaveLength(0);
    });
  });

  // ── Warning: missing effective date ─────────────────────────────────
  describe("check — missing effective date", () => {
    it("should produce a WARNING (not ERROR) for standards packages without effective date", async () => {
      const checker = new PackageConsistencyChecker(makeRepo([]));

      const result = await checker.check({
        artifactId: "art-001",
        name: "ICH eCTD v4.0 IG",
        version: "1.7",
        packageType: "IMPLEMENTATION_GUIDE",
        // no effectiveDate
      });

      expect(result.canActivate).toBe(true); // warnings don't block

      const warnings = result.findings.filter((f) => f.severity === "WARNING");
      expect(warnings.length).toBeGreaterThanOrEqual(1);
      expect(warnings.some((w) => w.code === "MISSING_EFFECTIVE_DATE")).toBe(
        true,
      );
    });

    it("should NOT warn about effective date for non-standards package types", async () => {
      const checker = new PackageConsistencyChecker(makeRepo([]));

      const result = await checker.check({
        artifactId: "art-001",
        name: "Some Transmission Spec",
        version: "1.0",
        packageType: "TRANSMISSION_SPECIFICATION",
        // no effectiveDate — should not warn for this type
      });

      const missingDateWarnings = result.findings.filter(
        (f) => f.code === "MISSING_EFFECTIVE_DATE",
      );
      expect(missingDateWarnings).toHaveLength(0);
    });
  });

  // ── Warning: existing older version ─────────────────────────────────
  describe("check — supersession warning", () => {
    it("should produce a WARNING when an older active version exists but still allow activation", async () => {
      const checker = new PackageConsistencyChecker(
        makeRepo([
          {
            id: "art-old",
            name: "ICH eCTD v4.0 IG",
            version: "1.6",
            status: "ACTIVE",
          },
        ]),
      );

      const result = await checker.check({
        artifactId: "art-new",
        name: "ICH eCTD v4.0 IG",
        version: "1.7", // different version — not a duplicate
        packageType: "IMPLEMENTATION_GUIDE",
        effectiveDate: new Date("2025-01-01"),
      });

      expect(result.canActivate).toBe(true); // warnings don't block

      const warnings = result.findings.filter((f) => f.severity === "WARNING");
      expect(warnings.some((w) => w.code === "EXISTING_ACTIVE_VERSION")).toBe(
        true,
      );
    });
  });
});
