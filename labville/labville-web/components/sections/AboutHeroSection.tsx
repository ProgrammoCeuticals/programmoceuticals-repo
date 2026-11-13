'use client'

import SectionContainer from '@/components/ui/SectionContainer'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { brand } from '@/data/content'

export default function AboutHeroSection() {
  return (
    <section className="relative w-full bg-bg-primary overflow-hidden pt-[72px]">
      <div className="absolute inset-0 bg-gradient-radial-blue pointer-events-none" />

      <SectionContainer width="content">
        <div className="relative z-10">
          <AnimatedSection>
            <SectionHeading
              align="center"
              eyebrow="About Labville Diagnostic Centre"
              headline="Our journey to excellence"
              gradientWord="excellence"
              subheadline="Labville Diagnostic Centre is committed to providing the highest quality laboratory services with cutting-edge technology. Our team of experts ensures accurate testing and reliable results for our community. We focus on making healthcare accessible and affordable for everyone."
            />
          </AnimatedSection>
        </div>
      </SectionContainer>
    </section>
  )
}
