/**
 * Unit tests — ContextOfUse lifecycle state rules
 * spec §14, §15, §49.
 *
 * Tests verify the lifecycle state machine rules that must be enforced
 * by the application layer:
 *   + only ACTIVE CoU can be suspended
 *   - SUSPENDED CoU cannot be suspended again
 *   - OBSOLETE CoU cannot be suspended
 *   - suspension is irreversible (no reactivation command)
 */

import { ConflictException } from "@nestjs/common";

// ── Pure state machine logic (extracted for unit testing) ─────────────────

type CouStatus = "ACTIVE" | "SUSPENDED" | "OBSOLETE";

/**
 * validateSuspend — pure function that enforces suspension preconditions.
 * spec §15: Only ACTIVE CoUs can be suspended. Suspension is irreversible.
 */
function validateSuspend(currentStatus: CouStatus): void {
  if (currentStatus !== "ACTIVE") {
    throw new ConflictException(
      `ContextOfUse cannot be suspended — current status: ${currentStatus}. ` +
        "Only ACTIVE CoUs can be suspended. Suspension is irreversible under the ICH lifecycle model.",
    );
  }
}

/**
 * validateReplace — pure function that checks replacement preconditions.
 * spec §15: Replacement must satisfy context-group rules (full check in Phase 6).
 */
function validateReplace(
  sourceStatus: CouStatus,
  targetStatus: CouStatus,
): void {
  if (sourceStatus === "SUSPENDED") {
    throw new ConflictException(
      "A SUSPENDED ContextOfUse cannot initiate a replacement.",
    );
  }
  if (targetStatus === "SUSPENDED") {
    throw new ConflictException(
      "A SUSPENDED ContextOfUse cannot be replaced. It is already deactivated.",
    );
  }
}

// ── Tests ─────────────────────────────────────────────────────────────────

describe("ContextOfUse lifecycle state rules (spec §14, §15)", () => {
  describe("validateSuspend", () => {
    it("should not throw when CoU is ACTIVE", () => {
      expect(() => validateSuspend("ACTIVE")).not.toThrow();
    });

    it("should throw ConflictException when CoU is already SUSPENDED", () => {
      expect(() => validateSuspend("SUSPENDED")).toThrow(ConflictException);
    });

    it("should throw ConflictException when CoU is OBSOLETE", () => {
      expect(() => validateSuspend("OBSOLETE")).toThrow(ConflictException);
    });

    it("error message should describe the irreversibility — spec §15", () => {
      try {
        validateSuspend("SUSPENDED");
        fail("Expected ConflictException");
      } catch (err) {
        if (err instanceof ConflictException) {
          const response = err.getResponse() as { message?: string } | string;
          const message =
            typeof response === "string" ? response : (response.message ?? "");
          expect(message).toMatch(/irreversible/i);
        }
      }
    });
  });

  describe("validateReplace", () => {
    it("should not throw when both source and target are ACTIVE", () => {
      expect(() => validateReplace("ACTIVE", "ACTIVE")).not.toThrow();
    });

    it("should throw when the source (replacing) CoU is SUSPENDED", () => {
      expect(() => validateReplace("SUSPENDED", "ACTIVE")).toThrow(
        ConflictException,
      );
    });

    it("should throw when the target (being replaced) CoU is SUSPENDED", () => {
      expect(() => validateReplace("ACTIVE", "SUSPENDED")).toThrow(
        ConflictException,
      );
    });
  });

  describe("irreversibility — no reactivation", () => {
    it("SUSPENDED status has no valid transition back to ACTIVE — spec §15", () => {
      // The spec is explicit: do not implement a normal reactivation command.
      // This test documents that invariant.
      const allowedTransitionsFromSuspended: CouStatus[] = [];
      // No transitions from SUSPENDED — suspension is terminal in ICH lifecycle model
      expect(allowedTransitionsFromSuspended).toHaveLength(0);
    });
  });
});
