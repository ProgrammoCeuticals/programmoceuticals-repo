import { useState } from "react";
import { MapPin, Bed, Bath, Maximize, Heart, CheckCircle2, Compass } from "lucide-react";
import { Breadcrumbs, GoldButton } from "../components/UI.jsx";
import { PropertyCard, InquiryForm } from "../components/PropertyCard.jsx";
import { PROPERTIES, IMG, C } from "../data/index.js";

export default function PropertyDetailPage({ property, go, viewProperty, favorites, toggleFav }) {
  const [activeImg, setActiveImg] = useState(0);
  if (!property) return null;

  const gallery = [property.image, IMG.interior1, IMG.interior2, IMG.apt1];
  const amenities = [
    "24/7 Security", "Swimming Pool", "Fitness Center", "Backup Power",
    "Smart Home System", "Reserved Parking", "Landscaped Garden", "Concierge Service",
  ];
  const related = PROPERTIES.filter((p) => p.id !== property.id && p.location === property.location).slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <Breadcrumbs
        items={[
          { label: "Home", key: "home" },
          { label: "Properties", key: "properties" },
          { label: property.name },
        ]}
        onNavigate={go}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Gallery */}
          <div className="rounded-2xl overflow-hidden animate-fade-in">
            <img
              src={gallery[activeImg]}
              alt={`${property.name} — view ${activeImg + 1}`}
              className="h-96 w-full object-cover"
            />
          </div>
          <div className="mt-3 flex gap-3 hf-scrollbar overflow-x-auto pb-2" role="list" aria-label="Property gallery thumbnails">
            {gallery.map((g, i) => (
              <button
                key={i}
                role="listitem"
                onClick={() => setActiveImg(i)}
                aria-label={`View image ${i + 1}`}
                aria-pressed={activeImg === i}
                className={`h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
                  activeImg === i ? "border-[#C9A227]" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={g} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          {/* Header */}
          <div className="mt-10 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="ff-display text-3xl font-semibold" style={{ color: C.navy }}>{property.name}</h1>
              <p className="mt-2 flex items-center gap-1 text-slate-500">
                <MapPin size={15} aria-hidden="true" /> {property.location}, Federal Capital Territory
              </p>
            </div>
            <p className="ff-display text-3xl font-bold" style={{ color: C.gold }}>
              ${property.price.toLocaleString()}
            </p>
          </div>

          {/* Key stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl border border-slate-100 p-5">
            <div className="text-center">
              <Bed className="mx-auto mb-1" size={18} style={{ color: C.gold }} aria-hidden="true" />
              <p className="text-sm font-semibold">{property.beds || "—"} Beds</p>
            </div>
            <div className="text-center border-x border-slate-100">
              <Bath className="mx-auto mb-1" size={18} style={{ color: C.gold }} aria-hidden="true" />
              <p className="text-sm font-semibold">{property.baths} Baths</p>
            </div>
            <div className="text-center">
              <Maximize className="mx-auto mb-1" size={18} style={{ color: C.gold }} aria-hidden="true" />
              <p className="text-sm font-semibold">{property.size.toLocaleString()} sqft</p>
            </div>
          </div>

          {/* Overview */}
          <div className="mt-10">
            <h2 className="ff-display text-xl font-semibold mb-3" style={{ color: C.navy }}>Overview</h2>
            <p className="text-slate-600 leading-relaxed">
              {property.name} offers refined living in {property.location}, one of the city's most established districts.
              Thoughtfully designed interiors, premium finishes and abundant natural light come together across{" "}
              {property.size.toLocaleString()} sqft of considered space, backed by HousingFirst's full-service property management.
            </p>
          </div>

          {/* Amenities */}
          <div className="mt-10">
            <h2 className="ff-display text-xl font-semibold mb-4" style={{ color: C.navy }}>Amenities</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 list-none m-0 p-0">
              {amenities.map((a) => (
                <li key={a} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={15} style={{ color: C.success }} aria-hidden="true" /> {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Floor plan */}
          <div className="mt-10">
            <h2 className="ff-display text-xl font-semibold mb-4" style={{ color: C.navy }}>Floor Plan</h2>
            <div className="rounded-2xl border border-dashed border-slate-300 h-64 flex items-center justify-center text-slate-400 text-sm">
              Floor plan available upon request
            </div>
          </div>

          {/* Map */}
          <div className="mt-10">
            <h2 className="ff-display text-xl font-semibold mb-4" style={{ color: C.navy }}>Location</h2>
            <div
              className="rounded-2xl border border-slate-200 h-72 flex items-center justify-center text-slate-400 text-sm"
              style={{ background: C.lightGray }}
            >
              <span className="flex items-center gap-2">
                <Compass size={16} aria-hidden="true" /> {property.location}, FCT
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside>
          <div className="rounded-2xl border border-slate-100 p-6 shadow-sm sticky top-24">
            <button
              onClick={() => toggleFav(property.id)}
              aria-pressed={favorites.includes(property.id)}
              className="mb-4 flex items-center gap-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded"
              style={{ color: favorites.includes(property.id) ? C.gold : C.text }}
            >
              <Heart
                size={16}
                fill={favorites.includes(property.id) ? C.gold : "none"}
                aria-hidden="true"
              />
              {favorites.includes(property.id) ? "Saved" : "Save Property"}
            </button>
            <h2 className="ff-display text-lg font-semibold mb-4" style={{ color: C.navy }}>Request an Inquiry</h2>
            <InquiryForm propertyName={property.name} />
          </div>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="ff-display text-2xl font-semibold mb-6" style={{ color: C.navy }}>
            More in {property.location}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PropertyCard key={p.id} p={p} onView={viewProperty} favorites={favorites} toggleFav={toggleFav} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <GoldButton onClick={() => go("properties")}>
          ← Back to All Properties
        </GoldButton>
      </div>
    </section>
  );
}
