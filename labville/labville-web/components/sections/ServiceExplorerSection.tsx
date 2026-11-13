"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { services } from "@/data/services";
import type { ServiceCategory } from "@/types";

// All 6 scenes loaded once, kept mounted — only visibility toggled
const SceneComponents: Record<string, React.ComponentType> = {
  MolecularScene:      dynamic(() => import("@/components/3d/MolecularScene"),      { ssr: false }),
  ImagingScene:        dynamic(() => import("@/components/3d/ImagingScene"),        { ssr: false }),
  HealthProfileScene:  dynamic(() => import("@/components/3d/HealthProfileScene"),  { ssr: false }),
  BiomarkerScene:      dynamic(() => import("@/components/3d/BiomarkerScene"),      { ssr: false }),
  NetworkScene:        dynamic(() => import("@/components/3d/NetworkScene"),        { ssr: false }),
  HomeCollectionScene: dynamic(() => import("@/components/3d/HomeCollectionScene"), { ssr: false }),
};

function SceneSlot({ activeScene }: { activeScene: string }) {
  return (
    <div className="relative w-full h-full">
      {services.map((s) => {
        const Scene = SceneComponents[s.visual3DScene];
        if (!Scene) return null;
        return (
          <div
            key={s.id}
            className="absolute inset-0"
            style={{
              opacity: s.visual3DScene === activeScene ? 1 : 0,
              transition: "opacity 0.4s ease",
              pointerEvents: s.visual3DScene === activeScene ? "auto" : "none",
            }}
          >
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </div>
        );
      })}
    </div>
  );
}

function ServiceTab({
  service,
  active,
  onClick,
}: {
  service: ServiceCategory;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative w-full text-left px-4 py-3.5 rounded-xl transition-all duration-200"
      style={{
        background: active ? "rgba(30,111,217,0.12)" : "transparent",
        border: active ? "1px solid rgba(30,111,217,0.3)" : "1px solid transparent",
      }}
    >
      {active && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full bg-gradient-science"
        />
      )}
      <p
        className="text-sm font-semibold pl-3 transition-colors duration-200"
        style={{ color: active ? "#fff" : "#A0AABB" }}
      >
        {service.name}
      </p>
      <p className="text-[11px] text-text-muted pl-3 mt-0.5 leading-snug">
        {service.tagline}
      </p>
    </button>
  );
}

export default function ServiceExplorerSection() {
  const [activeId, setActiveId] = useState<string>(services[0].id);
  const active = services.find((s) => s.id === activeId) ?? services[0];

  return (
    <SectionContainer bg="bg-bg-primary relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(30,111,217,0.08) 0%, transparent 60%)" }}
      />

      <div className="relative z-10">
        <SectionHeading
          align="center"
          eyebrow="Diagnostic Services"
          headline="One platform. Every diagnostic need."
          gradientWord="diagnostic need."
        />

        <div className="mt-14 lg:grid lg:grid-cols-[280px_1fr] lg:gap-10 xl:gap-16">
          {/* Tab list */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 mb-8 lg:mb-0 scrollbar-hide">
            {services.map((s) => (
              <div key={s.id} className="flex-shrink-0 lg:flex-shrink w-[200px] lg:w-auto">
                <ServiceTab
                  service={s}
                  active={s.id === activeId}
                  onClick={() => setActiveId(s.id)}
                />
              </div>
            ))}
          </div>

          {/* Content panel — never unmounts */}
          <div className="bg-bg-elevated border border-white/8 rounded-2xl overflow-hidden">
            {/* 3D scene slot — all canvases stay mounted */}
            <div className="h-56 md:h-72 relative bg-gradient-to-br from-accent-blue/10 to-accent-cyan/10">
              <SceneSlot activeScene={active.visual3DScene} />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-bg-elevated to-transparent pointer-events-none" />
            </div>

            {/* Text content — animate on key change */}
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 md:p-10"
            >
              <Badge variant="science" className="mb-3">{active.shortName}</Badge>
              <h3 className="text-section-lg font-semibold text-white leading-tight mt-1">
                {active.name}
              </h3>
              <p className="text-accent-cyan text-sm mt-1 mb-5">{active.tagline}</p>

              <p className="text-body-md text-text-secondary mb-8 leading-relaxed">
                {active.fullDescription}
              </p>

              {active.subServices && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                  {active.subServices.map((sub) => (
                    <div
                      key={sub.name}
                      className="bg-bg-secondary border border-white/8 rounded-xl p-4"
                    >
                      <p className="text-sm font-semibold text-white mb-1">{sub.name}</p>
                      <p className="text-xs text-text-muted leading-snug">{sub.description}</p>
                    </div>
                  ))}
                </div>
              )}

              <Link href={active.cta.href}>
                <Button variant="science" size="md">
                  {active.cta.label}
                  <ArrowRight size={15} className="ml-1" aria-hidden="true" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
