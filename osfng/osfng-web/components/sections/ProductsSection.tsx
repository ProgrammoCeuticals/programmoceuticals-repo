"use client";
import Link from "next/link";
import { ArrowRight, PiggyBank, GraduationCap, Heart } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

// All product details sourced from live osfng.org pages (verified 10 October 2026)
const productCards = [
  {
    id: "savings",
    icon: PiggyBank,
    badge: "Savings & Investment",
    name: "Savings & Investment",
    tagline: "Four plans. One goal — your financial future.",
    description:
      "Choose from four savings plans designed for every Nigerian: Target Savings, Daily Savings, Trader Savings and the Happy Child Savings Account — open from as little as ₦500.",
    highlights: [
      "Target Savings Plan — save towards any goal",
      "Daily Savings Plan — officers collect from you",
      "Trader Savings Plan — designed for traders",
      "Happy Child Savings — from ₦500 opening balance",
    ],
    href: "/savings",
    ctaText: "View All Savings Plans",
  },
  {
    id: "loans",
    icon: GraduationCap,
    badge: "Education Finance",
    name: "Education Loan",
    tagline: "₦20,000 – ₦200,000 · 2.5% flat · Monthly repayment",
    description:
      "Help your children succeed in school without disrupting your business. The OSF Education Loan covers tuition fees, uniforms, books and school bus fees for Nigerian primary and secondary schools.",
    highlights: [
      "Loan range: ₦20,000 – ₦200,000",
      "Interest: 2.5% flat",
      "1-month moratorium after disbursement",
      "Available all year round to OSF members",
    ],
    href: "/loans",
    ctaText: "Explore the Education Loan",
  },
  {
    id: "csr",
    icon: Heart,
    badge: "Community",
    name: "CSR",
    tagline: "Giving back to the communities we serve.",
    description:
      "Beyond financial services, OSF invests in community welfare through outreach, financial literacy programmes and education events across Imo State.",
    highlights: [
      "Financial literacy outreach in schools",
      "Community empowerment events",
      "International Day of the Girl Child",
      "Field presence in Nwaorieubi & Mgbirichi",
    ],
    href: "/csr",
    ctaText: "Learn More",
  },
];

export default function ProductsSection() {
  return (
    <SectionContainer bg="bg-bg-dark" className="relative overflow-hidden">
      <div className="absolute inset-0 leaf-pattern pointer-events-none" />

      <div className="relative z-10">
        <SectionHeading
          eyebrow="Our Products"
          headline="Financial tools built for your community"
          subheadline="Savings plans, education loans and community programmes — all designed for individuals, families and small businesses across Nigeria."
          align="center"
          theme="dark"
        />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {productCards.map((product, i) => {
            const Icon = product.icon;
            return (
              <AnimatedSection key={product.id} delay={i * 0.1}>
                <div className="bg-bg-dark-card border border-border-dark rounded-2xl p-8 h-full flex flex-col hover:border-gold/30 transition-colors duration-300 group">
                  {/* Icon + badge */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center">
                      <Icon
                        size={22}
                        className="text-gold"
                        aria-hidden="true"
                      />
                    </div>
                    <Badge variant="outline-gold">{product.badge}</Badge>
                  </div>

                  <h3 className="text-heading-md font-bold text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm font-semibold text-gold mb-4 leading-snug">
                    {product.tagline}
                  </p>
                  <p className="text-body-sm text-text-light-muted mb-5 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-2 mb-6 flex-1">
                    {product.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2.5 text-body-sm text-text-light-muted"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={product.href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-light transition-colors mt-auto"
                  >
                    {product.ctaText}
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Bottom CTAs */}
        <AnimatedSection
          delay={0.3}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/apply-for-a-loan">
            <Button variant="gold" size="lg">
              Apply for a Loan
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/savings">
            <Button variant="light" size="lg">
              Open a Savings Account
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </SectionContainer>
  );
}
