"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import DesktopNav from "@/components/navigation/DesktopNav";
import MobileNav from "@/components/navigation/MobileNav";
import Button from "@/components/ui/Button";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-30",
          "h-[72px] flex items-center",
          "transition-all duration-300 ease-in-out",
          scrolled
            ? "bg-bg-primary/95 backdrop-blur-xl border-b border-white/8 shadow-[0_1px_20px_rgba(0,0,0,0.4)]"
            : "bg-transparent",
        )}
      >
        <div className="w-full max-w-[1400px] mx-auto px-[clamp(20px,5vw,80px)] flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="Labville Diagnostic Centre — Home"
          >
            {/* Logo mark */}
            <div className="w-8 h-8 rounded-lg bg-gradient-science flex items-center justify-center shadow-[0_0_16px_rgba(30,111,217,0.4)]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                {/* Simple molecular/cross mark */}
                <circle cx="8" cy="8" r="2.5" fill="white" />
                <circle cx="8" cy="2.5" r="1.5" fill="white" opacity="0.7" />
                <circle cx="8" cy="13.5" r="1.5" fill="white" opacity="0.7" />
                <circle cx="2.5" cy="8" r="1.5" fill="white" opacity="0.7" />
                <circle cx="13.5" cy="8" r="1.5" fill="white" opacity="0.7" />
                <line
                  x1="8"
                  y1="4"
                  x2="8"
                  y2="5.5"
                  stroke="white"
                  strokeWidth="1"
                  opacity="0.5"
                />
                <line
                  x1="8"
                  y1="10.5"
                  x2="8"
                  y2="12"
                  stroke="white"
                  strokeWidth="1"
                  opacity="0.5"
                />
                <line
                  x1="4"
                  y1="8"
                  x2="5.5"
                  y2="8"
                  stroke="white"
                  strokeWidth="1"
                  opacity="0.5"
                />
                <line
                  x1="10.5"
                  y1="8"
                  x2="12"
                  y2="8"
                  stroke="white"
                  strokeWidth="1"
                  opacity="0.5"
                />
              </svg>
            </div>

            {/* Wordmark */}
            <div className="flex flex-col leading-none">
              <span className="text-base font-semibold text-white tracking-[-0.01em] group-hover:text-white transition-colors">
                Labville
              </span>
              <span className="text-[10px] text-text-muted font-medium tracking-[0.06em] uppercase">
                Diagnostic Centre
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <DesktopNav scrolled={scrolled} />

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:07034888629"
              className="text-sm text-text-secondary hover:text-white transition-colors"
            >
              07034888629
            </a>
            <Link href="/contact">
              <Button variant="science" size="sm">
                Get Tested Today
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/8 transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
          >
            <Menu size={22} aria-hidden="true" />
          </button>
        </div>
      </header>

      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
