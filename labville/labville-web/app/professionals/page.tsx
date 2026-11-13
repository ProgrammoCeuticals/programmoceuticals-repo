import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "For Healthcare Professionals | Labville",
  description:
    "Referral information, test directory, sample requirements and professional resources for clinicians and healthcare providers at Labville.",
};

const referralSteps = [
  {
    number: "01",
    title: "Request",
    description:
      "Raise a referral by phone, email or our dedicated clinician contact form.",
  },
  {
    number: "02",
    title: "Collection",
    description:
      "Patient attends our centre or we arrange home collection as appropriate.",
  },
  {
    number: "03",
    title: "Analysis",
    description:
      "Samples are processed and tested using validated laboratory methods.",
  },
  {
    number: "04",
    title: "Report",
    description:
      "Diagnostic reports are issued to the referring clinician in the agreed format and timeframe.",
  },
];

export default function ProfessionalsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative w-full bg-bg-primary overflow-hidden pt-[72px]">
        <div className="absolute inset-0 bg-gradient-radial-blue pointer-events-none" />
        <SectionContainer>
          <div className="relative z-10">
            <SectionHeading
              align="center"
              eyebrow="For Clinicians"
              headline="Professional diagnostic resources"
              gradientWord="Professional"
              subheadline="Referral pathways, test information and clinical resources for healthcare professionals and their patients."
            />
          </div>
        </SectionContainer>
      </section>

      {/* Referral Pathway */}
      <SectionContainer bg="bg-bg-secondary">
        <SectionHeading
          align="center"
          eyebrow="Referral Pathway"
          headline="From referral to report"
          gradientWord="report"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {referralSteps.map((step, i) => (
            <AnimatedSection key={step.number} delay={i * 0.1}>
              <div className="flex flex-col items-start">
                {/* Number + connector */}
                <div className="flex items-center gap-3 mb-4 w-full">
                  <span className="w-10 h-10 rounded-full bg-accent-blue/15 text-accent-cyan text-eyebrow font-bold flex items-center justify-center flex-shrink-0">
                    {step.number}
                  </span>
                  {i < referralSteps.length - 1 && (
                    <ArrowRight
                      size={16}
                      className="text-white/20 hidden md:block"
                    />
                  )}
                </div>
                <h3 className="text-heading-md font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-body-sm text-text-secondary">
                  {step.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </SectionContainer>

      {/* Test directory placeholder */}
      <SectionContainer bg="bg-bg-primary">
        <SectionHeading
          align="left"
          eyebrow="Test Directory"
          headline="Available diagnostic tests"
        />

        <div className="mt-10 bg-bg-elevated border border-white/[0.08] rounded-xl p-10 text-center">
          <p className="text-text-secondary text-body-md mb-2">
            A full test directory with sample requirements, turnaround times and
            reference ranges is being compiled.
          </p>
          <p className="text-text-muted text-sm italic">
            [Labville to provide complete test catalogue]
          </p>
        </div>
      </SectionContainer>

      {/* CTA */}
      <SectionContainer bg="bg-bg-secondary" width="narrow">
        <div className="flex flex-col items-center text-center gap-6">
          <SectionHeading
            align="center"
            eyebrow="Get in Touch"
            headline="Refer a patient or request more information"
            gradientWord="Refer"
          />
          <Link href="/contact?subject=clinician">
            <Button variant="science" size="lg">
              Contact Labville
            </Button>
          </Link>
        </div>
      </SectionContainer>
    </div>
  );
}
