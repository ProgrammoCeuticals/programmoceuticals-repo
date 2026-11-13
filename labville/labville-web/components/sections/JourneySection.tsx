'use client'

import SectionContainer from '@/components/ui/SectionContainer'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { brand, processSteps } from '@/data/content'

export default function JourneySection() {
  // Split mission into two paragraphs at the em dash or comma midpoint
  const missionParts = brand.mission.split(' — ')
  const missionP1 = missionParts[0]
  const missionP2 = missionParts[1] ?? ''

  return (
    <SectionContainer bg="bg-bg-secondary">
      <div className="lg:grid lg:grid-cols-2 lg:gap-16">
        {/* Left column */}
        <div>
          <SectionHeading
            align="left"
            eyebrow="Our Journey to Excellence"
            headline="Advanced diagnostics. Human-centered care."
            gradientWord="diagnostics."
          />
          <div className="mt-8 space-y-4">
            <p className="text-body-md text-text-secondary">{missionP1}.</p>
            {missionP2 && (
              <p className="text-body-md text-text-secondary">{missionP2}</p>
            )}
          </div>
        </div>

        {/* Right column — process timeline */}
        <div className="mt-12 lg:mt-0 space-y-6">
          {processSteps.map((step, index) => (
            <AnimatedSection key={step.number} delay={index * 0.07}>
              <div className="flex gap-4">
                {/* Step chip */}
                <span className="inline-flex w-10 h-10 rounded-full bg-accent-blue/15 text-accent-cyan text-eyebrow font-bold items-center justify-center flex-shrink-0">
                  {step.number}
                </span>
                {/* Step content */}
                <div>
                  <p className="text-sm font-semibold text-white">
                    {step.title}
                  </p>
                  <p className="text-body-sm text-text-secondary mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </SectionContainer>
  )
}
