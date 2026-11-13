import { cn } from "@/lib/cn";

export type CtdIndicator = "complete" | "empty" | "warning" | "error" | "gap";

const INDICATOR_CONFIG: Record<
  CtdIndicator,
  { symbol: string; label: string; className: string }
> = {
  complete: { symbol: "✓", label: "Complete",        className: "text-green-600" },
  empty:    { symbol: "○", label: "Not populated",   className: "text-gray-400" },
  warning:  { symbol: "⚠", label: "Warning",         className: "text-amber-500" },
  error:    { symbol: "✕", label: "Error",            className: "text-red-600" },
  gap:      { symbol: "ⓘ", label: "Regulatory gap",  className: "text-blue-500" },
};

interface CtdIndicatorBadgeProps {
  indicator: CtdIndicator;
  className?: string | undefined;
}

export function CtdIndicatorBadge({ indicator, className }: CtdIndicatorBadgeProps) {
  const cfg = INDICATOR_CONFIG[indicator];
  return (
    <span
      className={cn("shrink-0 text-xs font-medium", cfg.className, className)}
      aria-label={cfg.label}
      title={cfg.label}
    >
      {cfg.symbol}
    </span>
  );
}
