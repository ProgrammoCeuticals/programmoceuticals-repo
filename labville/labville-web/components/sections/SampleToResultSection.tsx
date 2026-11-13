"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { processSteps } from "@/data/content";

export default function SampleToResultSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.3"],
  });

  // Progress line grows as user scrolls through the section
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <SectionContainer bg="bg-bg-secondary relative overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10">
        <SectionHeading
          align="center"
          eyebrow="Sample to Result"
          headline="Every result has a journey."
          gradientWord="journey."
          subheadline="A structured, quality-controlled pathway from collection to clinical insight."
        />

        <div ref={containerRef} className="mt-16 max-w-3xl mx-auto relative">
          {/* Vertical progress line */}
          <div className="absolute left-[19px] md:left-[23px] top-0 bottom-0 w-px bg-white/8">
            <motion.div
              className="absolute top-0 left-0 w-full origin-top"
              style={{
                height: lineHeight,
                background: "linear-gradient(180deg, #1E6FD9 0%, #0ABFBC 100%)",
              }}
            />
          </div>

          <div className="space-y-0">
            {processSteps.map((step, i) => (
              <AnimatedSection key={step.number} delay={i * 0.06}>
                <div className="flex gap-6 md:gap-8 pb-10 last:pb-0">
                  {/* Step number bubble */}
                  <div className="relative flex-shrink-0 z-10">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-bg-secondary border border-white/12 flex items-center justify-center">
                      <span className="text-[11px] font-bold text-accent-cyan tracking-wider">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-2 pb-2">
                    <h3 className="text-base font-semibold text-white mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-body-md text-text-secondary leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-text-muted mt-12 max-w-md mx-auto">
          Exact internal procedures are subject to confirmation by Labville. This represents the general diagnostic workflow.
        </p>
      </div>
    </SectionContainer>
  );
}
