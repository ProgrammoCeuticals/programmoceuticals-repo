/**
 * Unit tests — RegulatoryResolverService
 * spec §49, §2, §4.5.
 *
 * Tests cover:
 *   + positive: full profile resolved from complete data
 *   - negative: missing IG → throws (fail closed)
 *   - negative: missing CV → throws (fail closed)
 *   - negative: artifact not ACTIVE → throws (fail closed)
 *   - edge: no regional spec → resolves without regional fields
 *
 * SYNTHETIC — not based on real ICH package data.
 */

import { RegulatoryResolverService } from "../../../packages/ectd-standards/src/resolver/regulatory-resolver.service";
import type { ISubmissionUnitProfileRepository } from "../../../packages/ectd-standards/src/resolver/regulatory-resolver.service";

// ── Test double builder ──────────────────────────────────────────────────

function makeRepo(
  overrides: Partial<{
    unit: Awaited<
      ReturnType<ISubmissionUnitProfileRepository["findSubmissionUnit"]>
    >;
    standard: Awaited<
      ReturnType<ISubmissionUnitProfileRepository["findEctdStandard"]>
    >;
    ig: Awaited<
      ReturnType<ISubmissionUnitProfileRepository["findImplementationGuide"]>
    >;
    cv: Awaited<
      ReturnType<
        ISubmissionUnitProfileRepository["findControlledVocabularyForStandard"]
      >
    >;
    artifact: Awaited<
      ReturnType<ISubmissionUnitProfileRepository["findArtifact"]>
    >;
    regional: Awaited<
      ReturnType<ISubmissionUnitProfileRepository["findRegionalSpecification"]>
    >;
  }> = {},
): ISubmissionUnitProfileRepository {
  return {
    findSubmissionUnit: async () =>
      overrides.unit !== undefined
        ? overrides.unit
        : { ectdStandardId: "std-001", regionalSpecificationId: null },

    findEctdStandard: async () =>
      overrides.standard !== undefined
        ? overrides.standard
        : {
            name: "ICH eCTD v4.0",
            version: "4.0",
            implementationGuideId: "ig-001",
          },

    findImplementationGuide: async () =>
      overrides.ig !== undefined
        ? overrides.ig
        : {
            version: "1.7",
            checksum:
              "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
            sourceArtifactId: null,
          },

    findControlledVocabularyForStandard: async () =>
      overrides.cv !== undefined
        ? overrides.cv
        : {
            version: "1.0.3",
            checksum:
              "fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
            sourceArtifactId: null,
          },

    findArtifact: async () =>
      overrides.artifact !== undefined
        ? overrides.artifact
        : { checksum: "artifact-checksum", status: "ACTIVE" },

    findRegionalSpecification: async () =>
      overrides.regional !== undefined
        ? overrides.regional
        : { name: "FDA Regional Module 1", version: "1.0" },
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────

describe("RegulatoryResolverService", () => {
  // ── Positive: full resolution ────────────────────────────────────────
  describe("resolveForSubmissionUnit — success", () => {
    it("should resolve a complete profile when all packages are linked and ACTIVE", async () => {
      const resolver = new RegulatoryResolverService(makeRepo());
      const profile = await resolver.resolveForSubmissionUnit("unit-001");

      expect(profile.ectdStandardId).toBe("std-001");
      expect(profile.implementationGuideVersion).toBe("1.7");
      expect(profile.implementationGuideChecksum).toBeTruthy();
      expect(profile.controlledVocabularyVersion).toBe("1.0.3");
      expect(profile.controlledVocabularyChecksum).toBeTruthy();
      expect(profile.schemaPackageChecksum).toBeTruthy();
    });

    it("should resolve without regional fields when no regional spec is linked", async () => {
      const resolver = new RegulatoryResolverService(
        makeRepo({
          unit: { ectdStandardId: "std-001", regionalSpecificationId: null },
        }),
      );
      const profile = await resolver.resolveForSubmissionUnit("unit-no-region");

      expect(profile.regionalSpecificationId).toBeUndefined();
      expect(profile.regionalSpecificationVersion).toBeUndefined();
    });

    it("should include regional spec fields when a regional spec is linked", async () => {
      const resolver = new RegulatoryResolverService(
        makeRepo({
          unit: {
            ectdStandardId: "std-001",
            regionalSpecificationId: "reg-001",
          },
          regional: { name: "FDA Regional M1", version: "2.6" },
        }),
      );
      const profile =
        await resolver.resolveForSubmissionUnit("unit-with-region");

      expect(profile.regionalSpecificationId).toBe("reg-001");
      expect(profile.regionalSpecificationVersion).toBe("2.6");
    });

    it("should use artifact checksum when IG has no direct checksum but has linked artifact", async () => {
      const resolver = new RegulatoryResolverService(
        makeRepo({
          ig: { version: "1.7", checksum: null, sourceArtifactId: "art-001" },
          artifact: {
            checksum: "artifact-sha256-checksum-value-here",
            status: "ACTIVE",
          },
        }),
      );
      const profile = await resolver.resolveForSubmissionUnit(
        "unit-artifact-checksum",
      );

      expect(profile.implementationGuideChecksum).toBe(
        "artifact-sha256-checksum-value-here",
      );
    });
  });

  // ── Negative: submission unit not found ──────────────────────────────
  describe("resolveForSubmissionUnit — submission unit not found", () => {
    it("should throw when submission unit does not exist", async () => {
      const resolver = new RegulatoryResolverService(makeRepo({ unit: null }));

      await expect(
        resolver.resolveForSubmissionUnit("missing-unit"),
      ).rejects.toThrow(/not found/i);
    });
  });

  // ── Negative: standard not found ────────────────────────────────────
  describe("resolveForSubmissionUnit — standard not found", () => {
    it("should throw when ectdStandard cannot be found", async () => {
      const resolver = new RegulatoryResolverService(
        makeRepo({ standard: null }),
      );

      await expect(
        resolver.resolveForSubmissionUnit("unit-001"),
      ).rejects.toThrow(/EctdStandard/);
    });
  });

  // ── Negative: no IG linked ───────────────────────────────────────────
  describe("resolveForSubmissionUnit — no Implementation Guide", () => {
    it("should throw (fail closed) when standard has no IG linked — spec §4.5", async () => {
      const resolver = new RegulatoryResolverService(
        makeRepo({
          standard: {
            name: "ICH eCTD v4.0",
            version: "4.0",
            implementationGuideId: null,
          },
        }),
      );

      await expect(
        resolver.resolveForSubmissionUnit("unit-001"),
      ).rejects.toThrow(/Implementation Guide/);
    });
  });

  // ── Negative: IG artifact not ACTIVE ────────────────────────────────
  describe("resolveForSubmissionUnit — IG artifact not ACTIVE", () => {
    it("should throw when IG artifact is IMPORTING — must be ACTIVE before use", async () => {
      const resolver = new RegulatoryResolverService(
        makeRepo({
          ig: { version: "1.7", checksum: null, sourceArtifactId: "art-001" },
          artifact: { checksum: "some-checksum", status: "IMPORTING" },
        }),
      );

      await expect(
        resolver.resolveForSubmissionUnit("unit-001"),
      ).rejects.toThrow(/not ACTIVE/i);
    });

    it("should throw when IG artifact is FAILED", async () => {
      const resolver = new RegulatoryResolverService(
        makeRepo({
          ig: { version: "1.7", checksum: null, sourceArtifactId: "art-001" },
          artifact: { checksum: "some-checksum", status: "FAILED" },
        }),
      );

      await expect(
        resolver.resolveForSubmissionUnit("unit-001"),
      ).rejects.toThrow(/not ACTIVE/i);
    });
  });

  // ── Negative: no CV package ──────────────────────────────────────────
  describe("resolveForSubmissionUnit — no Controlled Vocabulary", () => {
    it("should throw (fail closed) when no CV package is linked to the standard", async () => {
      const resolver = new RegulatoryResolverService(makeRepo({ cv: null }));

      await expect(
        resolver.resolveForSubmissionUnit("unit-001"),
      ).rejects.toThrow(/Controlled Vocabulary/);
    });
  });

  // ── Negative: regional spec registered but missing ───────────────────
  describe("resolveForSubmissionUnit — regional spec not found", () => {
    it("should throw when linked regional spec id cannot be resolved", async () => {
      const resolver = new RegulatoryResolverService(
        makeRepo({
          unit: {
            ectdStandardId: "std-001",
            regionalSpecificationId: "reg-missing",
          },
          regional: null,
        }),
      );

      await expect(
        resolver.resolveForSubmissionUnit("unit-001"),
      ).rejects.toThrow(/RegionalSpecification/);
    });
  });
});
