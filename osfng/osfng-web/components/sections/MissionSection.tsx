"use client";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import { brand, edQuote } from "@/data/site";

export default function MissionSection() {
  return (
    <SectionContainer bg="bg-bg-alt">
      <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
        {/* Left */}
        <AnimatedSection>
          <SectionHeading
            eyebrow="Who We Are"
            headline="A foundation built on purpose"
            theme="light"
          />
          <div className="mt-6 space-y-4">
            <p className="text-body-md text-text-secondary leading-relaxed">
              {brand.mission}
            </p>
            <p className="text-body-md text-text-secondary leading-relaxed">
              Founded in <strong className="text-text-primary">2020</strong> and
              headquartered in{" "}
              <strong className="text-text-primary">Owerri, Imo State</strong>,
              OSF bridges the gap between underserved communities and the
              financial tools they need to thrive.
            </p>
          </div>
        </AnimatedSection>

        {/* Right — ED quote card */}
        <AnimatedSection delay={0.15} className="mt-12 lg:mt-0">
          <div className="bg-bg-dark rounded-2xl p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-radial-gold opacity-50 pointer-events-none" />
            <span className="text-6xl text-gold/30 font-serif leading-none select-none block mb-4">
              &ldquo;
            </span>
            <blockquote className="text-section-lg font-bold text-white leading-snug relative z-10">
              {edQuote.text}
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-8 h-[2px] bg-gradient-gold rounded-full" />
              <p className="text-sm text-gold font-semibold">
                {edQuote.author}
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </SectionContainer>
  );
}
