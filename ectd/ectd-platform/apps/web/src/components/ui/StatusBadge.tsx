import { cn } from "@/lib/cn";

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  ACTIVE: "bg-green-100 text-green-800",
  FROZEN: "bg-blue-100 text-blue-800",
  PUBLISHED: "bg-indigo-100 text-indigo-800",
  FINALIZED: "bg-purple-100 text-purple-800",
  SUSPENDED: "bg-amber-100 text-amber-800",
  OBSOLETE: "bg-gray-200 text-gray-500",
  FAILED: "bg-red-100 text-red-800",
  REJECTED: "bg-red-100 text-red-800",
  SUPERSEDED: "bg-gray-200 text-gray-500",
  RETIRED: "bg-gray-200 text-gray-500",
  IMPORTING: "bg-yellow-100 text-yellow-800",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        style,
        className,
      )}
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  );
}
