'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SectionContainer from '@/components/ui/SectionContainer'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Badge from '@/components/ui/Badge'
import { services } from '@/data/services'

export default function ServicesGrid() {
  return (
    <SectionContainer bg="bg-bg-primary">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {services.map((service, i) => (
          <AnimatedSection key={service.id} delay={i * 0.08}>
            <Link href={`/services/${service.slug}`} className="block h-full">
              <div className="bg-bg-elevated border border-white/[0.08] rounded-xl overflow-hidden hover:border-accent-blue/30 transition-all duration-300 group cursor-pointer h-full flex flex-col">
                {/* Top gradient bar */}
                <div className="h-1 w-full bg-gradient-science flex-shrink-0" />

                {/* Content */}
                <div className="p-8 flex flex-col flex-1">
                  <Badge variant="science" className="mb-4 self-start">
                    {service.shortName}
                  </Badge>

                  <h3 className="text-heading-md font-semibold text-white group-hover:text-accent-cyan transition-colors mb-2">
                    {service.name}
                  </h3>

                  <p className="text-body-sm text-accent-cyan mb-4">
                    {service.tagline}
                  </p>

                  <p className="text-body-md text-text-secondary mb-6 flex-1">
                    {service.shortDescription}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm text-text-muted">
                      {service.subServices?.length} diagnostic areas
                    </span>
                    <ArrowRight
                      size={18}
                      className="text-accent-blue group-hover:text-accent-cyan transition-colors"
                    />
                  </div>
                </div>
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>
    </SectionContainer>
  )
}
