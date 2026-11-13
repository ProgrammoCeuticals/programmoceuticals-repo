import { cn } from "@/lib/cn";

const LIFECYCLE_STYLES: Record<string, string> = {
  NEW: "bg-green-100 text-green-800",
  REPLACE: "bg-blue-100 text-blue-800",
  REUSE: "bg-cyan-100 text-cyan-800",
  SUSPEND: "bg-amber-100 text-amber-800",
};

interface LifecycleBadgeProps {
  operation: string;
  className?: string;
}

export function LifecycleBadge({ operation, className }: LifecycleBadgeProps) {
  const style = LIFECYCLE_STYLES[operation] ?? "bg-gray-100 text-gray-600";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        style,
        className,
      )}
      aria-label={`Lifecycle operation: ${operation}`}
    >
      {operation}
    </span>
  );
}
