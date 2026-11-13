"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";
import BookingCTASection from "@/components/sections/BookingCTASection";
import type { ServiceCategory } from "@/types";

const sceneMap: Record<string, React.ComponentType> = {
  MolecularScene: dynamic(() => import("@/components/3d/MolecularScene"), {
    ssr: false,
  }),
  ImagingScene: dynamic(() => import("@/components/3d/ImagingScene"), {
    ssr: false,
  }),
  HealthProfileScene: dynamic(
    () => import("@/components/3d/HealthProfileScene"),
    { ssr: false },
  ),
  BiomarkerScene: dynamic(() => import("@/components/3d/BiomarkerScene"), {
    ssr: false,
  }),
  NetworkScene: dynamic(() => import("@/components/3d/NetworkScene"), {
    ssr: false,
  }),
  HomeCollectionScene: dynamic(
    () => import("@/components/3d/HomeCollectionScene"),
    { ssr: false },
  ),
};

interface ServicePageTemplateProps {
  service: ServiceCategory;
}

export default function ServicePageTemplate({
  service,
}: ServicePageTemplateProps) {
  // Use last word of tagline as gradientWord
  const taglineWords = service.tagline.split(" ");
  const gradientWord = taglineWords[taglineWords.length - 1];

  return (
    <div>
      {/* (a) Hero */}
      <section className="relative w-full bg-bg-primary overflow-hidden pt-[72px]">
        <div className="absolute inset-0 bg-gradient-radial-blue pointer-events-none" />
        <SectionContainer>
          <div className="relative z-10">
            <AnimatedSection>
              <SectionHeading
                align="center"
                eyebrow={service.shortName}
                headline={service.tagline}
                gradientWord={gradientWord}
                subheadline={service.shortDescription}
              />
            </AnimatedSection>
          </div>
        </SectionContainer>
      </section>

      {/* (b) Full description */}
      <SectionContainer bg="bg-bg-secondary" width="narrow">
        <AnimatedSection>
          <p className="text-body-lg text-text-secondary leading-relaxed">
            {service.fullDescription}
          </p>
        </AnimatedSection>
      </SectionContainer>

      {/* (c) Sub-services */}
      <SectionContainer bg="bg-bg-primary">
        <SectionHeading
          align="left"
          eyebrow="Included Services"
          headline="What's covered"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {service.subServices?.map((subService, i) => (
            <AnimatedSection key={subService.name} delay={i * 0.1}>
              <div className="bg-bg-elevated border border-white/[0.08] rounded-xl p-6 h-full flex flex-col">
                <h3 className="text-heading-md font-semibold text-white mb-3">
                  {subService.name}
                </h3>
                <p className="text-body-md text-text-secondary mb-4 flex-1">
                  {subService.description}
                </p>
                {subService.verified ? (
                  <Badge variant="science">Verified</Badge>
                ) : (
                  <Badge variant="dark">Details Pending</Badge>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </SectionContainer>

      {/* (d) 3D scene slot */}
      <SectionContainer bg="bg-bg-primary">
        <div
          id={`3d-${service.id}`}
          className="relative h-80 rounded-xl overflow-hidden bg-bg-elevated border border-white/[0.08] my-0"
        >
          {(() => {
            const Scene3D = sceneMap[service.visual3DScene];
            if (!Scene3D) return null;
            return (
              <Suspense
                fallback={
                  <div className="w-full h-full bg-bg-elevated animate-pulse rounded-xl" />
                }
              >
                <Scene3D />
              </Suspense>
            );
          })()}
        </div>
      </SectionContainer>

      {/* (e) CTA */}
      <BookingCTASection />
    </div>
  );
}
