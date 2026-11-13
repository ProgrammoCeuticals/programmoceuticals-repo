import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceById } from "@/data/services";
import ServicePageTemplate from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Corporate Health | Labville",
  description:
    "Customized health assessments, preventive screening and wellness consultations for organizations at Labville Diagnostic Centre.",
};

export default function CorporatePage() {
  const service = getServiceById("corporate");
  if (!service) notFound();
  return <ServicePageTemplate service={service} />;
}
