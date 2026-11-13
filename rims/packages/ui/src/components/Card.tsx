import React from "react";
import { cn } from "../lib/utils";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
  /** When true, renders a dark brand header strip like GLSI's detail panel header */
  darkHeader?: boolean;
}

export function Card({
  children,
  className,
  header,
  footer,
  noPadding,
  darkHeader,
}: CardProps) {
  return (
    // GLSI .card: white bg, 1px border, no border-radius, minimal shadow
    <div className={cn("bg-white border border-[#e2e8f0]", className)}>
      {header &&
        (darkHeader ? (
          // Dark brand header — GLSI detail panel / table header style
          <div className="bg-[#193441] px-5 py-2.5">
            {typeof header === "string" ? (
              <p className="text-[9px] font-bold text-white uppercase tracking-[0.2em]">
                {header}
              </p>
            ) : (
              header
            )}
          </div>
        ) : (
          // Light header with ruled bottom border
          <div className="px-5 py-3.5 border-b border-[#e2e8f0] bg-[#f7f8fa]">
            {header}
          </div>
        ))}
      <div className={cn(!noPadding && "p-5")}>{children}</div>
      {footer && (
        // Footer strip — GLSI-style: light bg, ruled top border
        <div className="px-5 py-3 border-t border-[#e2e8f0] bg-[#f7f8fa]">
          {footer}
        </div>
      )}
    </div>
  );
}
