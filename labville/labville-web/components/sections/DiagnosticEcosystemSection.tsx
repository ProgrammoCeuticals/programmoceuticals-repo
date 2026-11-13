"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";

const NODES = [
  { id: "patient",    label: "Patient",         sublabel: "Your health journey begins",  color: "#4A9AEA" },
  { id: "collection", label: "Collection",       sublabel: "Centre or home visit",         color: "#1E6FD9" },
  { id: "laboratory", label: "Laboratory",       sublabel: "Analysis & imaging",           color: "#0E7C7B" },
  { id: "analysis",   label: "Analysis",         sublabel: "Expert interpretation",        color: "#0ABFBC" },
  { id: "result",     label: "Result",           sublabel: "Your diagnostic report",       color: "#0ABFBC" },
  { id: "insight",    label: "Clinical Insight", sublabel: "Informed next steps",          color: "#4A9AEA" },
];

function NodeDot({ active, color }: { active: boolean; color: string }) {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={{ scale: active ? 1.15 : 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Outer pulse ring */}
      {active && (
        <motion.div
          className="absolute rounded-full border"
          style={{ borderColor: color, width: 56, height: 56 }}
          initial={{ opacity: 0.6, scale: 0.8 }}
          animate={{ opacity: 0, scale: 1.8 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      {/* Core dot */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500"
        style={{
          background: active ? color : "rgba(255,255,255,0.04)",
          borderColor: active ? color : "rgba(255,255,255,0.12)",
          boxShadow: active ? `0 0 24px ${color}55` : "none",
        }}
      >
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: active ? "#fff" : color, opacity: active ? 1 : 0.5 }}
        />
      </div>
    </motion.div>
  );
}

function ConnectorLine({ active, index }: { active: boolean; index: number }) {
  return (
    <div className="flex-1 relative h-px mx-1 overflow-hidden">
      {/* Base line */}
      <div className="absolute inset-0 bg-white/10" />
      {/* Animated fill */}
      <motion.div
        className="absolute inset-0 origin-left"
        style={{ background: "linear-gradient(90deg, #1E6FD9, #0ABFBC)" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: active ? 1 : 0 }}
        transition={{ duration: 0.5, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Travelling particle */}
      {active && (
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent-cyan"
          initial={{ left: "0%" }}
          animate={{ left: "100%" }}
          transition={{ duration: 1.8, delay: index * 0.12, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}

export default function DiagnosticEcosystemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-20%" });
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (!inView) { setActiveIndex(-1); return; }
    let i = 0;
    const interval = setInterval(() => {
      setActiveIndex(i);
      i++;
      if (i >= NODES.length) clearInterval(interval);
    }, 350);
    return () => clearInterval(interval);
  }, [inView]);

  return (
    <SectionContainer bg="bg-bg-primary relative overflow-hidden">
      {/* Background radial */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(10,191,188,0.07) 0%, transparent 65%)" }}
      />

      <div className="relative z-10">
        <SectionHeading
          align="center"
          eyebrow="Diagnostic Ecosystem"
          headline="From biological samples to meaningful clinical insight."
          gradientWord="clinical insight."
        />

        <div ref={ref} className="mt-16 md:mt-20">
          {/* Desktop pipeline — horizontal */}
          <div className="hidden md:flex items-center justify-between">
            {NODES.map((node, i) => (
              <div key={node.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-3 min-w-[80px]">
                  <NodeDot active={activeIndex >= i} color={node.color} />
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: activeIndex >= i ? 1 : 0.3, y: activeIndex >= i ? 0 : 8 }}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                  >
                    <p className="text-sm font-semibold text-white leading-tight">{node.label}</p>
                    <p className="text-[11px] text-text-muted mt-1 leading-snug max-w-[90px]">{node.sublabel}</p>
                  </motion.div>
                </div>
                {i < NODES.length - 1 && (
                  <ConnectorLine active={activeIndex > i} index={i} />
                )}
              </div>
            ))}
          </div>

          {/* Mobile pipeline — vertical */}
          <div className="flex md:hidden flex-col gap-0">
            {NODES.map((node, i) => (
              <div key={node.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <NodeDot active={activeIndex >= i} color={node.color} />
                  {i < NODES.length - 1 && (
                    <div className="w-px flex-1 min-h-[32px] relative overflow-hidden my-1">
                      <div className="absolute inset-0 bg-white/10" />
                      <motion.div
                        className="absolute inset-0 origin-top"
                        style={{ background: "linear-gradient(180deg, #1E6FD9, #0ABFBC)" }}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: activeIndex > i ? 1 : 0 }}
                        transition={{ duration: 0.4, delay: i * 0.12 }}
                      />
                    </div>
                  )}
                </div>
                <motion.div
                  className="pt-2 pb-6"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: activeIndex >= i ? 1 : 0.3, x: activeIndex >= i ? 0 : -8 }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                >
                  <p className="text-sm font-semibold text-white">{node.label}</p>
                  <p className="text-xs text-text-muted mt-0.5">{node.sublabel}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom descriptor */}
        <motion.p
          className="text-center text-body-md text-text-secondary mt-12 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: activeIndex >= NODES.length - 1 ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          Every test at Labville follows a structured pathway — from the moment a sample is collected to the clinical insight that guides your next health decision.
        </motion.p>
      </div>
    </SectionContainer>
  );
}
