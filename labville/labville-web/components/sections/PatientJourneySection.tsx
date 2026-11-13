"use client";

import {
  Phone,
  Calendar,
  ClipboardList,
  MapPin,
  FlaskConical,
  FileText,
  ArrowRightCircle,
} from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { patientJourney } from "@/data/content";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  phone:                Phone,
  calendar:             Calendar,
  clipboard:            ClipboardList,
  "map-pin":            MapPin,
  flask:                FlaskConical,
  "file-text":          FileText,
  "arrow-right-circle": ArrowRightCircle,
};

export default function PatientJourneySection() {
  return (
    <SectionContainer bg="bg-bg-primary relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(10,191,188,0.06) 0%, transparent 60%)" }}
      />

      <div className="relative z-10">
        <SectionHeading
          align="center"
          eyebrow="Patient Journey"
          headline="Simple steps to your diagnostic results."
          gradientWord="diagnostic results."
        />

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {patientJourney.map((item, i) => {
            const Icon = iconMap[item.icon] ?? Calendar;
            return (
              <AnimatedSection key={item.step} delay={i * 0.08}>
                <div className="relative bg-bg-elevated border border-white/8 rounded-xl p-7 h-full hover:border-accent-blue/25 transition-colors duration-300 group">
                  {/* Step number */}
                  <span className="absolute top-5 right-6 text-[11px] font-bold text-text-muted tracking-widest">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl bg-accent-blue/12 flex items-center justify-center mb-5 group-hover:bg-accent-blue/20 transition-colors duration-300">
                    <Icon size={20} className="text-accent-cyan" />
                  </div>

                  <h3 className="text-base font-semibold text-white mb-2">{item.step}</h3>
                  <p className="text-body-md text-text-secondary leading-relaxed">{item.description}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </SectionContainer>
  );
}
