import { CheckCircle2 } from "lucide-react";
import { SectionTitle, Breadcrumbs } from "../components/UI.jsx";
import { CTASection } from "./HomePage.jsx";
import { SERVICES, C } from "../data/index.js";

export default function ServicesPage({ go }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <Breadcrumbs items={[{ label: "Home", key: "home" }, { label: "Services" }]} onNavigate={go} />
      <div className="mt-6 mb-10">
        <SectionTitle
          eyebrow="Capabilities"
          title="Why Choose HousingFirst"
          subtitle="One accountable partner across development, investment, management, staffing and construction."
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {SERVICES.map((s) => (
          <div key={s.title} className="rounded-2xl border border-slate-100 p-8 card-lift">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl mb-5"
              style={{ background: C.gold + "1f" }}
            >
              <s.icon size={22} style={{ color: C.gold }} aria-hidden="true" />
            </div>
            <h3 className="ff-display text-xl font-semibold mb-2" style={{ color: C.navy }}>{s.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">{s.desc}</p>
            <ul className="grid grid-cols-2 gap-2 list-none m-0 p-0">
              {s.points.map((pt) => (
                <li key={pt} className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 size={13} style={{ color: C.success }} aria-hidden="true" /> {pt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-14">
        <CTASection go={go} />
      </div>
    </section>
  );
}
