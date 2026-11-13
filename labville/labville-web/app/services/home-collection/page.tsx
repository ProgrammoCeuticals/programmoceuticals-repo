import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceById } from "@/data/services";
import ServicePageTemplate from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Home Collection | Labville",
  description:
    "Trained Labville professionals visit your location to collect samples — bringing diagnostic accuracy and convenience together.",
};

export default function HomeCollectionPage() {
  const service = getServiceById("home-collection");
  if (!service) notFound();
  return <ServicePageTemplate service={service} />;
}
