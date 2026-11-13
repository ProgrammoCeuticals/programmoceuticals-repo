'use client'

import SectionContainer from '@/components/ui/SectionContainer'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { processSteps } from '@/data/content'

export default function DiagnosticProcessSection() {
  return (
    <SectionContainer bg="bg-bg-primary">
      <SectionHeading
        align="center"
        eyebrow="Sample to Result"
        headline="The diagnostic process, step by step"
        gradientWord="diagnostic"
      />

      <div className="relative mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {processSteps.map((step, index) => (
          <AnimatedSection key={step.number} delay={index * 0.07}>
            <div className="flex flex-col items-start">
              {/* Number chip */}
              <span className="w-10 h-10 rounded-full bg-accent-blue/15 text-accent-cyan text-eyebrow font-bold flex items-center justify-center mb-4 flex-shrink-0">
                {step.number}
              </span>
              <h3 className="text-sm font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-body-sm text-text-secondary">{step.description}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </SectionContainer>
  )
}
