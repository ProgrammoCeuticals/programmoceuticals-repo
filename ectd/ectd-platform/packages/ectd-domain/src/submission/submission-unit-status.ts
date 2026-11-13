/**
 * Submission Unit application-level statuses — spec §7.9
 *
 * Published Submission Units cannot be mutated.
 * Publication operates from a frozen snapshot.
 */
export const SubmissionUnitStatus = {
  DRAFT: "DRAFT",
  FROZEN: "FROZEN",
  VALIDATING: "VALIDATING",
  VALIDATED: "VALIDATED",
  PUBLISHING: "PUBLISHING",
  PUBLISHED: "PUBLISHED",
  FAILED: "FAILED",
} as const;

export type SubmissionUnitStatus =
  (typeof SubmissionUnitStatus)[keyof typeof SubmissionUnitStatus];

export function isImmutable(status: SubmissionUnitStatus): boolean {
  return status === SubmissionUnitStatus.PUBLISHED;
}

export function canFreeze(status: SubmissionUnitStatus): boolean {
  return status === SubmissionUnitStatus.DRAFT;
}

export function canValidate(status: SubmissionUnitStatus): boolean {
  return (
    status === SubmissionUnitStatus.FROZEN ||
    status === SubmissionUnitStatus.VALIDATED
  );
}

export function canPublish(status: SubmissionUnitStatus): boolean {
  return status === SubmissionUnitStatus.VALIDATED;
}
