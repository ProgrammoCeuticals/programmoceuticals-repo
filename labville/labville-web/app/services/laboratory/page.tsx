import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceById } from "@/data/services";
import ServicePageTemplate from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Laboratory Diagnostics | Labville",
  description:
    "Comprehensive blood tests, urine analysis and specialized laboratory testing at Labville Diagnostic Centre, Ikorodu, Lagos.",
};

export default function LaboratoryPage() {
  const service = getServiceById("laboratory");
  if (!service) notFound();
  return <ServicePageTemplate service={service} />;
}
