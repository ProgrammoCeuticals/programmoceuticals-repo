/**
 * InteractionId resolution — user requirement.
 *
 * Do NOT hard-code an arbitrary interactionId.
 * Resolve the correct value from the authoritative eCTD v4.0 IG
 * configuration once the schema package is installed.
 *
 * Until the package is installed, treat as REGULATORY_GAP and block
 * production XML generation.
 *
 * REGULATORY_GAP: The exact interactionId OID and fixed extension value
 * for ICH eCTD v4.0 messages must come from the official ICH IG v1.7.
 * The value 'PORX_IN000001UV01' seen in secondary sources must be
 * confirmed against the official schema package before use.
 */

export const INTERACTION_ID_NOT_CONFIGURED =
  "INTERACTION_ID_NOT_CONFIGURED" as const;

export interface InteractionIdConfig {
  /** OID for the interaction identifier root */
  root: string;
  /** Fixed extension value from the IG */
  extension: string;
}

export interface InteractionIdResult {
  available: true;
  config: InteractionIdConfig;
}
export interface InteractionIdMissing {
  available: false;
  reason: typeof INTERACTION_ID_NOT_CONFIGURED;
  message: string;
}

export type InteractionIdResolution =
  | InteractionIdResult
  | InteractionIdMissing;

/**
 * Resolve the interactionId from the installed IG package configuration.
 *
 * The values must be loaded from the ImplementationGuide record in the
 * database after the official ICH IG v1.7 package is imported.
 *
 * This function accepts the resolved values (loaded by the caller from
 * the regulatory package registry) rather than reading env vars,
 * because the authoritative source is the installed package, not config.
 */
export function resolveInteractionId(
  installedIgConfig: Record<string, unknown> | null | undefined,
): InteractionIdResolution {
  const root = installedIgConfig?.["interactionIdRoot"] as string | undefined;
  const extension = installedIgConfig?.["interactionIdExtension"] as
    | string
    | undefined;

  if (!root || !extension) {
    return {
      available: false,
      reason: INTERACTION_ID_NOT_CONFIGURED,
      message:
        "InteractionId is not available — the official ICH eCTD v4.0 " +
        "Implementation Guide package (IG v1.7) has not been imported, " +
        "or its interactionId configuration has not been extracted. " +
        "Production XML generation is blocked until the IG package is installed. " +
        "REGULATORY_GAP: The correct interactionId must come from the " +
        "authoritative ICH IG v1.7 — do not use a hard-coded or guessed value.",
    };
  }

  return {
    available: true,
    config: { root, extension },
  };
}
