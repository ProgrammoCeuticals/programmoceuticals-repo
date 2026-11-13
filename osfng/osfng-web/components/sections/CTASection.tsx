'use client'
import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import SectionContainer from '@/components/ui/SectionContainer'
import Button from '@/components/ui/Button'
import { contact } from '@/data/site'

export default function CTASection() {
  return (
    <SectionContainer bg="bg-bg-dark relative overflow-hidden">
      <div className="absolute inset-0 leaf-pattern pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-radial-gold opacity-40 pointer-events-none" />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <AnimatedSection>
          <span className="text-eyebrow uppercase tracking-[0.1em] font-bold text-gold mb-4 block">
            Ready to Get Started?
          </span>
          <h2 className="text-section-xl font-bold text-white mb-5">
            Take the first step toward a better future
          </h2>
          <p className="text-body-lg text-text-light-muted mb-10">
            Whether you want to start saving, access a loan or simply learn more — the Operation Smile Foundation team is ready to help.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/become-a-member">
              <Button variant="gold" size="lg">
                Become a Member
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="light" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>

          <a
            href={`tel:+${contact.phone.replace(/-/g,'')}`}
            className="inline-flex items-center gap-2 mt-8 text-sm text-text-light-muted hover:text-white transition-colors"
          >
            <Phone size={14} aria-hidden="true" className="text-gold" />
            <span>Call us: +{contact.phone}</span>
          </a>
        </AnimatedSection>
      </div>
    </SectionContainer>
  )
}
