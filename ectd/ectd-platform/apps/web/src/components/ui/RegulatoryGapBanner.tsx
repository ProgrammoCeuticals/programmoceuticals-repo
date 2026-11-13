import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";

interface RegulatoryGapBannerProps {
  title: string;
  reason: string;
  impact?: string;
  className?: string;
}

/**
 * Displayed whenever a required regulatory package or configuration is
 * unavailable. Must never be hidden or treated as a passing state.
 */
export function RegulatoryGapBanner({
  title,
  reason,
  impact,
  className,
}: RegulatoryGapBannerProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex gap-3 rounded-md border border-amber-300 bg-amber-50 p-4",
        className,
      )}
    >
      <AlertTriangle
        className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
        aria-hidden="true"
      />
      <div className="space-y-1">
        <p className="font-semibold text-amber-900">
          REGULATORY GAP — {title}
        </p>
        <p className="text-sm text-amber-800">{reason}</p>
        {impact && (
          <p className="text-sm text-amber-700">
            <span className="font-medium">Impact:</span> {impact}
          </p>
        )}
      </div>
    </div>
  );
}
