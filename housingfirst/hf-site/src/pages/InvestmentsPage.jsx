import { useState } from "react";
import { CheckCircle2, Plus, Minus, LineChart as LineChartIcon } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { SectionTitle, Breadcrumbs, GoldButton } from "../components/UI.jsx";
import { FAQS_INVEST, SALES_DATA, C } from "../data/index.js";

export default function InvestmentsPage({ go }) {
  const [openFaq, setOpenFaq] = useState(0);

  const process = [
    { title: "Discovery Call", text: "Share your goals and budget with an investment advisor." },
    { title: "Portfolio Match", text: "We shortlist assets aligned to your target returns." },
    { title: "Due Diligence", text: "Independent valuation and legal review of the chosen asset." },
    { title: "Acquisition", text: "Transfer of title and formal onboarding to your portfolio." },
    { title: "Ongoing Management", text: "We manage, report and grow the asset on your behalf." },
  ];

  const benefits = ["Steady rental income", "Capital appreciation", "Professionally managed", "Transparent reporting"];

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <Breadcrumbs items={[{ label: "Home", key: "home" }, { label: "Investments" }]} onNavigate={go} />

      {/* Hero split */}
      <div className="mt-6 grid gap-12 lg:grid-cols-2 items-center">
        <div className="animate-fade-up">
          <SectionTitle
            eyebrow="Why Invest"
            title="Grow Wealth Through Real Assets"
            subtitle="HousingFirst pairs disciplined acquisition with active management, so your capital works even when you're not watching it."
          />
          <ul className="grid grid-cols-2 gap-3 list-none m-0 p-0">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 rounded-xl border border-slate-100 p-3 text-sm">
                <CheckCircle2 size={15} style={{ color: C.success }} aria-hidden="true" /> {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-100 p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 mb-4">Quarterly Units Sold</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={SALES_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef1f5" />
              <XAxis dataKey="q" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="units" radius={[6, 6, 0, 0]} fill={C.navy} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Process */}
      <div className="mt-24">
        <SectionTitle eyebrow="How It Works" title="Our Investment Process" />
        <ol className="grid gap-6 md:grid-cols-5 list-none m-0 p-0">
          {process.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl border border-slate-100 p-5">
              <p className="ff-display text-3xl font-bold mb-2" style={{ color: "rgba(201,162,39,0.35)" }}>
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-semibold text-slate-800 mb-1">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* FAQs + CTA */}
      <div className="mt-24 grid gap-12 lg:grid-cols-2">
        <div>
          <SectionTitle eyebrow="Common Questions" title="Investment FAQs" />
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
            {FAQS_INVEST.map((f, i) => (
              <div key={f.q}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  aria-expanded={openFaq === i}
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yellow-400"
                >
                  {f.q}
                  {openFaq === i
                    ? <Minus size={16} aria-hidden="true" />
                    : <Plus size={16} aria-hidden="true" />}
                </button>
                {openFaq === i && (
                  <p className="px-5 pb-4 text-sm text-slate-500 leading-relaxed animate-fade-in">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl p-8 flex flex-col justify-center text-center"
          style={{ background: C.navy }}
        >
          <LineChartIcon className="mx-auto mb-4" size={28} style={{ color: C.gold }} aria-hidden="true" />
          <h3 className="ff-display text-2xl font-semibold text-white mb-2">Start Your Investment Journey</h3>
          <p className="text-sm text-slate-300 mb-6">
            Book a free consultation with our investment advisory team this week.
          </p>
          <GoldButton onClick={() => go("contact")} className="mx-auto">Book a Consultation</GoldButton>
        </div>
      </div>
    </section>
  );
}
