import type { Metadata } from "next";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import FAQSection from "@/components/sections/FAQSection";
import BookingCTASection from "@/components/sections/BookingCTASection";

export const metadata: Metadata = {
  title: "Patient Resources | Labville",
  description:
    "FAQs, test preparation guides and health education resources from Labville Diagnostic Centre.",
};

const prepGuides = [
  {
    title: "Blood Test Preparation",
    points: [
      "Fast for 8–12 hours before your appointment (water is fine).",
      "Avoid strenuous exercise in the 24 hours before a test.",
      "Take prescribed medications as normal unless your doctor advises otherwise.",
      "Wear loose, short-sleeved clothing for easy sample access.",
      "Inform the phlebotomist of any recent illnesses or medications.",
    ],
  },
  {
    title: "Imaging & Scan Preparation",
    points: [
      "Wear comfortable, loose-fitting clothing with no metal zips or buttons.",
      "For abdominal ultrasounds: fast for 6 hours and drink water to fill your bladder.",
      "For pelvic ultrasounds: attend with a full bladder unless otherwise instructed.",
      "Remove jewellery and piercings before your appointment.",
      "Inform our team if you are or may be pregnant.",
    ],
  },
  {
    title: "General Test Preparation",
    points: [
      "Bring your test request form or booking reference.",
      "Arrive 10 minutes before your scheduled time.",
      "Carry a valid form of identification.",
      "Stay hydrated unless instructed to fast.",
      "Inform our team of any allergies or medical conditions relevant to your test.",
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative w-full bg-bg-primary overflow-hidden pt-[72px]">
        <div className="absolute inset-0 bg-gradient-radial-blue pointer-events-none" />
        <SectionContainer>
          <div className="relative z-10">
            <SectionHeading
              align="center"
              eyebrow="Resources"
              headline="Information to support your health journey"
              gradientWord="Information"
              subheadline="FAQs, test preparation guides and education to help you arrive informed and leave confident."
            />
          </div>
        </SectionContainer>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* Preparation guides */}
      <SectionContainer bg="bg-bg-secondary">
        <SectionHeading
          align="center"
          eyebrow="Preparation Guides"
          headline="How to prepare for your test"
          gradientWord="prepare"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {prepGuides.map((guide) => (
            <div
              key={guide.title}
              className="bg-bg-elevated border border-white/[0.08] rounded-xl p-8 flex flex-col"
            >
              <h3 className="text-heading-md font-semibold text-white mb-6">
                {guide.title}
              </h3>
              <ul className="space-y-3 flex-1">
                {guide.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-accent-cyan mt-0.5 flex-shrink-0 text-sm">
                      ✓
                    </span>
                    <span className="text-body-sm text-text-secondary">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionContainer>

      <BookingCTASection />
    </div>
  );
}
