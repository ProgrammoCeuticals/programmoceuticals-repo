"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/data/navigation";
import Button from "@/components/ui/Button";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden",
          "transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 w-full max-w-sm bg-bg-secondary z-50 lg:hidden",
          "flex flex-col",
          "transition-transform duration-300 ease-out-expo",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-[72px] border-b border-white/8">
          <Link
            href="/"
            onClick={onClose}
            className="text-lg font-semibold text-white tracking-tight"
          >
            Labville
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/8 transition-colors"
            aria-label="Close navigation"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Nav items */}
        <nav
          className="flex-1 overflow-y-auto px-4 py-4"
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => (
            <div key={item.label}>
              {item.dropdown ? (
                <>
                  <button
                    onClick={() =>
                      setExpandedItem(
                        expandedItem === item.label ? null : item.label,
                      )
                    }
                    className="flex items-center justify-between w-full px-3 py-3 rounded-lg text-sm font-medium text-text-secondary hover:text-white hover:bg-white/8 transition-colors"
                    aria-expanded={expandedItem === item.label}
                  >
                    {item.label}
                    <ChevronDown
                      aria-hidden="true"
                      size={16}
                      className={cn(
                        "transition-transform duration-200",
                        expandedItem === item.label && "rotate-180",
                      )}
                    />
                  </button>
                  {expandedItem === item.label && (
                    <div className="pl-4 pb-2 space-y-0.5">
                      {item.dropdown.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-white/8 transition-colors group"
                        >
                          <span className="text-sm font-medium text-white/80 group-hover:text-accent-cyan transition-colors">
                            {child.label}
                          </span>
                          {child.description && (
                            <span className="text-xs text-text-muted mt-0.5">
                              {child.description}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center px-3 py-3 rounded-lg text-sm font-medium text-text-secondary hover:text-white hover:bg-white/8 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom CTA */}
        <div className="px-4 pb-6 pt-4 border-t border-white/8 space-y-3">
          <Link href="/contact" onClick={onClose} className="block">
            <Button variant="science" fullWidth size="lg">
              Get Tested Today
            </Button>
          </Link>
          <a
            href="tel:07034888629"
            className="flex items-center justify-center gap-2 py-3 text-sm text-text-secondary hover:text-white transition-colors"
            onClick={onClose}
          >
            <span>Call us:</span>
            <span className="font-medium text-white">07034888629</span>
          </a>
        </div>
      </div>
    </>
  );
}
