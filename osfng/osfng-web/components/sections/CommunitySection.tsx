"use client";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import { communityActivities } from "@/data/site";
import { MapPin, Calendar } from "lucide-react";

export default function CommunitySection() {
  return (
    <SectionContainer bg="bg-bg-base">
      <SectionHeading
        eyebrow="Community Impact"
        headline="Stories from the field"
        subheadline="Operation Smile Foundation takes its programmes directly into communities — meeting people where they are."
        align="center"
      />

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
        {communityActivities.map((activity, i) => (
          <AnimatedSection key={activity.title} delay={i * 0.1}>
            <div className="card-base p-8 h-full flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-5">
                <Badge variant="green">Community Activity</Badge>
                <span className="text-xs text-text-muted">
                  [Details to confirm]
                </span>
              </div>

              <h3 className="text-heading-md font-bold text-text-primary mb-3">
                {activity.title}
              </h3>
              <p className="text-body-md text-text-secondary flex-1 leading-relaxed">
                {activity.description}
              </p>

              <div className="mt-6 pt-5 border-t border-border-light space-y-2">
                <div className="flex items-center gap-2 text-body-sm text-text-muted">
                  <Calendar size={13} aria-hidden="true" />
                  <span>{activity.date}</span>
                </div>
                <div className="flex items-center gap-2 text-body-sm text-text-muted">
                  <MapPin size={13} aria-hidden="true" />
                  <span>{activity.location}</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection delay={0.2} className="mt-8 text-center">
        <p className="text-body-sm text-text-muted">
          More community stories coming. Contact us at{" "}
          <a
            href="mailto:support@osfng.org"
            className="text-green-mid hover:text-green-deep transition-colors font-semibold"
          >
            support@osfng.org
          </a>{" "}
          to share your story.
        </p>
      </AnimatedSection>
    </SectionContainer>
  );
}
