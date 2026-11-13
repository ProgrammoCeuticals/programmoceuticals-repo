/**
 * SenderIdentity — user requirement.
 *
 * Do NOT invent an organizational OID.
 * Sender identity must come from explicit application configuration.
 *
 * The application reports SENDER_IDENTITY_NOT_CONFIGURED and blocks
 * publication when the required sender identity is missing.
 *
 * How to configure:
 *   Set ECTD_SENDER_OID and ECTD_SENDER_NAME in your .env file.
 *   The OID must be your organization's ICH-assigned OID.
 *   Do not use a placeholder or invented OID in production.
 *
 * REGULATORY_GAP: The OID namespace and required sender identification
 * structure must be verified against ICH IG v1.7 and the applicable
 * regional authority registration process.
 */

export interface SenderIdentity {
  /** Your organization's ICH-assigned OID. MUST NOT be invented. */
  oid: string;
  /** Optional extension within the OID namespace */
  oidExtension?: string | undefined;
  /** Human-readable sender name */
  name?: string | undefined;
}

export const SENDER_IDENTITY_NOT_CONFIGURED =
  "SENDER_IDENTITY_NOT_CONFIGURED" as const;

export interface SenderIdentityResult {
  configured: true;
  identity: SenderIdentity;
}
export interface SenderIdentityMissing {
  configured: false;
  reason: typeof SENDER_IDENTITY_NOT_CONFIGURED;
  message: string;
}

export type SenderIdentityResolution =
  | SenderIdentityResult
  | SenderIdentityMissing;

/**
 * Resolve the sender identity from environment configuration.
 * Returns a structured missing-result rather than throwing,
 * so callers can produce a clear error message.
 */
export function resolveSenderIdentity(): SenderIdentityResolution {
  const oid = process.env["ECTD_SENDER_OID"];
  const name = process.env["ECTD_SENDER_NAME"];

  if (!oid || oid.trim() === "" || oid.startsWith("REGULATORY_GAP")) {
    return {
      configured: false,
      reason: SENDER_IDENTITY_NOT_CONFIGURED,
      message:
        "Sender identity (ECTD_SENDER_OID) is not configured. " +
        "Set ECTD_SENDER_OID to your organization's ICH-assigned OID. " +
        "Publication is blocked until sender identity is configured. " +
        "REGULATORY_GAP: OID must be obtained from the applicable authority " +
        "registration process — do not invent an OID.",
    };
  }

  return {
    configured: true,
    identity: {
      oid: oid.trim(),
      name: name?.trim(),
    },
  };
}
