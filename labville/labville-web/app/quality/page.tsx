import type { Metadata } from "next";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import TrustBenefitsSection from "@/components/sections/TrustBenefitsSection";
import DiagnosticProcessSection from "@/components/sections/DiagnosticProcessSection";
import FinalCTASection from "@/components/sections/FinalCTASection";

export const metadata: Metadata = {
  title: "Quality & Trust | Labville",
  description:
    "Labville's commitment to quality systems, professional standards, technology and patient-centered processes in every diagnostic service.",
};

const standards = [
  {
    title: "Accuracy",
    description:
      "Every test is performed using validated methods and calibrated instruments to ensure clinically reliable results. [Labville to provide certifications/accreditation details]",
  },
  {
    title: "Technology",
    description:
      "We invest in modern diagnostic equipment and regularly update our technology to meet current clinical standards. [Labville to provide specific equipment details]",
  },
  {
    title: "Quality Control",
    description:
      "Internal quality control checks are embedded at every stage — from sample reception to result issuance. [Labville to provide QC programme details]",
  },
  {
    title: "Patient Safety",
    description:
      "Patient safety protocols guide every interaction — from safe sample collection to secure result delivery and data privacy. [Labville to provide accreditation details]",
  },
];

export default function QualityPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative w-full bg-bg-primary overflow-hidden pt-[72px]">
        <div className="absolute inset-0 bg-gradient-radial-blue pointer-events-none" />
        <SectionContainer>
          <div className="relative z-10">
            <SectionHeading
              align="center"
              eyebrow="Quality & Trust"
              headline="Standards that define every result"
              gradientWord="Standards"
              subheadline="Our commitment to quality is embedded in every process — from sample collection to result delivery."
            />
          </div>
        </SectionContainer>
      </section>

      {/* Standards cards */}
      <SectionContainer bg="bg-bg-secondary">
        <SectionHeading
          align="center"
          eyebrow="Our Standards"
          headline="Quality at every step"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
          {standards.map((standard) => (
            <div
              key={standard.title}
              className="bg-bg-elevated border border-white/[0.08] rounded-xl p-8"
            >
              <h3 className="text-heading-md font-semibold text-white mb-3">
                {standard.title}
              </h3>
              <p className="text-body-md text-text-secondary">
                {standard.description}
              </p>
            </div>
          ))}
        </div>
      </SectionContainer>

      <TrustBenefitsSection />
      <DiagnosticProcessSection />
      <FinalCTASection />
    </div>
  );
}
