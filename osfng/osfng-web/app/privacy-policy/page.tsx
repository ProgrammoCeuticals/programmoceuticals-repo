import type { Metadata } from 'next'
import SectionContainer from '@/components/ui/SectionContainer'
import SectionHeading from '@/components/ui/SectionHeading'
import { contact } from '@/data/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Operation Smile Foundation Nigeria privacy policy — how we collect, use and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-[70px]">
      <SectionContainer bg="bg-bg-dark relative overflow-hidden" py={false} className="py-16">
        <div className="absolute inset-0 leaf-pattern pointer-events-none" />
        <div className="relative z-10">
          <SectionHeading eyebrow="Legal" headline="Privacy Policy" theme="dark" divider={false} />
        </div>
      </SectionContainer>

      <SectionContainer bg="bg-bg-base" width="narrow">
        <div className="prose prose-sm max-w-none text-text-secondary">
          <div className="p-6 bg-bg-alt rounded-xl border border-border-light mb-10">
            <p className="text-body-sm text-text-muted">
              <strong className="text-text-primary">Important:</strong> The full Privacy Policy text is pending
              confirmation from Operation Smile Foundation Nigeria. This page will be updated with the
              approved, legally reviewed policy before the website launches. The contact information
              below is from the indexed website footer.
            </p>
          </div>

          <h2 className="text-heading-md font-bold text-text-primary mb-4">About This Policy</h2>
          <p>
            Operation Smile Foundation Nigeria (&ldquo;OSF&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is committed to
            protecting the personal information of our members, clients and website visitors.
          </p>

          <h2 className="text-heading-md font-bold text-text-primary mt-10 mb-4">Information We May Collect</h2>
          <p>
            When you use our website, contact us or apply for our services, we may collect personal
            information such as your name, contact details, financial information and identification
            documents as required by our processes.
          </p>

          <h2 className="text-heading-md font-bold text-text-primary mt-10 mb-4">How We Use Your Information</h2>
          <p>
            We use personal information to process membership and loan applications, provide financial
            services, communicate with you about your account, and comply with legal and regulatory requirements.
          </p>

          <h2 className="text-heading-md font-bold text-text-primary mt-10 mb-4">Contact</h2>
          <p>
            For any privacy-related enquiries, contact us at{' '}
            <a href={`mailto:${contact.email}`} className="text-green-mid hover:text-green-deep underline">
              {contact.email}
            </a>{' '}
            or visit us at {contact.address}.
          </p>

          <p className="mt-10 text-body-sm text-text-muted italic">
            This page will be replaced with the full approved privacy policy before launch.
          </p>
        </div>
      </SectionContainer>
    </div>
  )
}
