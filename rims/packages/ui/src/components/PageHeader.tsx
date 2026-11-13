import React from "react";
import { cn } from "../lib/utils";

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    // GLSI .section-title style: ruled 2px bottom border, tight spacing
    <div className={cn("mb-6", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          className="flex mb-2 text-[11px] text-[#718096] uppercase tracking-[0.04em]"
          aria-label="Breadcrumb"
        >
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center">
              {idx > 0 && <span className="mx-1.5 text-[#c5d8e3]">/</span>}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="hover:text-[#193441] hover:underline"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-[#193441] font-semibold">
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex items-center justify-between gap-4 pb-3 border-b-2 border-[#193441]">
        <div>
          {/* Title — GLSI section heading weight and size */}
          <h1 className="text-[18px] font-bold text-[#193441] tracking-tight leading-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-[11px] text-[#718096] uppercase tracking-[0.04em]">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
        )}
      </div>
    </div>
  );
}
