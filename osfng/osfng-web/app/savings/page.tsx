import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  PiggyBank,
  Target,
  TrendingUp,
  ShoppingBag,
  Baby,
} from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Savings & Investment",
  description:
    "OSFNG Savings and Investment plans — Target Savings, Daily Savings, Trader Savings and Happy Child Savings Account. Open an account from as little as ₦500.",
};

// Source: osfng.org/Savings.html — verified 10 October 2026
const savingsPlans = [
  {
    id: "target",
    icon: Target,
    name: "Target Savings Plan",
    description:
      "Designed for individuals who want to save towards a specific goal — house rent, wedding, vacation or a rainy-day fund. This plan also qualifies you for a loan to boost your business at a reduced interest rate.",
    highlights: [
      "Save towards any personal goal",
      "House rent, wedding, vacation or emergency fund",
      "Qualifies you for a business loan at reduced interest",
    ],
    badge: "Goal-Based Savings",
  },
  {
    id: "daily",
    icon: TrendingUp,
    name: "Daily Savings Plan",
    description:
      "For individuals with a monthly target who wish to save a compulsory minimum amount daily to reach their goal. Our dedicated officers visit each member to collect the daily savings amount — you do not need to leave your business.",
    highlights: [
      "Save daily towards your monthly target",
      "Our officers come to collect from you",
      "Build consistent savings habits",
    ],
    badge: "Daily Collection",
  },
  {
    id: "trader",
    icon: ShoppingBag,
    name: "Trader Savings Plan",
    description:
      "Specifically for traders who plan to borrow at a future date. Members must save up to 10% of the loan amount requested. This plan comes with a competitive interest rate, making it an ideal stepping stone to accessing financing.",
    highlights: [
      "Designed for traders planning to borrow",
      "Save at least 10% of your planned loan amount",
      "Competitive interest rate",
    ],
    badge: "For Traders",
  },
  {
    id: "happy-child",
    icon: Baby,
    name: "Happy Child Savings Account",
    description:
      "The future of your child is important. OSF members can now save towards the welfare of their children and dependants. Secure a child's future until adulthood with an opening balance of as little as ₦500.",
    highlights: [
      "Opening balance from as little as ₦500",
      "Save for a child's welfare and future",
      "Available to all OSF members",
    ],
    badge: "For Families",
    featured: true,
    openingBalance: "₦500",
  },
];

export default function SavingsPage() {
  return (
    <div className="pt-[70px]">
      {/* Hero */}
      <SectionContainer bg="bg-bg-dark relative overflow-hidden">
        <div className="absolute inset-0 leaf-pattern pointer-events-none" />
        <div className="relative z-10">
          <SectionHeading
            eyebrow="Savings & Investment"
            headline="OSFNG Savings and Investment"
            subheadline="Four savings plans designed to match your goals — from daily discipline to securing your child's future. Every member of Operation Smile Foundation has a plan that fits."
            theme="dark"
          />
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/become-a-member">
              <Button variant="gold" size="lg">
                Open a Savings Account
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="light" size="lg">
                Speak to a Field Officer
              </Button>
            </Link>
          </div>
        </div>
      </SectionContainer>

      {/* The 4 savings plans */}
      <SectionContainer bg="bg-bg-base">
        <SectionHeading
          eyebrow="Our Savings Plans"
          headline="Find a savings account that is right for you"
          subheadline="All plans are available to OSF members. Speak to a field officer to open your account today."
          align="center"
        />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          {savingsPlans.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <AnimatedSection key={plan.id} delay={i * 0.08}>
                <div
                  className={`card-base p-8 h-full flex flex-col relative overflow-hidden ${plan.featured ? "ring-2 ring-gold/30" : ""}`}
                >
                  {/* Icon + badges row */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-green-deep/8 flex items-center justify-center shrink-0">
                      <Icon
                        size={22}
                        className="text-green-mid"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="green">{plan.badge}</Badge>
                        {plan.featured && (
                          <Badge variant="gold">Featured</Badge>
                        )}
                      </div>
                      <h3 className="text-heading-md font-bold text-text-primary">
                        {plan.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-body-md text-text-secondary leading-relaxed mb-6 flex-1">
                    {plan.description}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-2 mb-6">
                    {plan.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2.5 text-body-sm text-text-secondary"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  {/* Opening balance callout for Happy Child */}
                  {plan.openingBalance && (
                    <div className="p-4 bg-gold-pale rounded-xl border border-gold/20 mb-5">
                      <p className="text-body-sm font-bold text-text-primary">
                        Opening balance from as little as{" "}
                        <span className="text-gold text-heading-md">
                          {plan.openingBalance}
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Gold accent bar */}
                  <div className="w-8 h-[3px] rounded-full bg-gradient-gold mt-auto" />
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Source note */}
        <AnimatedSection delay={0.3} className="mt-10">
          <p className="text-body-sm text-text-muted text-center">
            Savings plan details sourced from{" "}
            <a
              href="https://osfng.org/Savings.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-mid hover:text-green-deep underline underline-offset-2"
            >
              osfng.org/Savings.html
            </a>
            . Contact OSF for full account terms and conditions.
          </p>
        </AnimatedSection>
      </SectionContainer>

      {/* How to open an account */}
      <SectionContainer bg="bg-bg-alt">
        <div className="lg:grid lg:grid-cols-2 lg:gap-14 items-center">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Get Started"
              headline="How to open your savings account"
            />
            <div className="mt-8 space-y-5">
              {[
                {
                  step: "01",
                  title: "Become a Member",
                  desc: "Register as an OSF member to access all savings plans and loan products.",
                },
                {
                  step: "02",
                  title: "Choose Your Plan",
                  desc: "Select the savings plan that matches your goal — daily, target, trader or Happy Child.",
                },
                {
                  step: "03",
                  title: "Meet a Field Officer",
                  desc: "Our dedicated officers will visit you at your location to set up your account.",
                },
                {
                  step: "04",
                  title: "Start Saving",
                  desc: "Begin saving consistently. Daily collection officers will come to you if you choose the daily plan.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <span className="w-9 h-9 rounded-full bg-green-deep/10 text-green-mid text-xs font-black flex items-center justify-center shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-text-primary">
                      {item.title}
                    </p>
                    <p className="text-body-sm text-text-secondary mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/become-a-member">
                <Button variant="primary" size="lg">
                  Become a Member First
                  <ArrowRight size={16} aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          {/* Why save with OSF card */}
          <AnimatedSection delay={0.15} className="mt-12 lg:mt-0">
            <div className="bg-bg-dark rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 leaf-pattern pointer-events-none" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center mb-5">
                  <PiggyBank
                    size={20}
                    className="text-gold"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-heading-md font-bold text-white mb-6">
                  Why save with OSF?
                </h3>
                <div className="space-y-4">
                  {[
                    "Field officers come to your location — no need to leave your business",
                    "Plans designed for everyday Nigerians — from ₦500 opening balance",
                    "Savings can qualify you for loans at reduced interest rates",
                    "Four plans to match your goals: daily, target, trader or family",
                    "Part of a trusted community development organisation since 2020",
                  ].map((point, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                      <p className="text-body-sm text-text-light-muted leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </SectionContainer>

      <CTASection />
    </div>
  );
}
