import { cn } from "@/lib/cn";
import { AlertCircle, InboxIcon } from "lucide-react";
import { Button } from "./Button";

// ── LoadingSkeleton ───────────────────────────────────────────────────────────

interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
}

export function LoadingSkeleton({ rows = 4, className }: LoadingSkeletonProps) {
  return (
    <div
      className={cn("space-y-3", className)}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-10 animate-pulse rounded-md bg-gray-200"
          style={{ width: `${85 + (i % 3) * 5}%` }}
        />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 bg-white py-16 text-center",
        className,
      )}
    >
      <InboxIcon className="h-10 w-10 text-gray-300" aria-hidden="true" />
      <div>
        <p className="font-medium text-gray-700">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      {action && (
        <Button variant="secondary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// ── ErrorState ────────────────────────────────────────────────────────────────

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 py-12 text-center",
        className,
      )}
    >
      <AlertCircle className="h-8 w-8 text-red-400" aria-hidden="true" />
      <div>
        <p className="font-medium text-red-800">{title}</p>
        {message && <p className="mt-1 text-sm text-red-600">{message}</p>}
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
