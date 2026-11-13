'use client'

import Link from 'next/link'
import SectionContainer from '@/components/ui/SectionContainer'
import Button from '@/components/ui/Button'
import { brand } from '@/data/content'

export default function FinalCTASection() {
  return (
    <SectionContainer bg="bg-bg-secondary relative overflow-hidden" width="narrow">
      <div className="absolute inset-0 bg-gradient-radial-cyan pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <h2 className="text-section-xl font-semibold text-white mb-6">
          Take charge of your{' '}
          <span className="gradient-text">health today.</span>
        </h2>

        <p className="text-body-lg text-text-secondary mb-10 max-w-xl">
          {brand.tagline}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact">
            <Button variant="science" size="lg">
              Get Tested Today
            </Button>
          </Link>

          <p className="text-body-md text-text-secondary">
            Or call us:{' '}
            <a
              href="tel:07034888629"
              className="text-white hover:text-accent-cyan transition-colors font-medium"
            >
              07034888629
            </a>
          </p>
        </div>
      </div>
    </SectionContainer>
  )
}
