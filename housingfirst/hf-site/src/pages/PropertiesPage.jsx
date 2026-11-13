import { useState, useEffect, useMemo } from "react";
import { SectionTitle, Breadcrumbs, PropertySkeleton } from "../components/UI.jsx";
import { PropertyCard } from "../components/PropertyCard.jsx";
import { PROPERTIES, PROPERTY_TYPES, LOCATIONS } from "../data/index.js";

export default function PropertiesPage({ go, viewProperty, favorites, toggleFav }) {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", location: "", type: "", beds: "", maxPrice: 1500000 });

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const set = (key, val) => setFilters((f) => ({ ...f, [key]: val }));

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase();
    return PROPERTIES.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q)) return false;
      if (filters.location && p.location !== filters.location) return false;
      if (filters.type && p.type !== filters.type) return false;
      if (filters.beds) {
        const n = parseInt(filters.beds, 10);
        if (filters.beds === "5+") { if (p.beds < 5) return false; }
        else if (p.beds !== n) return false;
      }
      if (p.price > filters.maxPrice) return false;
      return true;
    });
  }, [filters]);

  const reset = () => setFilters({ search: "", location: "", type: "", beds: "", maxPrice: 1500000 });
  const hasFilters = filters.search || filters.location || filters.type || filters.beds || filters.maxPrice < 1500000;

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <Breadcrumbs items={[{ label: "Home", key: "home" }, { label: "Properties" }]} onNavigate={go} />
      <div className="mt-4 mb-10">
        <SectionTitle
          eyebrow="Listings"
          title="Find Your Next Property"
          subtitle="Browse residences and commercial spaces across our most established districts."
        />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-100 p-5 shadow-sm mb-10">
        <div className="grid gap-4 md:grid-cols-5">
          <div className="md:col-span-2">
            <label htmlFor="prop-search" className="sr-only">Search properties</label>
            <input
              id="prop-search"
              type="search"
              value={filters.search}
              onChange={(e) => set("search", e.target.value)}
              placeholder="Search by name or location…"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label htmlFor="prop-location" className="sr-only">Location</label>
            <select
              id="prop-location"
              value={filters.location}
              onChange={(e) => set("location", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">All Locations</option>
              {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="prop-type" className="sr-only">Property type</label>
            <select
              id="prop-type"
              value={filters.type}
              onChange={(e) => set("type", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">All Types</option>
              {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="prop-beds" className="sr-only">Bedrooms</label>
            <select
              id="prop-beds"
              value={filters.beds}
              onChange={(e) => set("beds", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Any Bedrooms</option>
              {["2", "3", "4", "5+"].map((b) => <option key={b} value={b}>{b} beds</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="prop-price" className="text-xs text-slate-500 block mb-1">
              Max Price: <span className="font-medium text-slate-700">${filters.maxPrice.toLocaleString()}</span>
            </label>
            <input
              id="prop-price"
              type="range"
              min={150000}
              max={1500000}
              step={10000}
              value={filters.maxPrice}
              onChange={(e) => set("maxPrice", Number(e.target.value))}
              className="w-full accent-[#C9A227]"
            />
          </div>
          {hasFilters && (
            <button
              onClick={reset}
              className="text-sm text-slate-500 hover:text-slate-800 underline underline-offset-2 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-500 mb-6" aria-live="polite">
        {loading ? "Loading…" : `${filtered.length} propert${filtered.length !== 1 ? "ies" : "y"} found`}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <PropertySkeleton key={i} />)
          : filtered.map((p) => (
              <PropertyCard key={p.id} p={p} onView={viewProperty} favorites={favorites} toggleFav={toggleFav} />
            ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          No properties match those filters —{" "}
          <button onClick={reset} className="underline hover:text-slate-800 transition-colors">
            clear filters
          </button>{" "}
          to see all listings.
        </div>
      )}
    </section>
  );
}
