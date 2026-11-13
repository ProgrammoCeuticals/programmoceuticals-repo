/**
 * PackageConsistencyChecker — spec §3.
 *
 * Runs consistency checks after a package has been registered but before
 * it is activated. Ensures the package is internally coherent and does
 * not conflict with existing active packages.
 *
 * Checks:
 *   1. Version uniqueness — no other ACTIVE package with same name+version.
 *   2. Effective date validity — effectiveDate must be set for standards packages.
 *   3. Supersession check — when activating a new version, older versions
 *      must be marked SUPERSEDED, not ACTIVE.
 *
 * Spec §8 — Database invariants:
 *   - The selected Submission Unit profile must never be silently replaced
 *     by a newer package. Old packages remain available.
 */

export interface ConsistencyCheckInput {
  artifactId: string;
  name: string;
  version: string;
  packageType: string;
  effectiveDate?: Date | undefined;
}

export interface ExistingPackageSummary {
  id: string;
  name: string;
  version: string;
  status: string;
}

export interface IPackageConsistencyRepository {
  findActiveByName(name: string): Promise<ExistingPackageSummary[]>;
}

export type CheckSeverity = "ERROR" | "WARNING" | "INFO";

export interface ConsistencyFinding {
  code: string;
  severity: CheckSeverity;
  message: string;
  artifactId?: string | undefined;
}

export interface ConsistencyCheckResult {
  canActivate: boolean;
  findings: ConsistencyFinding[];
}

export class PackageConsistencyChecker {
  constructor(private readonly repo: IPackageConsistencyRepository) {}

  async check(input: ConsistencyCheckInput): Promise<ConsistencyCheckResult> {
    const findings: ConsistencyFinding[] = [];

    // ── Check 1: Exact version duplicate ──────────────────────────────────
    const existing = await this.repo.findActiveByName(input.name);
    const exactDuplicate = existing.find(
      (p) => p.version === input.version && p.id !== input.artifactId,
    );

    if (exactDuplicate) {
      findings.push({
        code: "DUPLICATE_VERSION",
        severity: "ERROR",
        message:
          `An ACTIVE package with name "${input.name}" version "${input.version}" ` +
          `already exists (id: ${exactDuplicate.id}). ` +
          "Packages are immutable — use the existing record or supersede it explicitly.",
        artifactId: exactDuplicate.id,
      });
    }

    // ── Check 2: Effective date for standards packages ─────────────────────
    const standardsTypes = [
      "IMPLEMENTATION_GUIDE",
      "CONTROLLED_VOCABULARY",
      "REGIONAL_MODULE_1",
      "REGIONAL_CONTROLLED_VOCABULARY",
      "VALIDATION_CRITERIA",
      "REGIONAL_VALIDATION_CRITERIA",
    ];

    if (standardsTypes.includes(input.packageType) && !input.effectiveDate) {
      findings.push({
        code: "MISSING_EFFECTIVE_DATE",
        severity: "WARNING",
        message:
          `Package type "${input.packageType}" should have an effective date set. ` +
          "Without an effective date, historical Submission Unit profile resolution may be ambiguous.",
      });
    }

    // ── Check 3: Supersession warning ─────────────────────────────────────
    const olderVersions = existing.filter((p) => p.id !== input.artifactId);
    if (olderVersions.length > 0) {
      findings.push({
        code: "EXISTING_ACTIVE_VERSION",
        severity: "WARNING",
        message:
          `Activating "${input.name}" v${input.version} while ` +
          `${olderVersions.length} other active version(s) exist: ` +
          olderVersions.map((p) => `v${p.version} (${p.id})`).join(", ") +
          ". Previous versions will NOT be automatically superseded. " +
          "Use the supersede endpoint to mark old versions explicitly.",
      });
    }

    const hasErrors = findings.some((f) => f.severity === "ERROR");
    return { canActivate: !hasErrors, findings };
  }
}
