import type { Metadata } from "next";
import AboutHeroSection from "@/components/sections/AboutHeroSection";
import MissionValuesSection from "@/components/sections/MissionValuesSection";
import DiagnosticProcessSection from "@/components/sections/DiagnosticProcessSection";
import TrustBenefitsSection from "@/components/sections/TrustBenefitsSection";
import FinalCTASection from "@/components/sections/FinalCTASection";

export const metadata: Metadata = {
  title: "About Labville | Diagnostic Centre, Ikorodu Lagos",
  description:
    "Learn about Labville Diagnostic Centre — our mission, values and commitment to precision diagnostics, patient care and health accessibility.",
};

export default function AboutPage() {
  return (
    <div>
      <AboutHeroSection />
      <MissionValuesSection />
      <DiagnosticProcessSection />
      <TrustBenefitsSection />
      <FinalCTASection />
    </div>
  );
}
