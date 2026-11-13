'use client'

import SectionContainer from '@/components/ui/SectionContainer'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { healthConcerns } from '@/data/content'

export default function HealthConcernsSection() {
  return (
    <SectionContainer bg="bg-bg-secondary">
      <SectionHeading
        eyebrow="Health Concerns We Address"
        headline="Diagnostics that address real health challenges"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {healthConcerns.map((concern, index) => (
          <AnimatedSection key={concern.title} delay={index * 0.1}>
            <div className="bg-bg-elevated border border-white/8 rounded-xl p-8 h-full">
              <p className="text-section-lg font-bold gradient-text mb-4">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="text-heading-md font-semibold text-white mb-3">
                {concern.title}
              </h3>
              <p className="text-body-md text-text-secondary">
                {concern.description}
              </p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </SectionContainer>
  )
}
