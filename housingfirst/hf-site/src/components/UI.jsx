import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { C } from "../data/index.js";

// ─── Section Title ────────────────────────────────────────────────────────────
export function SectionTitle({ eyebrow, title, subtitle, light }) {
  return (
    <div className="mb-10 max-w-2xl animate-fade-up">
      {eyebrow && (
        <p className="text-xs tracking-[0.25em] uppercase mb-3 font-medium" style={{ color: C.gold }}>
          {eyebrow}
        </p>
      )}
      <h2
        className={`ff-display text-3xl md:text-4xl font-semibold gold-underline pb-3 ${light ? "text-white" : ""}`}
        style={!light ? { color: C.navy } : {}}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 text-base leading-relaxed ${light ? "text-slate-300" : "text-slate-600"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Gold Button ──────────────────────────────────────────────────────────────
export function GoldButton({ children, onClick, className = "", icon: Icon = ArrowRight, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500 ${className}`}
      style={{ background: C.gold, color: C.navy }}
    >
      {children}
      <Icon size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
    </button>
  );
}

// ─── Ghost Button ─────────────────────────────────────────────────────────────
export function GhostButton({ children, onClick, light, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 ${className}`}
      style={{
        borderColor: light ? "rgba(255,255,255,0.4)" : C.navy,
        color: light ? C.white : C.navy,
      }}
    >
      {children}
    </button>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
export function Counter({ value, suffix = "" }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1400;
          const start = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - start) / duration);
            setN(Math.floor(p * value));
            if (p < 1) requestAnimationFrame(tick);
            else setN(value);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────
export function Breadcrumbs({ items, onNavigate }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500 animate-fade-in">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-2">
          {i > 0 && <ChevronRight size={14} aria-hidden="true" />}
          {item.key ? (
            <button
              onClick={() => onNavigate(item.key)}
              className="hover:text-slate-800 transition-colors underline-offset-2 hover:underline"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-slate-800 font-medium" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

// ─── Back To Top ──────────────────────────────────────────────────────────────
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const scroller = document.getElementById("hf-scroll");
    if (!scroller) return;
    const onScroll = () => setShow(scroller.scrollTop > 600);
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => document.getElementById("hf-scroll")?.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-40 rounded-full p-3 shadow-lg transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
      style={{ background: C.navy, color: C.gold }}
      aria-label="Back to top"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
export function PropertySkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-100" aria-hidden="true">
      <div className="skeleton h-56 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-1/2 rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-4 w-full rounded" />
      </div>
    </div>
  );
}
