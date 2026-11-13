'use client'

import { Target, Users, Heart } from 'lucide-react'
import SectionContainer from '@/components/ui/SectionContainer'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { trustPillars } from '@/data/content'

const iconMap = {
  target: Target,
  users:  Users,
  heart:  Heart,
}

export default function TrustBenefitsSection() {
  return (
    <SectionContainer bg="bg-bg-primary relative">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      <div className="relative z-10">
        <SectionHeading
          align="center"
          eyebrow="Why Choose Labville"
          headline="Experience exceptional benefits"
          gradientWord="exceptional"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
          {trustPillars.map((pillar, i) => {
            const Icon = iconMap[pillar.icon as keyof typeof iconMap]
            return (
              <AnimatedSection key={pillar.title} delay={i * 0.1}>
                <div className="flex flex-col items-start">
                  <div className="w-12 h-12 rounded-xl bg-accent-blue/15 flex items-center justify-center mb-5">
                    {Icon && <Icon className="text-accent-cyan" size={22} />}
                  </div>
                  <h3 className="text-heading-md font-semibold text-white mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-body-md text-text-secondary">
                    {pillar.description}
                  </p>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </SectionContainer>
  )
}
