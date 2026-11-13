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
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-30 h-[70px] flex items-center",
          "transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-header border-b border-border-light"
            : "bg-bg-dark",
        )}
      >
        <div className="w-full max-w-[1380px] mx-auto px-[clamp(20px,5vw,80px)] flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="Operation Smile Foundation — Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-green flex items-center justify-center shadow-green-glow">
              <span className="text-white font-black text-sm tracking-tight">
                OS
              </span>
            </div>
            <div className="flex flex-col leading-none">
              {/* Full name on md+, abbreviated on small screens */}
              <span
                className={cn(
                  "text-sm font-bold tracking-tight",
                  scrolled ? "text-text-primary" : "text-white",
                )}
              >
                <span className="hidden sm:inline">
                  Operation Smile Foundation
                </span>
                <span className="inline sm:hidden">Op. Smile Foundation</span>
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium tracking-[0.06em] uppercase",
                  scrolled ? "text-text-muted" : "text-text-light-muted",
                )}
              >
                Nigeria
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <DesktopNav scrolled={scrolled} />

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/become-a-member">
              <Button variant={scrolled ? "outline" : "light"} size="sm">
                Become a Member
              </Button>
            </Link>
            <Link href="/apply-for-a-loan">
              <Button variant="gold" size="sm">
                Apply for a Loan
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors",
              scrolled
                ? "text-text-muted hover:text-text-primary hover:bg-bg-alt"
                : "text-text-light-muted hover:text-white hover:bg-white/10",
            )}
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
