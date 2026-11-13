import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  segments: BreadcrumbSegment[];
  className?: string;
}

export function Breadcrumbs({ segments, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-sm", className)}>
      <ol className="flex items-center gap-1">
        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
              )}
              {seg.href && !isLast ? (
                <Link
                  href={seg.href}
                  className="text-gray-500 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  {seg.label}
                </Link>
              ) : (
                <span
                  className={isLast ? "font-medium text-gray-900" : "text-gray-500"}
                  aria-current={isLast ? "page" : undefined}
                >
                  {seg.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
