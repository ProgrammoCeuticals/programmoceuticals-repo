import { useState } from "react";
import { SectionTitle, Breadcrumbs } from "../components/UI.jsx";
import { PROJECTS, C } from "../data/index.js";

const statusColor = (s) =>
  s === "Completed" ? C.success : s === "Ongoing" ? C.gold : "#64748B";

export default function ProjectsPage({ go }) {
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.status === filter);

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <Breadcrumbs items={[{ label: "Home", key: "home" }, { label: "Projects" }]} onNavigate={go} />

      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <SectionTitle eyebrow="Our Portfolio" title="Completed, Ongoing & Upcoming Projects" />
        <div className="flex gap-2" role="group" aria-label="Filter projects by status">
          {["All", "Completed", "Ongoing", "Upcoming"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className="rounded-full px-4 py-1.5 text-xs font-medium border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              style={{
                background: filter === f ? C.navy : "transparent",
                borderColor: filter === f ? C.navy : "#e2e8f0",
                color: filter === f ? "#fff" : "#475569",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 columns-1 sm:columns-2 lg:columns-3 gap-6 [&>*]:mb-6">
        {filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => setModal(p)}
            className="block w-full text-left rounded-2xl overflow-hidden border border-slate-100 card-lift break-inside-avoid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            aria-label={`View details for ${p.title}`}
          >
            <div className="relative">
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                className="w-full object-cover"
                style={{ height: p.id % 2 === 0 ? 260 : 340 }}
              />
              <span
                className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ background: statusColor(p.status) }}
              >
                {p.status}
              </span>
            </div>
            <div className="p-4">
              <h3 className="ff-display font-semibold" style={{ color: C.navy }}>{p.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{p.year}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-6 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={modal.title}
          onClick={() => setModal(null)}
        >
          <div
            className="max-w-lg w-full rounded-2xl bg-white overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={modal.image} alt={modal.title} className="h-64 w-full object-cover" />
            <div className="p-6">
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ background: statusColor(modal.status) }}
              >
                {modal.status}
              </span>
              <h3 className="ff-display text-2xl font-semibold mt-3" style={{ color: C.navy }}>{modal.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{modal.year}</p>
              <p className="text-sm text-slate-600 leading-relaxed mt-3">{modal.desc}</p>
              <button
                onClick={() => setModal(null)}
                className="mt-6 text-sm font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded"
                style={{ color: C.gold }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
