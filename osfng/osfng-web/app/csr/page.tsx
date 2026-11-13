import type { Metadata } from 'next'
import Link from 'next/link'
import SectionContainer from '@/components/ui/SectionContainer'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Button from '@/components/ui/Button'
import CommunitySection from '@/components/sections/CommunitySection'
import CTASection from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'CSR',
  description: 'Operation Smile Foundation Nigeria community social responsibility initiatives — supporting health, education and empowerment across Imo State.',
}

export default function CSRPage() {
  return (
    <div className="pt-[70px]">
      {/* Hero */}
      <SectionContainer bg="bg-bg-dark relative overflow-hidden">
        <div className="absolute inset-0 leaf-pattern pointer-events-none" />
        <div className="relative z-10">
          <SectionHeading
            eyebrow="CSR"
            headline="Community Social Responsibility"
            subheadline="Beyond financial services, Operation Smile Foundation invests in the communities it serves through education, health and empowerment initiatives."
            theme="dark"
          />
        </div>
      </SectionContainer>

      {/* Content placeholder */}
      <SectionContainer bg="bg-bg-base">
        <AnimatedSection>
          <div className="max-w-2xl">
            <SectionHeading
              eyebrow="Our Commitment"
              headline="Giving back to the communities we serve"
            />
            <p className="text-body-md text-text-secondary mt-6 leading-relaxed">
              Operation Smile Foundation&rsquo;s social responsibility extends beyond financial products.
              We engage directly with communities through outreach events, financial literacy programmes
              and education initiatives, particularly targeting women and young people.
            </p>
            <p className="text-body-md text-text-secondary mt-4 leading-relaxed">
              Our field staff are embedded in communities across Imo State, allowing us to understand
              and respond to the real needs of the people we serve.
            </p>
            <div className="mt-8 p-6 bg-bg-alt rounded-2xl border border-border-light">
              <p className="text-body-sm text-text-muted">
                Full details of our CSR programmes and current initiatives are being confirmed with OSFNG.
                This page will be updated with verified content. Contact us to learn more about our
                community work.
              </p>
              <div className="mt-5">
                <Link href="/contact">
                  <Button variant="primary" size="md">Contact Us</Button>
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </SectionContainer>

      <CommunitySection />
      <CTASection />
    </div>
  )
}
