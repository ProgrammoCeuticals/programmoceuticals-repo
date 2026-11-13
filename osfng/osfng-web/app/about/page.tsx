import type { Metadata } from "next";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import CTASection from "@/components/sections/CTASection";
import FocusAreasSection from "@/components/sections/FocusAreasSection";
import { brand, focusAreas, contact } from "@/data/site";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Operation Smile Foundation Nigeria — our mission, values and community-centred approach to poverty alleviation since 2020.",
};

const values = [
  {
    title: "Community First",
    desc: "We work within and for communities, using local resources and networks to create lasting change.",
  },
  {
    title: "Integrity",
    desc: "We operate with honesty and transparency in all our financial and development activities.",
  },
  {
    title: "Empowerment",
    desc: "We build capacity — not dependency — so individuals and communities can sustain their own progress.",
  },
  {
    title: "Inclusion",
    desc: "We focus on women, youth and underserved groups who are most often excluded from financial systems.",
  },
  {
    title: "Innovation",
    desc: "We use innovative financial and non-financial approaches to address the root causes of poverty.",
  },
  {
    title: "Accountability",
    desc: "We are accountable to the communities we serve and to every member who trusts us with their savings.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-[70px]">
      {/* Hero */}
      <SectionContainer bg="bg-bg-dark relative overflow-hidden">
        <div className="absolute inset-0 leaf-pattern pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <SectionHeading
            eyebrow="About OSF"
            headline="We are more than a microfinance institution"
            subheadline="Operation Smile Foundation is a developmental organisation dedicated to alleviating poverty and empowering communities in Nigeria."
            theme="dark"
          />
        </div>
      </SectionContainer>

      {/* Our Story */}
      <SectionContainer bg="bg-bg-base">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Our Story"
              headline="Founded to make a difference"
            />
            <div className="mt-6 space-y-4">
              <p className="text-body-md text-text-secondary leading-relaxed">
                {brand.mission}
              </p>
              <p className="text-body-md text-text-secondary leading-relaxed">
                Since our founding in{" "}
                <strong className="text-text-primary">2020</strong>, we have
                been working across{" "}
                <strong className="text-text-primary">Owerri, Imo State</strong>{" "}
                and surrounding communities to connect underserved individuals —
                especially women and young people — to the financial tools and
                knowledge they need to improve their lives.
              </p>
              <p className="text-body-md text-text-secondary leading-relaxed">
                Our field officers are present in communities, meeting clients
                at their businesses and homes. We believe access to financial
                services should not require leaving your daily life.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15} className="mt-10 lg:mt-0">
            <div className="bg-bg-alt rounded-2xl p-8 space-y-5">
              {[
                { label: "Founded", value: "2020" },
                {
                  label: "Type",
                  value: "Non-profit / Development Organisation",
                },
                {
                  label: "Headquarters",
                  value: "132 Wetheral Road, Owerri, Imo State",
                },
                {
                  label: "Focus",
                  value:
                    "Financial Inclusion, Health, Agriculture, Entrepreneurship",
                },
                { label: "Contact", value: contact.email },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-col sm:flex-row sm:gap-3 pb-5 border-b border-border-light last:border-0 last:pb-0"
                >
                  <span className="text-body-sm font-bold text-text-muted sm:w-32 sm:shrink-0 mb-0.5 sm:mb-0">
                    {label}
                  </span>
                  <span className="text-body-sm text-text-primary">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </SectionContainer>

      {/* Mission */}
      <SectionContainer bg="bg-bg-dark relative overflow-hidden">
        <div className="absolute inset-0 leaf-pattern pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Our Mission"
              headline="Reducing poverty through innovation"
              subheadline={brand.missionShort}
              align="center"
              theme="dark"
            />
          </AnimatedSection>
        </div>
      </SectionContainer>

      {/* Values */}
      <SectionContainer bg="bg-bg-base">
        <SectionHeading
          eyebrow="Our Values"
          headline="What guides everything we do"
          align="center"
        />
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <AnimatedSection key={v.title} delay={i * 0.07}>
              <div className="card-base p-7 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle
                    size={18}
                    className="text-green-mid"
                    aria-hidden="true"
                  />
                  <h3 className="text-heading-md font-bold text-text-primary">
                    {v.title}
                  </h3>
                </div>
                <p className="text-body-sm text-text-secondary">{v.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </SectionContainer>

      <FocusAreasSection />
      <CTASection />
    </div>
  );
}
