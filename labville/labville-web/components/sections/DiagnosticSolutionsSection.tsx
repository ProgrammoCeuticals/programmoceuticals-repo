"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";
import { services } from "@/data/services";

const LazyMolecularScene = dynamic(
  () => import("@/components/3d/MolecularScene"),
  { ssr: false },
);
const LazyImagingScene = dynamic(() => import("@/components/3d/ImagingScene"), {
  ssr: false,
});
const LazyHealthProfileScene = dynamic(
  () => import("@/components/3d/HealthProfileScene"),
  { ssr: false },
);

const cardSceneMap: Record<string, React.ComponentType> = {
  laboratory: LazyMolecularScene,
  imaging: LazyImagingScene,
  screening: LazyHealthProfileScene,
};

// Only the first 3 services: laboratory, imaging, screening
const displayServices = services.slice(0, 3);

export default function DiagnosticSolutionsSection() {
  return (
    <SectionContainer bg="bg-bg-primary">
      <SectionHeading
        align="center"
        eyebrow="Our Diagnostic Solutions"
        headline="Comprehensive diagnostics for every health need"
        gradientWord="diagnostics"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        {displayServices.map((service, i) => (
          <AnimatedSection key={service.id} delay={i * 0.1}>
            <div className="bg-bg-elevated border border-white/8 rounded-xl overflow-hidden hover:border-accent-blue/30 transition-all duration-300 group flex flex-col h-full">
              {/* 3D scene slot */}
              <div className="h-48 bg-gradient-to-br from-accent-blue/10 to-accent-cyan/10 relative overflow-hidden">
                {(() => {
                  const CardScene = cardSceneMap[service.id];
                  if (!CardScene)
                    return (
                      <span className="absolute inset-0 flex items-center justify-center text-eyebrow uppercase tracking-[0.12em] text-accent-cyan/40 font-semibold">
                        3D Scene — {service.visual3DScene}
                      </span>
                    );
                  return (
                    <Suspense fallback={null}>
                      <CardScene />
                    </Suspense>
                  );
                })()}
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-1">
                <Badge variant="science" className="mb-4 self-start">
                  {service.shortName}
                </Badge>

                <h3 className="text-heading-md font-semibold text-white mb-2">
                  {service.name}
                </h3>

                <p className="text-body-sm text-accent-cyan mb-4">
                  {service.tagline}
                </p>

                <p className="text-body-md text-text-secondary mb-6">
                  {service.shortDescription}
                </p>

                {/* Sub-services */}
                {service.subServices && (
                  <ul className="space-y-1 mb-6">
                    {service.subServices.map((sub) => (
                      <li
                        key={sub.name}
                        className="flex items-center gap-2 text-body-sm text-text-secondary"
                      >
                        <span className="w-1 h-1 rounded-full bg-accent-cyan/60 flex-shrink-0" />
                        {sub.name}
                      </li>
                    ))}
                  </ul>
                )}

                <Link
                  href={service.cta.href}
                  className="inline-flex items-center gap-2 text-sm text-accent-cyan hover:text-white transition-colors mt-auto"
                >
                  {service.cta.label}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </SectionContainer>
  );
}
