import { Compass, Star, ShieldCheck, Award, Users, Building2 } from "lucide-react";
import { SectionTitle, Breadcrumbs } from "../components/UI.jsx";
import { CTASection } from "./HomePage.jsx";
import { TIMELINE, LEADERSHIP, IMG, C } from "../data/index.js";

export default function AboutPage({ go }) {
  const values = [
    { icon: Compass, title: "Mission", text: "To deliver real estate that improves how people live, work and invest, with uncompromising quality at every stage." },
    { icon: Star, title: "Vision", text: "To be the most trusted real estate development and investment company across the region by 2030." },
    { icon: ShieldCheck, title: "Core Values", text: "Integrity, craftsmanship, transparency and long-term partnership guide every project we take on." },
  ];

  const accolades = [
    { icon: Award, t: "12 Industry Awards" },
    { icon: Users, t: "4,200+ Clients Served" },
    { icon: Building2, t: "96 Projects Delivered" },
    { icon: ShieldCheck, t: "Licensed & Insured" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <Breadcrumbs items={[{ label: "Home", key: "home" }, { label: "About" }]} onNavigate={go} />

      {/* Story */}
      <div className="mt-6 grid gap-10 lg:grid-cols-2 items-center">
        <div className="animate-fade-up">
          <SectionTitle
            eyebrow="Our Story"
            title="Nearly Two Decades of Building With Purpose"
            subtitle="HousingFirst began with a single residential project and has grown into a full-spectrum development, investment and management company."
          />
          <p className="text-slate-600 leading-relaxed">
            Today we operate across six districts in the capital, with a track record of 96 completed projects and thousands of satisfied clients.
            Everything we build is designed to outlast trends and hold value for decades.
          </p>
        </div>
        <img
          src={IMG.office1}
          alt="HousingFirst headquarters"
          className="rounded-2xl h-80 w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Mission / Vision / Values */}
      <div className="mt-20 grid gap-6 md:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="rounded-2xl border border-slate-100 p-7">
            <v.icon size={22} style={{ color: C.gold }} className="mb-4" aria-hidden="true" />
            <h3 className="ff-display text-lg font-semibold mb-2" style={{ color: C.navy }}>{v.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{v.text}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="mt-20">
        <SectionTitle eyebrow="Milestones" title="Company Timeline" />
        <ol className="relative border-l border-slate-200 ml-3 list-none m-0 p-0">
          {TIMELINE.map((t) => (
            <li key={t.year} className="relative pl-8 pb-10">
              <div
                className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full"
                style={{ background: C.gold }}
                aria-hidden="true"
              />
              <p className="ff-display font-semibold" style={{ color: C.navy }}>{t.year}</p>
              <p className="text-sm text-slate-600 mt-1">{t.text}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Leadership */}
      <div className="mt-20">
        <SectionTitle eyebrow="Leadership" title="The Team Behind HousingFirst" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LEADERSHIP.map((l) => (
            <div key={l.name} className="text-center">
              <img
                src={l.img}
                alt={l.name}
                className="mx-auto h-40 w-40 rounded-2xl object-cover mb-4"
                loading="lazy"
              />
              <h4 className="font-semibold text-slate-800">{l.name}</h4>
              <p className="text-xs text-slate-500">{l.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Accolades */}
      <div className="mt-20 grid gap-6 md:grid-cols-4">
        {accolades.map((a) => (
          <div key={a.t} className="flex items-center gap-3 rounded-xl border border-slate-100 p-4">
            <a.icon size={20} style={{ color: C.gold }} aria-hidden="true" />
            <span className="text-sm font-medium text-slate-700">{a.t}</span>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <CTASection go={go} />
      </div>
    </section>
  );
}
