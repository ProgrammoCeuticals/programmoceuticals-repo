import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, AlertCircle } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import ContactForm from "@/components/forms/ContactForm";
import { contact } from "@/data/site";

export const metadata: Metadata = {
  title: "Apply for a Loan",
  description:
    "Apply for a business or working capital loan from Operation Smile Foundation Nigeria. Speak to a field officer or send an enquiry.",
};

export default function ApplyForALoanPage() {
  return (
    <div className="pt-[70px]">
      {/* Hero */}
      <SectionContainer bg="bg-bg-dark relative overflow-hidden">
        <div className="absolute inset-0 leaf-pattern pointer-events-none" />
        <div className="relative z-10">
          <SectionHeading
            eyebrow="Apply for a Loan"
            headline="Start your loan application"
            subheadline="Take the first step. Fill in the form below or contact us directly and an OSF field officer will guide you through the process."
            theme="dark"
          />
        </div>
      </SectionContainer>

      {/* Main content */}
      <SectionContainer bg="bg-bg-base">
        <div className="lg:grid lg:grid-cols-2 lg:gap-14">
          {/* Left — info */}
          <AnimatedSection>
            <SectionHeading
              eyebrow="Before You Apply"
              headline="What to expect"
            />
            <div className="mt-6 space-y-5">
              {[
                {
                  step: "01",
                  title: "Tell us about your need",
                  desc: "Describe the business or personal need your loan will address and how you plan to repay.",
                },
                {
                  step: "02",
                  title: "Speak with a field officer",
                  desc: "An OSF team member will contact you to discuss current products, eligibility and required documents.",
                },
                {
                  step: "03",
                  title: "Complete your application",
                  desc: "Submit your application with the required documents. Our team will guide you at every step.",
                },
                {
                  step: "04",
                  title: "Receive a decision",
                  desc: "OSF will review your application and inform you of the outcome as promptly as possible.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <span className="w-9 h-9 rounded-full bg-green-deep/10 text-green-mid text-xs font-black flex items-center justify-center shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-text-primary">
                      {item.title}
                    </p>
                    <p className="text-body-sm text-text-secondary mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="mt-8 p-5 bg-gold-pale rounded-xl border border-gold/20 flex items-start gap-3">
              <AlertCircle
                size={16}
                className="text-gold mt-0.5 shrink-0"
                aria-hidden="true"
              />
              <p className="text-body-sm text-text-secondary">
                Specific loan amounts, interest rates, repayment terms and
                eligibility criteria must be confirmed with OSFNG. Do not rely
                on historical promotional information. Our team will provide
                current, accurate product details.
              </p>
            </div>

            {/* Direct contact */}
            <div className="mt-8 space-y-3">
              <a
                href={`tel:+${contact.phone.replace(/-/g, "")}`}
                className="flex items-center gap-3 text-body-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                <Phone
                  size={15}
                  className="text-green-mid"
                  aria-hidden="true"
                />
                <span>+{contact.phone}</span>
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 text-body-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                <Mail size={15} className="text-green-mid" aria-hidden="true" />
                <span>{contact.email}</span>
              </a>
            </div>
          </AnimatedSection>

          {/* Right — enquiry form */}
          <AnimatedSection delay={0.15} className="mt-12 lg:mt-0">
            <div className="card-base p-8">
              <h2 className="text-heading-md font-bold text-text-primary mb-2">
                Loan enquiry form
              </h2>
              <p className="text-body-sm text-text-muted mb-6">
                This form submits a loan enquiry. It is not a formal loan
                application. An OSF field officer will contact you to discuss
                your needs and next steps.
              </p>
              <ContactForm />
            </div>
          </AnimatedSection>
        </div>
      </SectionContainer>
    </div>
  );
}
