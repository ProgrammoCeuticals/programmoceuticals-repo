import { cn } from "../lib/utils";

// ── Variant definitions ────────────────────────────────────────────────────
// Each variant is a distinct colour pair (bg + text + border) so statuses
// are visually distinguishable at a glance — not just two or three colours
// shared across many different meanings.

type BadgeVariant =
  | "active" // green    — ACTIVE, APPROVED, ACCEPTED
  | "success" // green    — COMPLETED, PUBLISHED
  | "pending" // blue     — PENDING_APPROVAL, PENDING_VERIFICATION, SUBMITTED
  | "in-progress" // teal     — IN_PROGRESS, UNDER_REVIEW
  | "draft" // cool slate — DRAFT, TODO
  | "suspended" // amber    — ON_HOLD, SUSPENDED, REVISION_REQUIRED
  | "warning" // amber    — alias
  | "info" // sky      — INTERNAL_REVIEW, SCHEDULED, READY_FOR_SUBMISSION
  | "locked" // indigo   — LOCKED, CLOSED
  | "inactive" // grey     — INACTIVE
  | "archived" // grey     — ARCHIVED
  | "rejected" // red      — REJECTED, CANCELLED, WITHDRAWN
  | "danger" // red      — alias
  | "critical" // dark red filled — CRITICAL priority
  | "high" // orange-red — HIGH priority
  | "medium" // blue     — MEDIUM priority
  | "low" // grey     — LOW priority
  | "default"; // grey     — fallback

// bg / text / border
const variantClasses: Record<BadgeVariant, string> = {
  active: "bg-[#c3dafe] text-[#1e3a5f] border border-[#a3bffa]",
  success: "bg-[#c6f6d5] text-[#1c4532] border border-[#9ae6b4]",
  pending: "bg-[#bee3f8] text-[#1a365d] border border-[#90cdf4]",
  "in-progress": "bg-[#b2f5ea] text-[#1d4044] border border-[#81e6d9]",
  draft: "bg-[#edf2f7] text-[#2d3748] border border-[#cbd5e0]",
  suspended: "bg-[#fefcbf] text-[#744210] border border-[#f6e05e]",
  warning: "bg-[#fefcbf] text-[#744210] border border-[#f6e05e]",
  info: "bg-[#ebf8ff] text-[#1a365d] border border-[#bee3f8]",
  locked: "bg-[#e9d8fd] text-[#44337a] border border-[#d6bcfa]",
  inactive: "bg-[#e2e8f0] text-[#4a5568] border border-[#cbd5e0]",
  archived: "bg-[#e2e8f0] text-[#4a5568] border border-[#cbd5e0]",
  rejected: "bg-[#fed7d7] text-[#9b1c1c] border border-[#fc8181]",
  danger: "bg-[#fed7d7] text-[#9b1c1c] border border-[#fc8181]",
  critical: "bg-[#9b1c1c] text-white border border-[#c53030]",
  high: "bg-[#fed7d7] text-[#9b1c1c] border border-[#fc8181]",
  medium: "bg-[#bee3f8] text-[#1a365d] border border-[#90cdf4]",
  low: "bg-[#e2e8f0] text-[#4a5568] border border-[#cbd5e0]",
  default: "bg-[#e2e8f0] text-[#4a5568] border border-[#cbd5e0]",
};

// Human-readable labels for raw API status strings
const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  PENDING_APPROVAL: "Pending Approval",
  APPROVED: "Approved",
  ACTIVE: "Active",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  INTERNAL_REVIEW: "Internal Review",
  READY_FOR_SUBMISSION: "Ready to Submit",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  REVISION_REQUIRED: "Revision Required",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  PUBLISHED: "Published",
  WITHDRAWN: "Withdrawn",
  PENDING_VERIFICATION: "Pending",
  SUSPENDED: "Suspended",
  ON_LEAVE: "On Leave",
  TERMINATED: "Terminated",
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In Progress",
  LOCKED: "Locked",
  CLOSED: "Closed",
  PENDING: "Pending",
  ARCHIVED: "Archived",
  INACTIVE: "Inactive",
  TODO: "To Do",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
  // Quality finding / corrective action statuses
  OPEN: "Open",
  VERIFIED: "Verified",
};

// Map from raw API string → variant
const STATUS_VARIANTS: Record<string, BadgeVariant> = {
  ACTIVE: "active",
  APPROVED: "active",
  ACCEPTED: "active",
  COMPLETED: "success",
  PUBLISHED: "success",
  PENDING: "pending",
  PENDING_APPROVAL: "pending",
  PENDING_VERIFICATION: "pending",
  SUBMITTED: "pending",
  IN_PROGRESS: "in-progress",
  UNDER_REVIEW: "in-progress",
  INTERNAL_REVIEW: "info",
  READY_FOR_SUBMISSION: "info",
  SCHEDULED: "info",
  DRAFT: "draft",
  TODO: "draft",
  ON_HOLD: "suspended",
  SUSPENDED: "suspended",
  REVISION_REQUIRED: "suspended",
  ON_LEAVE: "suspended",
  LOCKED: "locked",
  CLOSED: "locked",
  INACTIVE: "inactive",
  ARCHIVED: "archived",
  REJECTED: "rejected",
  CANCELLED: "rejected",
  WITHDRAWN: "rejected",
  TERMINATED: "danger",
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
  // Quality finding / corrective action statuses
  OPEN: "active", // open = needs attention → teal active
  VERIFIED: "info", // verified but not closed → sky
};

export interface BadgeProps {
  variant?: BadgeVariant | string;
  label: string;
  dot?: boolean;
  className?: string;
}

export function Badge({
  variant = "default",
  label,
  dot = false,
  className,
}: BadgeProps) {
  // Explicit non-default variant wins; otherwise auto-resolve from label string
  const resolvedVariant: BadgeVariant =
    variant !== "default" && variantClasses[variant as BadgeVariant]
      ? (variant as BadgeVariant)
      : (STATUS_VARIANTS[label] ?? "default");

  // Replace raw ALL_CAPS API strings with readable labels
  const displayLabel = STATUS_LABELS[label] ?? label;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-[7px] py-[2px] text-[10px] font-bold tracking-[0.04em] leading-[1.4] whitespace-nowrap",
        "rounded-lg", // = 2px in our Tailwind config — the GLSI micro-exception
        variantClasses[resolvedVariant],
        className,
      )}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 flex-shrink-0" />
      )}
      {displayLabel}
    </span>
  );
}

// ── Convenience exports ────────────────────────────────────────────────────
export function statusVariant(status: string): BadgeVariant {
  return STATUS_VARIANTS[status] ?? "default";
}

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}
