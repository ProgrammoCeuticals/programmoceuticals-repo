"use client";
import { PiggyBank, HeartPulse, Wheat, Lightbulb } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import { focusAreas } from "@/data/site";

const iconMap: Record<string, React.ElementType> = {
  "piggy-bank": PiggyBank,
  "heart-pulse": HeartPulse,
  wheat: Wheat,
  lightbulb: Lightbulb,
};

export default function FocusAreasSection() {
  return (
    <SectionContainer bg="bg-bg-base">
      <SectionHeading
        eyebrow="Our Focus Areas"
        headline="Four pillars of community impact"
        subheadline="OSF works across financial inclusion, health, agriculture and entrepreneurship to address the root causes of poverty."
        align="center"
      />

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {focusAreas.map((area, i) => {
          const Icon = iconMap[area.icon] ?? Lightbulb;
          return (
            <AnimatedSection key={area.id} delay={i * 0.08}>
              <div className="card-base p-6 lg:p-7 h-full flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-green-deep/8 flex items-center justify-center mb-5 shrink-0">
                  <Icon
                    size={22}
                    className="text-green-mid"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-base font-bold text-text-primary mb-3 leading-snug">
                  {area.title}
                </h3>
                <p className="text-body-sm text-text-secondary flex-1 leading-relaxed">
                  {area.description}
                </p>
                {/* Gold accent bar */}
                <div className="mt-6 w-8 h-[3px] rounded-full bg-gradient-gold" />
              </div>
            </AnimatedSection>
          );
        })}
      </div>
    </SectionContainer>
  );
}
