"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import { brand, contact } from "@/data/site";

export default function HeroSection() {
  const reduced = useReducedMotion();

  const variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative min-h-[92vh] flex items-center bg-bg-dark overflow-hidden pt-[70px]">
      {/* Background organic gradients */}
      <div className="absolute inset-0 leaf-pattern pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-radial-gold opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-green-mid/5 blur-3xl pointer-events-none" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-[1160px] mx-auto px-[clamp(20px,5vw,80px)] py-20">
        <div className="max-w-3xl">
          <motion.div
            initial={reduced ? false : "hidden"}
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          >
            {/* Eyebrow */}
            <motion.div
              variants={variants}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center gap-2 text-eyebrow uppercase tracking-[0.1em] font-bold text-gold mb-6">
                <span className="w-6 h-[2px] bg-gradient-gold rounded-full" />
                OSFNG MFI — Operation Smile Foundation Nigeria
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={variants}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-hero-xl font-bold text-white leading-[1.08] tracking-tight mb-6"
            >
              Empowering{" "}
              <span className="gradient-text-gold">Communities.</span>{" "}
              Transforming Lives.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={variants}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-body-lg text-text-light-muted max-w-xl mb-10 leading-relaxed"
            >
              {brand.heroSubheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={variants}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <Link href="/become-a-member">
                <Button variant="gold" size="lg">
                  Become a Member
                  <ArrowRight size={16} aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="light" size="lg">
                  Learn About Us
                </Button>
              </Link>
            </motion.div>

            {/* Phone */}
            <motion.a
              variants={variants}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              href={`tel:+${contact.phone.replace(/-/g, "")}`}
              className="inline-flex items-center gap-2 mt-8 text-sm text-text-light-muted hover:text-white transition-colors"
            >
              <Phone size={14} aria-hidden="true" className="text-gold" />
              <span>+{contact.phone}</span>
            </motion.a>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 pt-10 border-t border-border-dark grid grid-cols-2 sm:grid-cols-4 gap-8"
        >
          {[
            { label: "Founded", value: "2020", sub: "Owerri, Imo State" },
            {
              label: "Savings Plans",
              value: "4",
              sub: "Target · Daily · Trader · Happy Child",
            },
            {
              label: "Education Loan",
              value: "₦200k",
              sub: "Max · 2.5% flat · Monthly",
            },
            {
              label: "Opening Balance",
              value: "₦500",
              sub: "Happy Child Account",
            },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-section-lg font-bold text-white">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-gold mt-1">
                {stat.label}
              </p>
              <p className="text-[10px] sm:text-xs text-text-light-muted mt-0.5 leading-snug">
                {stat.sub}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
