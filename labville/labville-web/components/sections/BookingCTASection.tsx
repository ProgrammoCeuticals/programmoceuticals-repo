'use client'

import Link from 'next/link'
import SectionContainer from '@/components/ui/SectionContainer'
import Button from '@/components/ui/Button'
import { brand } from '@/data/content'

export default function BookingCTASection() {
  return (
    <SectionContainer bg="bg-bg-elevated" width="narrow">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-section-lg font-semibold text-white mb-4">
          Ready to take the next step?
        </h2>
        <p className="text-body-lg text-text-secondary mb-10">
          {brand.tagline}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact">
            <Button variant="science" size="lg">
              Contact Us
            </Button>
          </Link>

          <span className="text-text-muted text-body-sm">or</span>

          <p className="text-body-md text-text-secondary">
            Call us at:{' '}
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
