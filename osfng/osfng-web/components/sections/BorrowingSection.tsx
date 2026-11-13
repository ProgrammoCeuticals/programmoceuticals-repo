"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { borrowingMessage } from "@/data/site";

const principles = [
  "Use a loan for a clear, productive purpose",
  "Plan your repayment before you borrow",
  "Build savings as your business grows",
  "Borrow to invest in your capacity or assets",
  "Repay on time — protect your financial future",
];

export default function BorrowingSection() {
  return (
    <SectionContainer bg="bg-bg-alt">
      <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
        {/* Left */}
        <AnimatedSection>
          <SectionHeading
            eyebrow="Financial Literacy"
            headline={borrowingMessage.headline}
            theme="light"
          />
          <p className="text-body-md text-text-secondary mt-6 leading-relaxed">
            {borrowingMessage.body}
          </p>
          <div className="mt-8 space-y-3">
            {principles.map((p, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle
                  size={16}
                  className="text-green-mid mt-1 shrink-0"
                  aria-hidden="true"
                />
                <span className="text-body-sm text-text-secondary">{p}</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/apply-for-a-loan">
              <Button variant="primary" size="lg">
                Apply for a Loan
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </AnimatedSection>

        {/* Right — decorative card */}
        <AnimatedSection delay={0.15} className="mt-12 lg:mt-0">
          <div className="relative">
            <div className="bg-bg-dark rounded-2xl p-6 md:p-10 relative overflow-hidden">
              <div className="absolute inset-0 leaf-pattern" />
              <div className="relative z-10 space-y-6">
                {[
                  {
                    step: "01",
                    title: "Identify your need",
                    desc: "What specific business or family need will this loan address?",
                  },
                  {
                    step: "02",
                    title: "Plan your repayment",
                    desc: "Map out how you will repay from your income or business revenue.",
                  },
                  {
                    step: "03",
                    title: "Apply with confidence",
                    desc: "Speak with an OSF field officer or apply through our centre.",
                  },
                  {
                    step: "04",
                    title: "Grow and save",
                    desc: "As your income grows, build savings alongside your loan repayment.",
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
                      <p className="text-xs text-text-light-muted mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </SectionContainer>
  );
}
