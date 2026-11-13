/**
 * RegionalReadiness — user requirement.
 *
 * A region is only considered production-ready for eCTD v4.0 when its
 * authoritative regional package and validation criteria have been
 * installed and validated.
 *
 * Until then, return explicit REGULATORY_GAP / NOT_CONFIGURED findings.
 *
 * NAFDAC / Nigeria:
 *   Do not invent a NAFDAC eCTD v4.0 regional specification.
 *   Keep Nigeria as an available region/authority in the database,
 *   but mark its eCTD regional capability as NOT_CONFIGURED until
 *   an authoritative specification is provided.
 */

export type RegionalReadinessStatus =
  | "PRODUCTION_READY" // Authoritative package imported, validated
  | "CONFIGURED_NOT_VALIDATED" // Package imported, not yet validated
  | "NOT_CONFIGURED" // Region exists but no regional package installed
  | "REGULATORY_GAP"; // Package explicitly required but source not yet published

export interface RegionalReadinessAssessment {
  regionCode: string;
  authorityCode: string;
  ectdVersion: string;
  status: RegionalReadinessStatus;
  message: string;
  /** True if the region can be used in production submissions */
  productionReady: boolean;
}

/**
 * Known regional eCTD v4.0 readiness statuses as of September 2026.
 *
 * REGULATORY_GAP: These assessments must be updated whenever an
 * authoritative regional package is published and imported.
 * Do not change a region's status without installing the authoritative package.
 */
export const REGIONAL_READINESS_REGISTRY: Record<
  string,
  Omit<RegionalReadinessAssessment, "regionCode" | "authorityCode">
> = {
  /**
   * FDA / US — eCTD v4.0 regional package exists and is published.
   * Status transitions to PRODUCTION_READY after the regional package
   * (IG, CV, validation criteria v1.6) is imported and activated.
   */
  "US:FDA": {
    ectdVersion: "4.0",
    status: "NOT_CONFIGURED",
    productionReady: false,
    message:
      "FDA eCTD v4.0 regional package exists (updated Aug 28, 2026). " +
      "Import the FDA Regional Module 1 IG, Regional CV, and Validation " +
      "Criteria v1.6 from fda.gov to activate this region. " +
      "Status will become PRODUCTION_READY after successful import and validation.",
  },

  /**
   * EMA / EU — status depends on imported regional package.
   */
  "EU:EMA": {
    ectdVersion: "4.0",
    status: "NOT_CONFIGURED",
    productionReady: false,
    message:
      "EMA eCTD v4.0 regional package must be imported from the authoritative " +
      "EMA source before EU submissions can be prepared. " +
      "Do not fabricate EMA-specific requirements.",
  },

  /**
   * NAFDAC / Nigeria — NOT_CONFIGURED.
   * Do NOT invent a NAFDAC eCTD v4.0 regional specification.
   * The ICH v4.0 regional implementation page (Sep 2026) does not
   * establish a Nigeria/NAFDAC eCTD v4.0 regional package.
   */
  "NG:NAFDAC": {
    ectdVersion: "4.0",
    status: "NOT_CONFIGURED",
    productionReady: false,
    message:
      "NAFDAC does not have a published eCTD v4.0 regional specification " +
      "as of September 2026. Nigeria is available as a region and NAFDAC " +
      "as an authority, but eCTD v4.0 regional capability is NOT_CONFIGURED. " +
      "Do not fabricate NAFDAC eCTD v4.0 requirements. " +
      "This region will only be activated when an authoritative NAFDAC " +
      "eCTD v4.0 specification is published and imported.",
  },
};

/**
 * Get the readiness assessment for a region/authority pair.
 * Returns NOT_CONFIGURED if no assessment is registered.
 */
export function getRegionalReadiness(
  regionCode: string,
  authorityCode: string,
): RegionalReadinessAssessment {
  const key = `${regionCode}:${authorityCode}`;
  const entry = REGIONAL_READINESS_REGISTRY[key];

  if (!entry) {
    return {
      regionCode,
      authorityCode,
      ectdVersion: "4.0",
      status: "NOT_CONFIGURED",
      productionReady: false,
      message:
        `No eCTD v4.0 regional readiness assessment registered for ` +
        `region "${regionCode}" / authority "${authorityCode}". ` +
        `Import the authoritative regional package to configure this region.`,
    };
  }

  return { regionCode, authorityCode, ...entry };
}

/**
 * Assert that a region is production-ready before allowing a submission.
 * Throws a structured error if not ready.
 */
export function assertRegionalReadiness(
  regionCode: string,
  authorityCode: string,
): void {
  const assessment = getRegionalReadiness(regionCode, authorityCode);

  if (!assessment.productionReady) {
    throw new Error(
      `REGULATORY_GAP: Region "${regionCode}" / Authority "${authorityCode}" ` +
        `is not production-ready for eCTD v4.0 submissions. ` +
        `Status: ${assessment.status}. ` +
        assessment.message,
    );
  }
}
