import type { Metadata } from 'next'
import Link from 'next/link'
import { Users, CheckCircle, Phone, Mail } from 'lucide-react'
import SectionContainer from '@/components/ui/SectionContainer'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Button from '@/components/ui/Button'
import ContactForm from '@/components/forms/ContactForm'
import { contact } from '@/data/site'

export const metadata: Metadata = {
  title: 'Become a Member',
  description: 'Join Operation Smile Foundation Nigeria. Membership gives you access to our savings, loans and development programmes.',
}

const benefits = [
  'Access to savings and investment accounts',
  'Eligibility for business and working capital loans',
  'Financial literacy support and education',
  'Field officer assistance in your community',
  'Access to OSF development programmes',
]

export default function BecomeAMemberPage() {
  return (
    <div className="pt-[70px]">
      {/* Hero */}
      <SectionContainer bg="bg-bg-dark relative overflow-hidden">
        <div className="absolute inset-0 leaf-pattern pointer-events-none" />
        <div className="relative z-10">
          <SectionHeading
            eyebrow="Become a Member"
            headline="Join the Operation Smile Foundation community"
            subheadline="Membership gives you access to our full range of financial products and development programmes. Take the first step today."
            theme="dark"
          />
        </div>
      </SectionContainer>

      {/* Benefits + Enquiry */}
      <SectionContainer bg="bg-bg-base">
        <div className="lg:grid lg:grid-cols-2 lg:gap-14">
          {/* Benefits */}
          <AnimatedSection>
            <SectionHeading eyebrow="Member Benefits" headline="What membership gives you" />
            <ul className="mt-8 space-y-4">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-green-mid mt-0.5 shrink-0" aria-hidden="true" />
                  <span className="text-body-md text-text-secondary">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 p-6 bg-bg-alt rounded-2xl border border-border-light">
              <div className="flex items-center gap-3 mb-3">
                <Users size={18} className="text-green-mid" aria-hidden="true" />
                <p className="text-sm font-bold text-text-primary">Membership Requirements</p>
              </div>
              <p className="text-body-sm text-text-muted">
                Exact membership eligibility, fees, required documents and terms are being confirmed with OSFNG.
                Use the form or contact us directly to enquire.
              </p>
            </div>

            {/* Direct contact */}
            <div className="mt-8 space-y-3">
              <a href={`tel:+${contact.phone.replace(/-/g,'')}`}
                className="flex items-center gap-3 text-body-sm text-text-secondary hover:text-text-primary transition-colors">
                <Phone size={16} className="text-green-mid" aria-hidden="true" />
                <span>+{contact.phone}</span>
              </a>
              <a href={`mailto:${contact.email}`}
                className="flex items-center gap-3 text-body-sm text-text-secondary hover:text-text-primary transition-colors">
                <Mail size={16} className="text-green-mid" aria-hidden="true" />
                <span>{contact.email}</span>
              </a>
            </div>
          </AnimatedSection>

          {/* Enquiry form */}
          <AnimatedSection delay={0.15} className="mt-12 lg:mt-0">
            <div className="card-base p-8">
              <h2 className="text-heading-md font-bold text-text-primary mb-2">Send a membership enquiry</h2>
              <p className="text-body-sm text-text-muted mb-6">
                Fill in this form and an OSF team member will be in touch to guide you through the membership process.
              </p>
              <ContactForm />
            </div>
          </AnimatedSection>
        </div>
      </SectionContainer>
    </div>
  )
}
