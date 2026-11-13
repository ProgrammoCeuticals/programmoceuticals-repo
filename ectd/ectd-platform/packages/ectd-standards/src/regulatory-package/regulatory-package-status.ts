/**
 * Regulatory package statuses — spec §3
 *
 * These are application-controlled statuses, not regulatory XML status codes.
 *
 * Once a regulatory package is imported, do not modify its source files.
 * A new regulatory revision creates a new package record.
 * Old packages remain available for historical validation/reproducibility.
 *
 * A failed import must NEVER partially activate.
 */
export const RegulatoryPackageStatus = {
  IMPORTING: "IMPORTING",
  ACTIVE: "ACTIVE",
  SUPERSEDED: "SUPERSEDED",
  RETIRED: "RETIRED",
  FAILED: "FAILED",
} as const;

export type RegulatoryPackageStatus =
  (typeof RegulatoryPackageStatus)[keyof typeof RegulatoryPackageStatus];

export const RegulatoryPackageType = {
  IMPLEMENTATION_GUIDE: "IMPLEMENTATION_GUIDE",
  SCHEMA: "SCHEMA",
  CONTROLLED_VOCABULARY: "CONTROLLED_VOCABULARY",
  GENERICODE: "GENERICODE",
  CTD_STRUCTURE: "CTD_STRUCTURE",
  VALIDATION_CRITERIA: "VALIDATION_CRITERIA",
  REGIONAL_MODULE_1: "REGIONAL_MODULE_1",
  REGIONAL_CONTROLLED_VOCABULARY: "REGIONAL_CONTROLLED_VOCABULARY",
  REGIONAL_VALIDATION_CRITERIA: "REGIONAL_VALIDATION_CRITERIA",
  REGIONAL_TECHNICAL_CONFORMANCE: "REGIONAL_TECHNICAL_CONFORMANCE",
  TRANSMISSION_SPECIFICATION: "TRANSMISSION_SPECIFICATION",
} as const;

export type RegulatoryPackageType =
  (typeof RegulatoryPackageType)[keyof typeof RegulatoryPackageType];
