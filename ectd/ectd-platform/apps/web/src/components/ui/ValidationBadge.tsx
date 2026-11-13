import { cn } from "@/lib/cn";

const VALIDATION_STYLES: Record<string, string> = {
  NOT_RUN: "bg-gray-100 text-gray-500",
  RUNNING: "bg-blue-100 text-blue-700",
  PASSED: "bg-green-100 text-green-800",
  PASSED_WITH_WARNINGS: "bg-yellow-100 text-yellow-800",
  FAILED: "bg-red-100 text-red-800",
  INCOMPLETE: "bg-orange-100 text-orange-800",
  BLOCKED: "bg-red-200 text-red-900",
};

interface ValidationBadgeProps {
  state: string;
  className?: string;
}

export function ValidationBadge({ state, className }: ValidationBadgeProps) {
  const style = VALIDATION_STYLES[state] ?? "bg-gray-100 text-gray-600";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        style,
        className,
      )}
      aria-label={`Validation state: ${state}`}
    >
      {state.replace(/_/g, " ")}
    </span>
  );
}
