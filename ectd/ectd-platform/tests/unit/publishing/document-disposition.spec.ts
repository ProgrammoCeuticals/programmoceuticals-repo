/**
 * Unit tests — DocumentDispositionResolver
 * spec §30, §49.
 *
 * Tests:
 *   + ACTIVE CoU with version → INCLUDE
 *   + SUSPENDED CoU → EXCLUDE
 *   + document with no version → EXCLUDE
 *   + reuse document → REFERENCE
 *   + empty list → empty results
 *   + mixed list → correct per-document dispositions
 *
 * REGULATORY_GAP: Exact INCLUDE/REFERENCE/EXCLUDE rules must be
 * confirmed from ICH IG v1.7. These tests verify the conservative defaults.
 */

import {
  resolveDocumentDispositions,
  type DocumentToResolve,
} from "../../../packages/ectd-publishing/src/disposition/document-disposition-resolver";

function makeDoc(
  overrides: Partial<DocumentToResolve> = {},
): DocumentToResolve {
  return {
    contextOfUseId: "cou-001",
    couStatus: "ACTIVE",
    documentId: "doc-001",
    hasVersion: true,
    currentVersionStorageKey: "abc/def/doc.pdf",
    ...overrides,
  };
}

describe("DocumentDispositionResolver (spec §30)", () => {
  it("should return INCLUDE for an ACTIVE CoU with a physical version", () => {
    const results = resolveDocumentDispositions([makeDoc()]);
    expect(results[0]?.disposition).toBe("INCLUDE");
    expect(results[0]?.storageKey).toBe("abc/def/doc.pdf");
  });

  it("should return EXCLUDE for a SUSPENDED CoU", () => {
    const results = resolveDocumentDispositions([
      makeDoc({ couStatus: "SUSPENDED" }),
    ]);
    expect(results[0]?.disposition).toBe("EXCLUDE");
    expect(results[0]?.reason).toMatch(/SUSPENDED/i);
  });

  it("should return EXCLUDE when document has no version", () => {
    const results = resolveDocumentDispositions([
      makeDoc({ hasVersion: false, currentVersionStorageKey: undefined }),
    ]);
    expect(results[0]?.disposition).toBe("EXCLUDE");
  });

  it("should return EXCLUDE when storage key is missing even if hasVersion is true", () => {
    const results = resolveDocumentDispositions([
      makeDoc({ hasVersion: true, currentVersionStorageKey: undefined }),
    ]);
    expect(results[0]?.disposition).toBe("EXCLUDE");
  });

  it("should return REFERENCE for a reuse document", () => {
    const results = resolveDocumentDispositions([makeDoc({ isReuse: true })]);
    expect(results[0]?.disposition).toBe("REFERENCE");
    expect(results[0]?.reason).toMatch(/reuse/i);
  });

  it("should handle empty document list", () => {
    const results = resolveDocumentDispositions([]);
    expect(results).toHaveLength(0);
  });

  it("should process each document independently in a mixed list", () => {
    const docs: DocumentToResolve[] = [
      makeDoc({ contextOfUseId: "cou-1", documentId: "doc-1" }),
      makeDoc({
        contextOfUseId: "cou-2",
        documentId: "doc-2",
        couStatus: "SUSPENDED",
      }),
      makeDoc({ contextOfUseId: "cou-3", documentId: "doc-3", isReuse: true }),
      makeDoc({
        contextOfUseId: "cou-4",
        documentId: "doc-4",
        hasVersion: false,
        currentVersionStorageKey: undefined,
      }),
    ];

    const results = resolveDocumentDispositions(docs);
    expect(results.find((r) => r.documentId === "doc-1")?.disposition).toBe(
      "INCLUDE",
    );
    expect(results.find((r) => r.documentId === "doc-2")?.disposition).toBe(
      "EXCLUDE",
    );
    expect(results.find((r) => r.documentId === "doc-3")?.disposition).toBe(
      "REFERENCE",
    );
    expect(results.find((r) => r.documentId === "doc-4")?.disposition).toBe(
      "EXCLUDE",
    );
  });
});
