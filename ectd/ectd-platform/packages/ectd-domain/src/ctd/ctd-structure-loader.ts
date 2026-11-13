/**
 * CtdStructureLoader — spec §13.
 *
 * Loads CTD structure (modules, sections, context definitions) from the
 * database. Operates as a pure domain service — no NestJS DI.
 *
 * CTD structure is configuration: loaded from the authoritative package
 * rather than hard-coded. This loader is the single point of access for
 * CTD structure data used by the Context of Use engine.
 *
 * REGULATORY_GAP: Context definition codes and code systems must be
 * loaded from the official ICH eCTD v4.0 CTD structure package, not
 * invented here. Currently returns what is in the database after import.
 */

import type {
  CtdModuleRecord,
  CtdSectionRecord,
  ContextDefinitionRecord,
} from "./ctd-structure.types";

export interface ICtdStructureRepository {
  findModules(packageId: string): Promise<CtdModuleRecord[]>;
  findSections(moduleId: string): Promise<CtdSectionRecord[]>;
  findAllSectionsForPackage(packageId: string): Promise<CtdSectionRecord[]>;
  findContextDefinitions(packageId: string): Promise<ContextDefinitionRecord[]>;
  findContextDefinitionByCode(
    packageId: string,
    code: string,
    codeSystem: string,
  ): Promise<ContextDefinitionRecord | null>;
  findContextDefinitionById(
    id: string,
  ): Promise<ContextDefinitionRecord | null>;
}

export class CtdStructureLoader {
  constructor(private readonly repo: ICtdStructureRepository) {}

  /**
   * Load all modules for a CTD structure package.
   */
  async loadModules(packageId: string): Promise<CtdModuleRecord[]> {
    return this.repo.findModules(packageId);
  }

  /**
   * Load the full section tree for a CTD structure package.
   * Returns sections in a flat array — callers build the tree if needed.
   */
  async loadSections(packageId: string): Promise<CtdSectionRecord[]> {
    return this.repo.findAllSectionsForPackage(packageId);
  }

  /**
   * Load all context definitions for a CTD structure package.
   * These are the coded regulatory contexts to which documents are assigned.
   */
  async loadContextDefinitions(
    packageId: string,
  ): Promise<ContextDefinitionRecord[]> {
    return this.repo.findContextDefinitions(packageId);
  }

  /**
   * Resolve a context definition by its regulatory code and code system.
   * Throws if not found — fail closed per spec §4.5.
   */
  async resolveContextDefinition(
    packageId: string,
    code: string,
    codeSystem: string,
  ): Promise<ContextDefinitionRecord> {
    const def = await this.repo.findContextDefinitionByCode(
      packageId,
      code,
      codeSystem,
    );

    if (!def) {
      throw new Error(
        `CtdStructureLoader: ContextDefinition not found for ` +
          `code="${code}" codeSystem="${codeSystem}" ` +
          `in package "${packageId}". ` +
          "Ensure the CTD structure package is imported and the code is " +
          "from the authoritative package — do not invent codes.",
      );
    }

    return def;
  }

  /**
   * Build a hierarchical section tree from a flat section list.
   * Used for display purposes only — storage is always flat.
   */
  buildSectionTree(
    sections: CtdSectionRecord[],
  ): Array<CtdSectionRecord & { children: CtdSectionRecord[] }> {
    type WithChildren = CtdSectionRecord & { children: CtdSectionRecord[] };
    const map = new Map<string, WithChildren>();

    for (const s of sections) {
      map.set(s.id, { ...s, children: [] });
    }

    const roots: WithChildren[] = [];
    for (const s of map.values()) {
      if (s.parentId && map.has(s.parentId)) {
        map.get(s.parentId)!.children.push(s);
      } else {
        roots.push(s);
      }
    }

    // Sort each level by displayOrder
    const sortChildren = (nodes: WithChildren[]): void => {
      nodes.sort((a, b) => a.displayOrder - b.displayOrder);
      nodes.forEach((n) => sortChildren(n.children as WithChildren[]));
    };
    sortChildren(roots);

    return roots;
  }
}
