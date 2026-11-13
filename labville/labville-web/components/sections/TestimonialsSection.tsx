'use client'

import SectionContainer from '@/components/ui/SectionContainer'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Badge from '@/components/ui/Badge'
import { testimonials } from '@/data/content'

export default function TestimonialsSection() {
  return (
    <SectionContainer bg="bg-bg-secondary">
      <SectionHeading
        align="center"
        eyebrow="Client Experiences"
        headline="What our patients say"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {testimonials.map((testimonial, i) => (
          <AnimatedSection key={i} delay={i * 0.1}>
            <div className="bg-bg-elevated border border-white/8 rounded-xl p-8 h-full flex flex-col">
              {/* Opening quote mark */}
              <span className="text-4xl text-accent-blue/40 font-serif leading-none mb-4 select-none">
                &ldquo;
              </span>

              <p className="text-body-md text-white leading-relaxed mb-6 flex-1">
                {testimonial.text}
              </p>

              <Badge variant="dark">{testimonial.theme}</Badge>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </SectionContainer>
  )
}
