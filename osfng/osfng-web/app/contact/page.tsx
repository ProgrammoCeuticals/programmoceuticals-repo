import type { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import SectionContainer from '@/components/ui/SectionContainer'
import SectionHeading from '@/components/ui/SectionHeading'
import ContactForm from '@/components/forms/ContactForm'
import { contact } from '@/data/site'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Operation Smile Foundation Nigeria. Phone: +234-913-997-3419. Email: support@osfng.org. Located at 132 Wetheral Road, Owerri, Imo State.',
}

export default function ContactPage() {
  return (
    <div className="pt-[70px]">
      {/* Hero */}
      <SectionContainer bg="bg-bg-dark relative overflow-hidden">
        <div className="absolute inset-0 leaf-pattern pointer-events-none" />
        <div className="relative z-10">
          <SectionHeading
            eyebrow="Contact Us"
            headline="We are here to help"
            subheadline="Reach out by phone, email or visit us at our Owerri office. Our team is ready to answer your questions."
            theme="dark"
          />
        </div>
      </SectionContainer>

      {/* Contact content */}
      <SectionContainer bg="bg-bg-base">
        <div className="lg:grid lg:grid-cols-2 lg:gap-14">
          {/* Contact info cards */}
          <div className="space-y-4 mb-10 lg:mb-0">
            {[
              {
                icon: Phone,
                label: 'Phone',
                content: <a href={`tel:+${contact.phone.replace(/-/g,'')}`} className="text-text-primary hover:text-green-mid transition-colors font-semibold">+{contact.phone}</a>,
              },
              {
                icon: Mail,
                label: 'Email',
                content: <a href={`mailto:${contact.email}`} className="text-text-primary hover:text-green-mid transition-colors font-semibold break-all">{contact.email}</a>,
              },
              {
                icon: MapPin,
                label: 'Address',
                content: <address className="not-italic text-text-secondary">{contact.address}</address>,
              },
              {
                icon: Clock,
                label: 'Opening Hours',
                content: <p className="text-text-muted text-sm italic">[Confirm with OSFNG]</p>,
              },
            ].map(({ icon: Icon, label, content }) => (
              <div key={label} className="card-base p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-deep/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-green-mid" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-green-mid mb-1">{label}</p>
                  <div className="text-body-sm">{content}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="card-base p-8">
            <h2 className="text-heading-md font-bold text-text-primary mb-6">Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </SectionContainer>
    </div>
  )
}
