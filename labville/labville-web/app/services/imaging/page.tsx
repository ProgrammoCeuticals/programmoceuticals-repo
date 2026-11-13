import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceById } from "@/data/services";
import ServicePageTemplate from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Medical Imaging | Labville",
  description:
    "State-of-the-art X-rays, ultrasounds and CT scans delivered with precision at Labville Diagnostic Centre, Ikorodu, Lagos.",
};

export default function ImagingPage() {
  const service = getServiceById("imaging");
  if (!service) notFound();
  return <ServicePageTemplate service={service} />;
}
