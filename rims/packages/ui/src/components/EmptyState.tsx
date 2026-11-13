import React from "react";
import { Inbox } from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      {/* Square icon container — no border-radius, GLSI sharp style */}
      <div className="w-11 h-11 bg-[#f7f8fa] border border-[#e2e8f0] flex items-center justify-center mb-4 text-[#718096]">
        {icon ?? <Inbox className="h-5 w-5" />}
      </div>
      <h3 className="text-[13px] font-bold text-[#193441] mb-1 uppercase tracking-[0.04em]">
        {title}
      </h3>
      <p className="text-[12px] text-[#718096] max-w-xs">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
