'use client'

import SectionContainer from '@/components/ui/SectionContainer'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { brand, coreValues, clientApproach } from '@/data/content'

export default function MissionValuesSection() {
  return (
    <>
      {/* Mission + Values */}
      <SectionContainer bg="bg-bg-secondary">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
          {/* Mission */}
          <div>
            <SectionHeading
              align="left"
              eyebrow="Our Mission"
              headline="Why Labville exists"
              gradientWord="Labville"
            />
            <p className="text-body-lg text-text-secondary mt-6 leading-relaxed">
              {brand.mission}
            </p>
            <p className="text-body-md text-accent-cyan mt-6 font-medium">
              {brand.healthPriority}
            </p>
          </div>

          {/* Core Values */}
          <div className="mt-12 lg:mt-0">
            <SectionHeading
              align="left"
              eyebrow="Core Values"
              headline="What we stand for"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {coreValues.map((value, i) => (
                <AnimatedSection key={value.title} delay={i * 0.07}>
                  <div className="bg-bg-elevated border border-white/[0.08] rounded-xl p-6">
                    <h3 className="font-semibold text-white mb-2">{value.title}</h3>
                    <p className="text-body-sm text-text-secondary">{value.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Client-Centric Approach */}
      <SectionContainer bg="bg-bg-primary">
        <SectionHeading
          align="center"
          eyebrow="Our Approach"
          headline="A client-centred diagnostic experience"
          gradientWord="client-centred"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
          {clientApproach.map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 0.1}>
              <div className="bg-bg-elevated border border-white/[0.08] rounded-xl p-8 h-full">
                <span className="text-section-lg font-bold gradient-text block mb-4">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-heading-md font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-body-md text-text-secondary">{item.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </SectionContainer>
    </>
  )
}
