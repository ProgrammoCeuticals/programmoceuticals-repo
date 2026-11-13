import type { Metadata } from "next";
import HeroSection from "@/components/hero/HeroSection";
import HealthConcernsSection from "@/components/sections/HealthConcernsSection";
import DiagnosticEcosystemSection from "@/components/sections/DiagnosticEcosystemSection";
import ServiceExplorerSection from "@/components/sections/ServiceExplorerSection";
import SampleToResultSection from "@/components/sections/SampleToResultSection";
import JourneySection from "@/components/sections/JourneySection";
import PatientJourneySection from "@/components/sections/PatientJourneySection";
import TrustBenefitsSection from "@/components/sections/TrustBenefitsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FinalCTASection from "@/components/sections/FinalCTASection";

export const metadata: Metadata = {
  title: "Labville Diagnostic Centre | Where Science Becomes Clinical Insight",
  description:
    "Advanced laboratory diagnostics, medical imaging, health screening and specialized testing in Ikorodu, Lagos. Precision in every test, confidence in every result.",
};

export default function HomePage() {
  return (
    <div className="pt-[72px]">
      {/* 1. Hero */}
      <HeroSection />
      {/* 2. Labville positioning — health concerns we address */}
      <HealthConcernsSection />
      {/* 3. Diagnostic ecosystem — living node pipeline */}
      <DiagnosticEcosystemSection />
      {/* 4. Interactive service explorer — all 6 services */}
      <ServiceExplorerSection />
      {/* 5. From sample to result — 7-stage cinematic timeline */}
      <SampleToResultSection />
      {/* 6. Laboratory science + about narrative */}
      <JourneySection />
      {/* 7. Patient journey — 6 steps */}
      <PatientJourneySection />
      {/* 8. Quality & trust pillars */}
      <TrustBenefitsSection />
      {/* 9. Social proof */}
      <TestimonialsSection />
      {/* 10. Final CTA */}
      <FinalCTASection />
    </div>
  );
}
