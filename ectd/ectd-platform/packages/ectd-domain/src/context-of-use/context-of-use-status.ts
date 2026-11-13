/**
 * Context of Use application-level states — spec §14
 *
 * IMPORTANT: These are application-internal state representations.
 * They must NOT be automatically emitted as XML values.
 * XML representation must be derived from the applicable eCTD specification.
 *
 * Suspension is irreversible under the ICH lifecycle model.
 * Do not add a REACTIVATED status.
 */
export const ContextOfUseStatus = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  OBSOLETE: "OBSOLETE",
} as const;

export type ContextOfUseStatus =
  (typeof ContextOfUseStatus)[keyof typeof ContextOfUseStatus];

/**
 * Determine whether a context of use can be suspended.
 * Only ACTIVE CoUs are eligible.
 */
export function canSuspend(status: ContextOfUseStatus): boolean {
  return status === ContextOfUseStatus.ACTIVE;
}

/**
 * Suspension is irreversible — there is no reactivation path.
 * This function exists explicitly to enforce the invariant.
 */
export function canReactivate(_status: ContextOfUseStatus): false {
  // Spec §15: "Suspension is irreversible under the ICH lifecycle model."
  return false;
}
