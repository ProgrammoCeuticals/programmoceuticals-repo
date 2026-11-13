import type { Metadata } from 'next'
import SectionContainer from '@/components/ui/SectionContainer'
import SectionHeading from '@/components/ui/SectionHeading'
import { contact } from '@/data/site'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Operation Smile Foundation Nigeria terms and conditions of use.',
}

export default function TermsPage() {
  return (
    <div className="pt-[70px]">
      <SectionContainer bg="bg-bg-dark relative overflow-hidden" py={false} className="py-16">
        <div className="absolute inset-0 leaf-pattern pointer-events-none" />
        <div className="relative z-10">
          <SectionHeading eyebrow="Legal" headline="Terms & Conditions" theme="dark" divider={false} />
        </div>
      </SectionContainer>

      <SectionContainer bg="bg-bg-base" width="narrow">
        <div className="prose prose-sm max-w-none text-text-secondary">
          <div className="p-6 bg-bg-alt rounded-xl border border-border-light mb-10">
            <p className="text-body-sm text-text-muted">
              <strong className="text-text-primary">Important:</strong> The full Terms and Conditions
              are pending confirmation from Operation Smile Foundation Nigeria. This page will be
              replaced with the approved, legally reviewed terms before the website launches.
            </p>
          </div>

          <h2 className="text-heading-md font-bold text-text-primary mb-4">Use of This Website</h2>
          <p>
            By accessing the Operation Smile Foundation Nigeria website, you agree to use it only for
            lawful purposes and in a manner that does not infringe the rights of others.
          </p>

          <h2 className="text-heading-md font-bold text-text-primary mt-10 mb-4">No Financial Advice</h2>
          <p>
            Content on this website is for general information only. It does not constitute financial,
            legal or investment advice. You should consult a qualified professional before making
            financial decisions.
          </p>

          <h2 className="text-heading-md font-bold text-text-primary mt-10 mb-4">Product Information</h2>
          <p>
            Product details, rates, fees and eligibility criteria on this website are subject to change.
            Contact OSF directly for current, confirmed product information before making any decisions.
          </p>

          <h2 className="text-heading-md font-bold text-text-primary mt-10 mb-4">Contact</h2>
          <p>
            For any enquiries about these terms, contact us at{' '}
            <a href={`mailto:${contact.email}`} className="text-green-mid hover:text-green-deep underline">
              {contact.email}
            </a>.
          </p>

          <p className="mt-10 text-body-sm text-text-muted italic">
            This page will be replaced with the full approved terms before launch.
          </p>
        </div>
      </SectionContainer>
    </div>
  )
}
