import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceById } from "@/data/services";
import ServicePageTemplate from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Specialized Diagnostics | Labville",
  description:
    "Cardiovascular, hormonal and genetic testing for patients with specific clinical needs at Labville Diagnostic Centre.",
};

export default function SpecializedPage() {
  const service = getServiceById("specialized");
  if (!service) notFound();
  return <ServicePageTemplate service={service} />;
}
