"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How do I prepare for a blood test?",
    answer:
      "Preparation depends on the specific test requested. Many blood tests require fasting for 8–12 hours beforehand. Your request form or our team will provide specific instructions when you book. Drink water as normal unless otherwise advised.",
  },
  {
    question: "How long do results take?",
    answer:
      "Most routine blood tests are available within 24–48 hours. Imaging results are usually available the same day or within 24 hours. Specialized or send-away tests may take longer. We will inform you of the expected turnaround when you book.",
  },
  {
    question: "Do you offer home collection?",
    answer:
      "Yes. Labville offers a home collection service for patients who cannot attend our centre or prefer the convenience of testing at home or their workplace. A trained professional will visit you to collect your sample.",
  },
  {
    question: "What forms of payment do you accept?",
    answer:
      "We accept cash, bank transfers and major debit/credit cards. Payment is typically required at the time of service. Please contact us for information on HMO or corporate billing arrangements.",
  },
  {
    question: "How do I get my results?",
    answer:
      "Results can be collected in person at our centre, sent by email or, where appropriate, sent directly to your referring clinician. Let us know your preference when booking.",
  },
  {
    question: "Can I book online?",
    answer:
      "Yes. You can use our Book a Test page to submit a booking request online. Our team will confirm your appointment by phone or email.",
  },
  {
    question: "Do I need a referral?",
    answer:
      "Most of our services do not require a doctor's referral. You can self-refer for routine tests, health screening and home collection. A referral may be required for certain specialized tests — our team will advise you.",
  },
  {
    question: "What is the difference between your screening packages?",
    answer:
      "Our screening packages vary by scope and target population. A basic health assessment covers key health markers. Early detection packages focus on identifying hidden risk factors. Health maintenance packages are designed for ongoing monitoring of known conditions or elevated risk profiles. Our team can recommend the most appropriate package for your needs.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SectionContainer bg="bg-bg-primary">
      <SectionHeading
        align="center"
        eyebrow="Frequently Asked Questions"
        headline="Answers to common questions"
        gradientWord="Answers"
      />

      <div className="mt-12 max-w-3xl mx-auto">
        {faqs.map((faq, i) => {
          const panelId = `faq-panel-${i}`;
          const isOpen = openIndex === i;
          return (
            <div key={i} className="border-b border-white/[0.08]">
              <button
                type="button"
                id={`faq-btn-${i}`}
                className="w-full flex items-center justify-between py-5 text-left text-white hover:text-accent-cyan transition-colors gap-4"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="text-body-md font-medium">{faq.question}</span>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className={cn(
                    "flex-shrink-0 transition-transform duration-300 text-text-muted",
                    isOpen && "rotate-180 text-accent-cyan",
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    key="answer"
                    role="region"
                    aria-labelledby={`faq-btn-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-body-md text-text-secondary pb-5 pr-8">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </SectionContainer>
  );
}
