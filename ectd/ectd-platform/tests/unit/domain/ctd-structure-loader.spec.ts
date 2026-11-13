/**
 * Unit tests — CtdStructureLoader
 * spec §13, §49.
 *
 * CTD structure is configuration. The loader resolves context definitions
 * from the database. Tests verify:
 *   + loadModules returns modules in order
 *   + resolveContextDefinition returns correct definition
 *   - resolveContextDefinition throws (fail closed) for unknown code
 *   + buildSectionTree produces correct hierarchy
 *   + buildSectionTree sorts by displayOrder
 *
 * SYNTHETIC — not based on real ICH CTD codes.
 */

import {
  CtdStructureLoader,
  type ICtdStructureRepository,
} from "../../../packages/ectd-domain/src/ctd/ctd-structure-loader";
import type {
  CtdModuleRecord,
  CtdSectionRecord,
  ContextDefinitionRecord,
} from "../../../packages/ectd-domain/src/ctd/ctd-structure.types";

// ── Synthetic test data ───────────────────────────────────────────────────

const MODULES: CtdModuleRecord[] = [
  {
    id: "m1",
    packageId: "pkg1",
    moduleNumber: "3",
    title: "Quality",
    displayOrder: 3,
  },
  {
    id: "m2",
    packageId: "pkg1",
    moduleNumber: "5",
    title: "Clinical",
    displayOrder: 5,
  },
  {
    id: "m3",
    packageId: "pkg1",
    moduleNumber: "1",
    title: "Admin",
    displayOrder: 1,
  },
];

const SECTIONS: CtdSectionRecord[] = [
  {
    id: "s1",
    moduleId: "m1",
    parentId: null,
    sectionCode: "3.2",
    title: "Body of Data",
    level: 2,
    displayOrder: 1,
  },
  {
    id: "s2",
    moduleId: "m1",
    parentId: "s1",
    sectionCode: "3.2.P",
    title: "Drug Product",
    level: 3,
    displayOrder: 2,
  },
  {
    id: "s3",
    moduleId: "m1",
    parentId: "s1",
    sectionCode: "3.2.S",
    title: "Drug Substance",
    level: 3,
    displayOrder: 1,
  },
  {
    id: "s4",
    moduleId: "m1",
    parentId: null,
    sectionCode: "3.1",
    title: "Table of Contents",
    level: 2,
    displayOrder: 0,
  },
];

const CONTEXT_DEFS: ContextDefinitionRecord[] = [
  {
    id: "cd1",
    structurePackageId: "pkg1",
    ctdSectionId: "s2",
    code: "3.2.P.1",
    codeSystem: "test.oid",
    name: "Drug Product Description",
    description: null,
  },
  {
    id: "cd2",
    structurePackageId: "pkg1",
    ctdSectionId: "s3",
    code: "3.2.S.1",
    codeSystem: "test.oid",
    name: "Drug Substance",
    description: null,
  },
];

function makeRepo(): ICtdStructureRepository {
  return {
    findModules: async () => MODULES,
    findSections: async (moduleId) =>
      SECTIONS.filter((s) => s.moduleId === moduleId),
    findAllSectionsForPackage: async () => SECTIONS,
    findContextDefinitions: async () => CONTEXT_DEFS,
    findContextDefinitionByCode: async (_, code, codeSystem) =>
      CONTEXT_DEFS.find(
        (d) => d.code === code && d.codeSystem === codeSystem,
      ) ?? null,
    findContextDefinitionById: async (id) =>
      CONTEXT_DEFS.find((d) => d.id === id) ?? null,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────

describe("CtdStructureLoader (spec §13)", () => {
  describe("loadModules", () => {
    it("should return all modules for the package", async () => {
      const loader = new CtdStructureLoader(makeRepo());
      const modules = await loader.loadModules("pkg1");
      expect(modules).toHaveLength(3);
    });

    it("should include the correct module numbers", async () => {
      const loader = new CtdStructureLoader(makeRepo());
      const modules = await loader.loadModules("pkg1");
      const numbers = modules.map((m) => m.moduleNumber);
      expect(numbers).toContain("3");
      expect(numbers).toContain("5");
      expect(numbers).toContain("1");
    });
  });

  describe("resolveContextDefinition", () => {
    it("should resolve an existing context definition by code and codeSystem", async () => {
      const loader = new CtdStructureLoader(makeRepo());
      const def = await loader.resolveContextDefinition(
        "pkg1",
        "3.2.P.1",
        "test.oid",
      );
      expect(def.id).toBe("cd1");
      expect(def.name).toBe("Drug Product Description");
    });

    it("should throw (fail closed) for an unknown code — spec §4.5", async () => {
      const loader = new CtdStructureLoader(makeRepo());
      await expect(
        loader.resolveContextDefinition("pkg1", "UNKNOWN.CODE", "test.oid"),
      ).rejects.toThrow(/ContextDefinition not found/i);
    });

    it("error message should mention the code and suggest not inventing codes", async () => {
      const loader = new CtdStructureLoader(makeRepo());
      await expect(
        loader.resolveContextDefinition("pkg1", "INVENTED", "test.oid"),
      ).rejects.toThrow(/authoritative/i);
    });
  });

  describe("buildSectionTree", () => {
    it("should produce a tree with correct parent-child relationships", () => {
      const loader = new CtdStructureLoader(makeRepo());
      const tree = loader.buildSectionTree(SECTIONS);

      // Two root sections (parentId = null): s1 (3.2) and s4 (3.1)
      expect(tree).toHaveLength(2);

      // s1 has two children: s2 (3.2.P) and s3 (3.2.S)
      const s1 = tree.find((n) => n.sectionCode === "3.2");
      expect(s1).toBeDefined();
      expect(s1!.children).toHaveLength(2);
    });

    it("should sort roots and children by displayOrder", () => {
      const loader = new CtdStructureLoader(makeRepo());
      const tree = loader.buildSectionTree(SECTIONS);

      // Root: s4 (displayOrder: 0) should come before s1 (displayOrder: 1)
      expect(tree[0]!.sectionCode).toBe("3.1");
      expect(tree[1]!.sectionCode).toBe("3.2");

      // Children of s1: s3 (3.2.S, displayOrder:1) before s2 (3.2.P, displayOrder:2)
      const s1 = tree.find((n) => n.sectionCode === "3.2")!;
      expect(s1.children[0]!.sectionCode).toBe("3.2.S");
      expect(s1.children[1]!.sectionCode).toBe("3.2.P");
    });

    it("should handle an empty section list", () => {
      const loader = new CtdStructureLoader(makeRepo());
      const tree = loader.buildSectionTree([]);
      expect(tree).toHaveLength(0);
    });
  });
});
