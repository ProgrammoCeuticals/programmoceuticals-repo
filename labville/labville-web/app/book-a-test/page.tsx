import type { Metadata } from "next";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import BookingWizard from "@/components/forms/BookingWizard";

export const metadata: Metadata = {
  title: "Book a Test | Labville",
  description:
    "Book a diagnostic test at Labville. Select your service, choose centre visit or home collection, and submit your request.",
};

export default function BookATestPage() {
  return (
    <div className="pt-[72px]">
      <SectionContainer>
        <SectionHeading
          eyebrow="Book a Test"
          headline="Start your diagnostic journey"
          subheadline="Select your service, choose how you'd like to be seen, and we'll take care of the rest."
        />

        <div className="mt-12">
          <BookingWizard />
        </div>
      </SectionContainer>
    </div>
  );
}
