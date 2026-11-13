import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceById } from "@/data/services";
import ServicePageTemplate from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Health Screening | Labville",
  description:
    "Tailored health screening packages for early detection, monitoring and proactive health management at Labville Diagnostic Centre.",
};

export default function ScreeningPage() {
  const service = getServiceById("screening");
  if (!service) notFound();
  return <ServicePageTemplate service={service} />;
}
