/**
 * CTD Structure domain types — spec §13.
 *
 * CTD structure is configuration, not business logic.
 * The exact CTD section codes, display names, and hierarchy must be loaded
 * from an authoritative package — not hard-coded here.
 *
 * REGULATORY_GAP: ICH CTD table-of-contents structure package must be
 * imported and its codes/hierarchy verified against official ICH guidance
 * before ContextDefinitions can be created authoritatively.
 *
 * The types here represent the internal domain model for persisted
 * CTD structure data. They are NOT XML objects.
 */

export interface CtdModuleRecord {
  id: string;
  packageId: string;
  moduleNumber: string; // e.g. "1", "2", "3", "4", "5"
  title: string;
  displayOrder: number;
}

export interface CtdSectionRecord {
  id: string;
  moduleId: string;
  parentId: string | null;
  sectionCode: string; // e.g. "3.2.P.1", "3.2.S.1.1"
  title: string;
  level: number;
  displayOrder: number;
}

export interface ContextDefinitionRecord {
  id: string;
  structurePackageId: string;
  ctdSectionId: string;
  code: string;
  codeSystem: string;
  name: string;
  description: string | null;
}

/**
 * ICH CTD Module numbers and baseline titles.
 * These are the standard module numbers defined in the ICH CTD guideline.
 *
 * REGULATORY_GAP: Section titles and codes within each module are
 * authority-specific. The values below are structural placeholders.
 * Load authoritative codes from the imported CTD structure package.
 */
export const ICH_CTD_MODULES = [
  {
    moduleNumber: "1",
    title: "Regional Administrative Information",
    displayOrder: 1,
  },
  {
    moduleNumber: "2",
    title: "Common Technical Document Summaries",
    displayOrder: 2,
  },
  { moduleNumber: "3", title: "Quality", displayOrder: 3 },
  { moduleNumber: "4", title: "Nonclinical Study Reports", displayOrder: 4 },
  { moduleNumber: "5", title: "Clinical Study Reports", displayOrder: 5 },
] as const;

export type ModuleNumber = "1" | "2" | "3" | "4" | "5";
