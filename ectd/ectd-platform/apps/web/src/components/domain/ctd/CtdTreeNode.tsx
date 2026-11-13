"use client";

import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { CtdIndicatorBadge, type CtdIndicator } from "./CtdIndicator";
import type { CtdSection } from "@/lib/api/client";

interface CtdTreeNodeProps {
  section: CtdSection;
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
  indicator: CtdIndicator;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  children?: React.ReactNode;
}

export function CtdTreeNode({
  section,
  depth,
  isExpanded,
  isSelected,
  indicator,
  onSelect,
  onToggle,
  children,
}: CtdTreeNodeProps) {
  const hasChildren = !!section.children?.length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        onSelect(section.id);
        break;
      case "ArrowRight":
        e.preventDefault();
        if (hasChildren && !isExpanded) onToggle(section.id);
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (isExpanded) onToggle(section.id);
        break;
    }
  };

  return (
    <li role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(section.id)}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex w-full cursor-pointer items-center gap-1.5 rounded px-2 py-1.5 text-left text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
          isSelected
            ? "bg-brand-50 font-medium text-brand-800"
            : "text-gray-700 hover:bg-gray-100",
        )}
        style={{ paddingLeft: `${0.5 + depth * 1}rem` }}
        aria-selected={isSelected}
      >
        {/* Expand/collapse toggle */}
        <span
          className="flex h-4 w-4 shrink-0 items-center justify-center"
          onClick={(e) => {
            if (hasChildren) {
              e.stopPropagation();
              onToggle(section.id);
            }
          }}
          aria-hidden="true"
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            )
          ) : null}
        </span>

        <CtdIndicatorBadge indicator={indicator} />

        <span className="flex-1 truncate">
          <span className="font-mono text-xs text-gray-400 mr-1.5">
            {section.sectionCode}
          </span>
          {section.title}
        </span>
      </div>

      {hasChildren && isExpanded && (
        <ul role="group" className="ml-0">
          {children}
        </ul>
      )}
    </li>
  );
}
