import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactForm from "@/components/forms/ContactForm";
import { contact } from "@/data/navigation";

export const metadata: Metadata = {
  title: "Contact Labville | Diagnostic Centre, Ikorodu Lagos",
  description:
    "Contact Labville Diagnostic Centre in Ikorodu, Lagos. Phone: 07034888629. Email: enquiries@labvillediagnostic.com.",
};

export default function ContactPage() {
  return (
    <div className="pt-[72px]">
      {/* Hero */}
      <SectionContainer bg="bg-bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial-blue pointer-events-none" />
        <div className="relative z-10">
          <SectionHeading
            align="center"
            eyebrow="Contact"
            headline="Get in touch"
            subheadline="Have a question or ready to book? Reach us by phone, email or visit our centre in Ikorodu, Lagos."
          />
        </div>
      </SectionContainer>

      {/* Content */}
      <SectionContainer bg="bg-bg-secondary">
        <div className="md:grid md:grid-cols-2 gap-12">
          {/* Left: contact info cards */}
          <div className="space-y-5 mb-10 md:mb-0">
            {/* Phone */}
            <div className="bg-bg-elevated border border-white/[0.08] rounded-xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent-blue/15 flex items-center justify-center flex-shrink-0">
                <Phone size={18} className="text-accent-cyan" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-accent-cyan mb-1">
                  Phone
                </p>
                <a
                  href={`tel:${contact.phone}`}
                  className="text-white hover:text-accent-cyan transition-colors text-body-md font-medium"
                >
                  {contact.phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="bg-bg-elevated border border-white/[0.08] rounded-xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent-blue/15 flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-accent-cyan" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-accent-cyan mb-1">
                  Email
                </p>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-white hover:text-accent-cyan transition-colors text-body-md font-medium break-all"
                >
                  {contact.email}
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="bg-bg-elevated border border-white/[0.08] rounded-xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent-blue/15 flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-accent-cyan" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-accent-cyan mb-1">
                  Address
                </p>
                <address className="not-italic text-text-secondary text-body-md leading-relaxed">
                  {contact.address.full}
                </address>
              </div>
            </div>

            {/* Opening hours */}
            <div className="bg-bg-elevated border border-white/[0.08] rounded-xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent-blue/15 flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-accent-cyan" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-accent-cyan mb-1">
                  Opening Hours
                </p>
                <p className="text-text-muted text-sm italic">
                  [Labville to confirm operating hours]
                </p>
              </div>
            </div>
          </div>

          {/* Right: ContactForm */}
          <div className="bg-bg-elevated border border-white/[0.08] rounded-xl p-8">
            <h2 className="text-heading-md font-semibold text-white mb-8">
              Send us a message
            </h2>
            <ContactForm />
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-12 bg-bg-elevated border border-white/[0.08] rounded-xl h-64 flex items-center justify-center">
          <p className="text-text-muted text-body-sm">
            Interactive map — [Labville to configure map embed]
          </p>
        </div>
      </SectionContainer>
    </div>
  );
}
