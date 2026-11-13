'use client'

import SectionContainer from '@/components/ui/SectionContainer'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function ServicesHero() {
  return (
    <section className="relative w-full bg-bg-primary overflow-hidden pt-[72px]">
      {/* Radial glow overlay */}
      <div className="absolute inset-0 bg-gradient-radial-blue pointer-events-none" />

      <SectionContainer>
        <div className="relative z-10">
          <AnimatedSection>
            <SectionHeading
              align="center"
              eyebrow="Our Services"
              headline="Comprehensive diagnostics for every clinical need"
              gradientWord="diagnostics"
              subheadline="From routine laboratory tests to advanced imaging and specialized diagnostics — Labville delivers precision at every step of your health journey."
            />
          </AnimatedSection>
        </div>
      </SectionContainer>
    </section>
  )
}
