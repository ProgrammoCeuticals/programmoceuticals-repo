import type { Metadata } from "next";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesGrid from "@/components/services/ServicesGrid";
import FinalCTASection from "@/components/sections/FinalCTASection";

export const metadata: Metadata = {
  title: "Diagnostic Services | Labville",
  description:
    "Explore Labville's full range of diagnostic services — laboratory testing, medical imaging, health screening, specialized diagnostics, corporate health and home collection.",
};

export default function ServicesPage() {
  return (
    <div>
      <ServicesHero />
      <ServicesGrid />
      <FinalCTASection />
    </div>
  );
}
