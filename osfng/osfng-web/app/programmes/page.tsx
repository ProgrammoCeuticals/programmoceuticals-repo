import type { Metadata } from "next";
import Link from "next/link";
import {
  PiggyBank,
  HeartPulse,
  Wheat,
  Lightbulb,
  Users,
  GraduationCap,
} from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Our Programmes",
  description:
    "OSF development programmes covering financial inclusion, health, agriculture, entrepreneurship, women empowerment and youth development across Nigeria.",
};

const programmes = [
  {
    icon: PiggyBank,
    title: "Financial Inclusion",
    category: "Financial",
    description:
      "Providing savings accounts, loans and financial literacy education to help individuals and small businesses access the financial tools they need.",
    highlights: [
      "Happy Child Savings Plan",
      "Business loans",
      "Financial literacy sessions",
    ],
    status: "Active",
    href: "/savings",
  },
  {
    icon: GraduationCap,
    title: "Education Planning",
    category: "Education",
    description:
      "Helping families plan and save for education costs — school fees, books, uniforms — through consistent savings and financial guidance.",
    highlights: [
      "Happy Child Savings Plan",
      "School outreach sessions",
      "Community financial literacy",
    ],
    status: "Active",
    href: "/savings",
  },
  {
    icon: Users,
    title: "Women's Economic Empowerment",
    category: "Women",
    description:
      "Targeted programmes to help women access financial services, develop business skills and build economic independence.",
    highlights: [
      "Savings tailored for women",
      "Business skills support",
      "Community networks",
    ],
    status: "Confirm with OSFNG",
    href: "/contact",
  },
  {
    icon: Lightbulb,
    title: "Entrepreneurship & Mentoring",
    category: "Enterprise",
    description:
      "Supporting youth and adults in developing business ideas, accessing working capital and building sustainable enterprises.",
    highlights: [
      "Business loans",
      "Mentoring support",
      "Entrepreneurship guidance",
    ],
    status: "Confirm with OSFNG",
    href: "/loans",
  },
  {
    icon: HeartPulse,
    title: "Health Initiatives",
    category: "Health",
    description:
      "Community health programmes supporting access to basic health information and services across Imo State communities.",
    highlights: ["Community health outreach", "Health awareness campaigns"],
    status: "Confirm with OSFNG",
    href: "/contact",
  },
  {
    icon: Wheat,
    title: "Agriculture Support",
    category: "Agriculture",
    description:
      "Supporting rural farmers and agricultural communities through financial access and capacity-building programmes.",
    highlights: ["Agricultural loans", "Farmer support programmes"],
    status: "Confirm with OSFNG",
    href: "/contact",
  },
];

export default function ProgrammesPage() {
  return (
    <div className="pt-[70px]">
      {/* Hero */}
      <SectionContainer bg="bg-bg-dark relative overflow-hidden">
        <div className="absolute inset-0 leaf-pattern pointer-events-none" />
        <div className="relative z-10">
          <SectionHeading
            eyebrow="Our Programmes"
            headline="Comprehensive programmes for community development"
            subheadline="Operation Smile Foundation works across financial inclusion, education, health, agriculture and entrepreneurship to address poverty at its root."
            theme="dark"
          />
        </div>
      </SectionContainer>

      {/* Programmes grid */}
      <SectionContainer bg="bg-bg-base">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programmes.map((prog, i) => {
            const Icon = prog.icon;
            return (
              <AnimatedSection key={prog.title} delay={i * 0.07}>
                <div className="card-base p-8 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
                    <div className="w-11 h-11 rounded-xl bg-green-deep/8 flex items-center justify-center shrink-0">
                      <Icon
                        size={20}
                        className="text-green-mid"
                        aria-hidden="true"
                      />
                    </div>
                    <Badge
                      variant={prog.status === "Active" ? "green" : "gold"}
                    >
                      {prog.status}
                    </Badge>
                  </div>

                  <h3 className="text-heading-md font-bold text-text-primary mb-3">
                    {prog.title}
                  </h3>
                  <p className="text-body-sm text-text-secondary mb-5 flex-1">
                    {prog.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {prog.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-center gap-2 text-body-sm text-text-muted"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={prog.href}
                    className="text-sm font-semibold text-green-mid hover:text-green-deep transition-colors"
                  >
                    Learn more →
                  </Link>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </SectionContainer>

      {/* Note */}
      <SectionContainer bg="bg-bg-alt" py={false} className="py-12">
        <AnimatedSection>
          <div className="max-w-2xl mx-auto text-center p-8 bg-bg-card rounded-2xl border border-border-light">
            <p className="text-body-sm text-text-muted">
              Programme details marked &ldquo;Confirm with OSFNG&rdquo; are
              based on public profile information and require verification
              before publication. This page will be updated with confirmed
              current programme details.
            </p>
            <div className="mt-5">
              <Link href="/contact">
                <Button variant="primary" size="md">
                  Ask Us About Our Programmes
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </SectionContainer>

      <CTASection />
    </div>
  );
}
