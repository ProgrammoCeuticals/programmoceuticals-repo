import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GraduationCap, CheckCircle, Info } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Loans",
  description:
    "OSFNG Education Loan — ₦20,000 to ₦200,000, 2.5% flat interest, monthly repayment, 1-month grace period. For parents and guardians funding Nigerian school fees.",
};

// Source: osfng.org/Loans.html — verified 10 October 2026
const educationLoan = {
  name: "Education Loan",
  description:
    "Aimed at providing cash to parents and guardians who want to educate their children in well-established Nigerian primary and secondary schools — supporting school fees, levies, uniforms, books and bus fees, while protecting their business cash flow.",
  range: "₦20,000 – ₦200,000",
  gracePeriod: "1 Month moratorium (approx. 30 days after disbursement)",
  interest: "2.5% flat",
  repayment: "Monthly",
  availability: "Available all year round",
  purpose: [
    "Tuition fees",
    "School uniforms",
    "Books",
    "School bus / transportation",
  ],
  eligibility: "Accessible to any OSF member",
};

const borrowingPrinciples = [
  "Use the loan for its stated purpose — your child's education costs",
  "Plan your monthly repayments before you apply",
  "Protect your business cash flow — the loan is designed to do exactly this",
  "Repay on time to maintain your credit standing with OSF",
  "Build savings alongside your repayment to prepare for next year",
];

export default function LoansPage() {
  return (
    <div className="pt-[70px]">
      {/* Hero */}
      <SectionContainer bg="bg-bg-dark relative overflow-hidden">
        <div className="absolute inset-0 leaf-pattern pointer-events-none" />
        <div className="relative z-10">
          <SectionHeading
            eyebrow="Loans"
            headline="Borrow with purpose. Repay with discipline."
            subheadline="OSF provides affordable education finance to help parents and guardians fund their children's schooling — without disrupting their business cash flow."
            theme="dark"
          />
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/apply-for-a-loan">
              <Button variant="gold" size="lg">
                Apply for a Loan
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

      {/* Education Loan — verified product card */}
      <SectionContainer bg="bg-bg-base">
        <SectionHeading
          eyebrow="Our Loan Product"
          headline="Education Loan"
          subheadline="Currently available to all OSF members. Apply at our Owerri office or through a field officer."
        />

        <div className="mt-12 lg:grid lg:grid-cols-2 lg:gap-12 items-start">
          {/* Left — description + purpose */}
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-green-deep/8 flex items-center justify-center">
                <GraduationCap
                  size={22}
                  className="text-green-mid"
                  aria-hidden="true"
                />
              </div>
              <Badge variant="green">Education Finance</Badge>
            </div>

            <p className="text-body-md text-text-secondary leading-relaxed mb-6">
              {educationLoan.description}
            </p>

            <div className="mb-6">
              <p className="text-sm font-bold text-text-primary mb-3">
                Loan covers:
              </p>
              <ul className="space-y-2">
                {educationLoan.purpose.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-body-sm text-text-secondary"
                  >
                    <CheckCircle
                      size={15}
                      className="text-green-mid shrink-0"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-bg-alt rounded-xl border border-border-light flex items-start gap-3">
              <Info
                size={15}
                className="text-green-mid mt-0.5 shrink-0"
                aria-hidden="true"
              />
              <p className="text-body-sm text-text-secondary">
                <strong className="text-text-primary">Eligibility:</strong>{" "}
                {educationLoan.eligibility}. You must be a registered OSF member
                to apply.{" "}
                <Link
                  href="/become-a-member"
                  className="text-green-mid hover:text-green-deep underline underline-offset-2 font-semibold"
                >
                  Become a member first →
                </Link>
              </p>
            </div>
          </AnimatedSection>

          {/* Right — verified terms table */}
          <AnimatedSection delay={0.15} className="mt-10 lg:mt-0">
            <div className="bg-bg-dark rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 bg-green-deep/80 border-b border-border-dark">
                <p className="text-xs font-bold uppercase tracking-widest text-gold">
                  Verified Loan Terms
                </p>
                <p className="text-xs text-text-light-muted mt-0.5">
                  Source: osfng.org/Loans.html
                </p>
              </div>

              {/* Terms rows */}
              <div className="divide-y divide-white/8">
                {[
                  {
                    label: "Loan Range",
                    value: educationLoan.range,
                    highlight: true,
                  },
                  {
                    label: "Interest Rate",
                    value: educationLoan.interest,
                    highlight: true,
                  },
                  {
                    label: "Repayment",
                    value: educationLoan.repayment,
                    highlight: false,
                  },
                  {
                    label: "Grace Period",
                    value: educationLoan.gracePeriod,
                    highlight: false,
                  },
                  {
                    label: "Availability",
                    value: educationLoan.availability,
                    highlight: false,
                  },
                  {
                    label: "Eligibility",
                    value: educationLoan.eligibility,
                    highlight: false,
                  },
                ].map(({ label, value, highlight }) => (
                  <div
                    key={label}
                    className="flex flex-col sm:flex-row sm:items-start sm:justify-between px-6 py-4 gap-1 sm:gap-4"
                  >
                    <span className="text-body-sm text-text-light-muted sm:shrink-0 sm:w-32">
                      {label}
                    </span>
                    <span
                      className={`text-body-sm font-semibold sm:text-right ${highlight ? "text-gold" : "text-white"}`}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Apply CTA inside card */}
              <div className="px-6 py-5 bg-bg-dark-alt">
                <Link href="/apply-for-a-loan" className="block">
                  <Button variant="gold" size="md" fullWidth>
                    Apply for This Loan
                    <ArrowRight size={15} aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </SectionContainer>

      {/* Responsible borrowing */}
      <SectionContainer bg="bg-bg-alt">
        <div className="lg:grid lg:grid-cols-2 lg:gap-14 items-center">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Financial Literacy"
              headline="Borrow with purpose. Repay with discipline."
            />
            <p className="text-body-md text-text-secondary mt-5 leading-relaxed">
              A loan is a tool for progress — not a burden. OSF encourages every
              member to approach borrowing with a clear plan and honest
              assessment of their repayment ability.
            </p>
            <ul className="mt-6 space-y-3">
              {borrowingPrinciples.map((p, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle
                    size={16}
                    className="text-green-mid mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-body-sm text-text-secondary leading-relaxed">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
          </AnimatedSection>

          {/* How to apply */}
          <AnimatedSection delay={0.15} className="mt-12 lg:mt-0">
            <div className="bg-bg-dark rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 leaf-pattern pointer-events-none" />
              <div className="relative z-10 space-y-5">
                <h3 className="text-heading-md font-bold text-white">
                  How to apply
                </h3>
                {[
                  {
                    step: "01",
                    title: "Become an OSF Member",
                    desc: "You must be a registered member to access any loan product.",
                  },
                  {
                    step: "02",
                    title: "Speak to a Field Officer",
                    desc: "Contact us or visit our Owerri office. A field officer will guide you through eligibility.",
                  },
                  {
                    step: "03",
                    title: "Submit Your Application",
                    desc: "Provide required documents. Our team will review your application promptly.",
                  },
                  {
                    step: "04",
                    title: "Receive Disbursement",
                    desc: "Approved loans are disbursed. A 1-month moratorium gives you time before first repayment.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {item.title}
                      </p>
                      <p className="text-xs text-text-light-muted mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Link href="/apply-for-a-loan">
                    <Button variant="gold" size="md" fullWidth>
                      Start Your Application
                      <ArrowRight size={15} aria-hidden="true" />
                    </Button>
                  </Link>
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
