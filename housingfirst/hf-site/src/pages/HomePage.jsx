import { useState } from "react";
import { Star, Quote, CheckCircle2, Sparkles } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { SectionTitle, GoldButton, GhostButton, Counter } from "../components/UI.jsx";
import { PropertyCard } from "../components/PropertyCard.jsx";
import { STATS, SERVICES, PROPERTIES, TESTIMONIALS, PARTNERS, ROI_DATA, IMG, C } from "../data/index.js";

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ go }) {
  return (
    <section className="relative min-h-[92vh] flex items-end overflow-hidden">
      <img
        src={IMG.hero}
        alt="Modern architectural residence at dusk"
        className="absolute inset-0 h-full w-full object-cover"
        fetchpriority="high"
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(15,23,42,0.5) 0%, rgba(15,23,42,0.5) 40%, rgba(15,23,42,0.92) 100%)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-40 w-full">
        <p className="text-xs tracking-[0.3em] uppercase text-[#E4C766] mb-5 animate-fade-up font-medium">
          Real Estate Development &amp; Investment
        </p>
        <h1
          className="ff-display text-4xl sm:text-6xl font-bold text-white leading-[1.08] max-w-3xl animate-fade-up"
          style={{ animationDelay: ".1s" }}
        >
          Building Tomorrow's Communities Today.
        </h1>
        <p
          className="mt-6 max-w-xl text-slate-300 text-base sm:text-lg animate-fade-up"
          style={{ animationDelay: ".2s" }}
        >
          HousingFirst develops, manages and grows real estate assets that stand the test of time — from luxury residences to landmark commercial districts.
        </p>
        <div className="mt-9 flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: ".3s" }}>
          <GoldButton onClick={() => go("properties")}>Explore Properties</GoldButton>
          <GhostButton onClick={() => go("contact")} light>Contact Us</GhostButton>
        </div>
      </div>
    </section>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  return (
    <section className="relative -mt-16 z-20 mx-auto max-w-6xl px-6" aria-label="Company statistics">
      <div
        className="grid grid-cols-2 md:grid-cols-4 rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: C.navy }}
      >
        {STATS.map((s, i) => (
          <div key={s.label} className={`p-7 text-center ${i !== 0 ? "border-l border-white/10" : ""}`}>
            <p className="ff-display text-3xl md:text-4xl font-bold" style={{ color: C.gold }}>
              <Counter value={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-1 text-xs md:text-sm text-slate-300">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Services Preview ─────────────────────────────────────────────────────────
function ServicesPreview({ go }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionTitle
          eyebrow="What We Do"
          title="Full-Spectrum Real Estate Expertise"
          subtitle="From breaking ground to managing tenants, HousingFirst covers every stage of the property lifecycle."
        />
        <GhostButton onClick={() => go("services")}>All Services</GhostButton>
      </div>
      <div className="grid gap-6 md:grid-cols-3 stagger">
        {SERVICES.map((s) => (
          <div key={s.title} className="card-lift rounded-2xl border border-slate-100 p-7 bg-white shadow-sm animate-fade-up">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-5" style={{ background: C.gold + "1f" }}>
              <s.icon size={22} style={{ color: C.gold }} aria-hidden="true" />
            </div>
            <h3 className="ff-display text-lg font-semibold mb-2" style={{ color: C.navy }}>{s.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">{s.desc}</p>
            <ul className="space-y-1.5">
              {s.points.slice(0, 3).map((pt) => (
                <li key={pt} className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 size={13} style={{ color: C.success }} aria-hidden="true" /> {pt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Featured Properties ──────────────────────────────────────────────────────
function FeaturedProperties({ go, viewProperty, favorites, toggleFav }) {
  return (
    <section className="py-24" style={{ background: C.lightGray }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle
            eyebrow="Handpicked"
            title="Featured Properties"
            subtitle="A curated selection of our most sought-after residences and commercial spaces."
          />
          <GhostButton onClick={() => go("properties")}>View All Properties</GhostButton>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger">
          {PROPERTIES.filter((p) => p.featured).map((p) => (
            <PropertyCard key={p.id} p={p} onView={viewProperty} favorites={favorites} toggleFav={toggleFav} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Investment Teaser ────────────────────────────────────────────────────────
function InvestmentTeaser({ go }) {
  const metrics = [
    { l: "Avg. Annual ROI", v: "16.4%" },
    { l: "Assets Under Mgmt", v: "$210M" },
    { l: "Active Investors", v: "1,860" },
    { l: "Occupancy Rate", v: "96%" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 grid gap-12 lg:grid-cols-2 items-center">
      <div className="animate-fade-up">
        <SectionTitle
          eyebrow="Grow Your Wealth"
          title="Investment Opportunities Built on Real Assets"
          subtitle="Our portfolio has delivered consistent double-digit returns by pairing disciplined underwriting with hands-on asset management."
        />
        <div className="grid grid-cols-2 gap-4 mb-8">
          {metrics.map((m) => (
            <div key={m.l} className="rounded-xl border border-slate-100 p-4">
              <p className="ff-display text-2xl font-semibold" style={{ color: C.navy }}>{m.v}</p>
              <p className="text-xs text-slate-500 mt-1">{m.l}</p>
            </div>
          ))}
        </div>
        <GoldButton onClick={() => go("investments")}>Explore Investments</GoldButton>
      </div>
      <div className="rounded-2xl border border-slate-100 p-6 shadow-sm animate-fade-in">
        <p className="text-sm font-semibold text-slate-500 mb-4">5-Year Portfolio ROI (%)</p>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={ROI_DATA}>
            <defs>
              <linearGradient id="roiFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.gold} stopOpacity={0.5} />
                <stop offset="95%" stopColor={C.gold} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef1f5" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke={C.gold} strokeWidth={2.5} fill="url(#roiFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const [idx, setIdx] = useState(0);
  const t = TESTIMONIALS[idx];
  const prev = () => setIdx((idx - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setIdx((idx + 1) % TESTIMONIALS.length);

  return (
    <section className="py-24" style={{ background: C.navy }} aria-label="Client testimonials">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <SectionTitle eyebrow="Client Stories" title="What Our Clients Say" light />
        <div className="mx-auto max-w-2xl rounded-2xl bg-white/5 border border-white/10 p-10 animate-fade-in" key={idx}>
          <Quote className="mx-auto mb-4" size={28} style={{ color: C.gold }} aria-hidden="true" />
          <blockquote className="ff-display text-xl text-white leading-relaxed">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <div className="mt-6 flex items-center justify-center gap-3">
            <img src={t.img} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
            <div className="text-left">
              <p className="text-sm font-semibold text-white">{t.name}</p>
              <p className="text-xs text-slate-400">{t.role}</p>
            </div>
          </div>
          <div className="mt-3 flex justify-center gap-1" aria-label={`${t.rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} fill={i < t.rating ? C.gold : "none"} color={C.gold} aria-hidden="true" />
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="rounded-full border border-white/20 p-2 text-white hover:border-[#C9A227] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="rounded-full border border-white/20 p-2 text-white hover:border-[#C9A227] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Partners ─────────────────────────────────────────────────────────────────
function Partners() {
  return (
    <section className="border-y border-slate-100 py-10" aria-label="Trusted partners">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs tracking-[0.25em] uppercase text-slate-400 mb-6">Trusted By Industry Leaders</p>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 list-none m-0 p-0">
          {PARTNERS.map((p) => (
            <li key={p} className="ff-display text-lg text-slate-400 font-medium">{p}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
export function CTASection({ go }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div
        className="relative overflow-hidden rounded-3xl px-10 py-16 text-center"
        style={{ background: `linear-gradient(135deg, ${C.navy}, #1c2b4d)` }}
      >
        <Sparkles className="mx-auto mb-4" size={26} style={{ color: C.gold }} aria-hidden="true" />
        <h2 className="ff-display text-3xl md:text-4xl font-semibold text-white max-w-2xl mx-auto">
          Ready to find your next property or investment?
        </h2>
        <p className="mt-4 text-slate-300 max-w-xl mx-auto">
          Speak with our advisory team today and take the first step toward your next address or asset.
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <GoldButton onClick={() => go("properties")}>Browse Properties</GoldButton>
          <GhostButton onClick={() => go("contact")} light>Talk to an Advisor</GhostButton>
        </div>
      </div>
    </section>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function HomePage({ go, viewProperty, favorites, toggleFav }) {
  return (
    <>
      <Hero go={go} />
      <StatsBar />
      <ServicesPreview go={go} />
      <FeaturedProperties go={go} viewProperty={viewProperty} favorites={favorites} toggleFav={toggleFav} />
      <InvestmentTeaser go={go} />
      <Testimonials />
      <Partners />
      <CTASection go={go} />
    </>
  );
}
