"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Button from "@/components/ui/Button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { brand } from "@/data/content";

const HeroParticleField = dynamic(
  () => import("@/components/3d/HeroParticleField"),
  { ssr: false },
);

export default function HeroSection() {
  // Split heroHeadline on 'clinical insight' for gradient treatment
  const headline = brand.heroHeadline;
  const gradientWord = "clinical insight.";
  const idx = headline.indexOf(gradientWord);
  const prefix = idx !== -1 ? headline.slice(0, idx) : headline;
  const suffix = idx !== -1 ? "" : "";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-primary">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gradient-radial-blue pointer-events-none" />
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      {/* 3D canvas slot */}
      <div
        id="hero-3d-canvas"
        className="absolute inset-0 pointer-events-none z-0"
      >
        <Suspense fallback={null}>
          <HeroParticleField />
        </Suspense>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <AnimatedSection>
          <span className="text-eyebrow uppercase tracking-[0.12em] text-accent-cyan font-semibold mb-6 block">
            Advanced Diagnostics
          </span>

          <h1 className="text-hero-xl font-bold text-white leading-[1.05] mb-6">
            {prefix}
            {idx !== -1 && (
              <span className="gradient-text">{gradientWord}</span>
            )}
            {suffix}
          </h1>

          <p className="text-body-lg text-text-secondary max-w-2xl mx-auto mb-10">
            {brand.heroSubheadline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button variant="science" size="lg">
                Get Tested Today
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="lg">
                Explore Diagnostics
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
