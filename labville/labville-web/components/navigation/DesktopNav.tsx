"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/data/navigation";
import type { NavItem } from "@/types";

interface DesktopNavProps {
  scrolled: boolean;
}

export default function DesktopNav({ scrolled }: DesktopNavProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav
      className="hidden lg:flex items-center gap-1"
      aria-label="Main navigation"
    >
      {navItems.map((item) => (
        <NavItemComponent
          key={item.label}
          item={item}
          isOpen={openDropdown === item.label}
          onOpen={() => setOpenDropdown(item.label)}
          onClose={() => setOpenDropdown(null)}
          scrolled={scrolled}
        />
      ))}
    </nav>
  );
}

function NavItemComponent({
  item,
  isOpen,
  onOpen,
  onClose,
  scrolled,
}: {
  item: NavItem;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  scrolled: boolean;
}) {
  if (item.dropdown) {
    return (
      <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
        <button
          className={cn(
            "flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium",
            "transition-colors duration-200",
            scrolled
              ? "text-text-secondary hover:text-white hover:bg-white/8"
              : "text-white/80 hover:text-white hover:bg-white/10",
          )}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {item.label}
          <ChevronDown
            aria-hidden="true"
            size={14}
            className={cn(
              "transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 pt-2 w-72">
            <div className="bg-bg-elevated border border-white/10 rounded-xl p-2 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
              {item.dropdown.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="flex flex-col px-4 py-3 rounded-lg hover:bg-white/8 transition-colors duration-150 group"
                  onClick={onClose}
                >
                  <span className="text-sm font-medium text-white group-hover:text-accent-cyan transition-colors">
                    {child.label}
                  </span>
                  {child.description && (
                    <span className="text-xs text-text-muted mt-0.5 leading-snug">
                      {child.description}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "px-3.5 py-2 rounded-lg text-sm font-medium",
        "transition-colors duration-200",
        scrolled
          ? "text-text-secondary hover:text-white hover:bg-white/8"
          : "text-white/80 hover:text-white hover:bg-white/10",
      )}
    >
      {item.label}
    </Link>
  );
}
