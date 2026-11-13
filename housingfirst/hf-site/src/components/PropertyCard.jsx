import { useState } from "react";
import { CheckCircle2, Heart, MapPin, Bed, Bath, Maximize } from "lucide-react";
import { C } from "../data/index.js";

export function PropertyCard({ p, onView, favorites, toggleFav }) {
  const isFav = favorites.includes(p.id);

  return (
    <article className="card-lift rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm">
      <div className="relative h-56 overflow-hidden">
        <img
          src={p.image}
          alt={`${p.name} in ${p.location}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <button
          onClick={() => toggleFav(p.id)}
          aria-label={isFav ? `Remove ${p.name} from saved` : `Save ${p.name}`}
          aria-pressed={isFav}
          className="absolute top-3 right-3 rounded-full bg-white/90 p-2 shadow-sm transition-transform hover:scale-110"
        >
          <Heart
            size={16}
            fill={isFav ? C.gold : "none"}
            color={isFav ? C.gold : C.navy}
          />
        </button>
        <span
          className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: C.navy, color: C.gold }}
        >
          {p.type}
        </span>
      </div>

      <div className="p-5">
        <p className="ff-display text-xl font-semibold" style={{ color: C.navy }}>
          ${p.price.toLocaleString()}
        </p>
        <h3 className="mt-1 font-semibold text-slate-800">{p.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
          <MapPin size={14} aria-hidden="true" />
          {p.location}, FCT
        </p>

        <div className="mt-4 flex items-center gap-4 text-sm text-slate-600 border-t border-slate-100 pt-4">
          {p.beds > 0 && (
            <span className="flex items-center gap-1">
              <Bed size={15} aria-hidden="true" />
              <span>{p.beds} bed{p.beds !== 1 ? "s" : ""}</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <Bath size={15} aria-hidden="true" />
            <span>{p.baths} bath{p.baths !== 1 ? "s" : ""}</span>
          </span>
          <span className="flex items-center gap-1">
            <Maximize size={15} aria-hidden="true" />
            <span>{p.size.toLocaleString()} sqft</span>
          </span>
        </div>

        <button
          onClick={() => onView(p)}
          className="mt-5 w-full rounded-full border py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-navy hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-slate-700"
          style={{ borderColor: C.navy, color: C.navy }}
          onMouseEnter={(e) => { e.currentTarget.style.background = C.navy; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.navy; }}
        >
          View Details
        </button>
      </div>
    </article>
  );
}

// ─── Inquiry / Contact Form ───────────────────────────────────────────────────
export function InquiryForm({ propertyName }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: propertyName ? `I'm interested in ${propertyName}.` : "",
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (validate()) setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700 flex items-center gap-2 animate-fade-in" role="alert">
        <CheckCircle2 size={16} aria-hidden="true" />
        Thank you — our team will reach out shortly.
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      <div>
        <label htmlFor="inq-name" className="sr-only">Full name</label>
        <input
          id="inq-name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Full name"
          autoComplete="name"
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "err-name" : undefined}
        />
        {errors.name && <p id="err-name" className="text-xs text-red-500 mt-1" role="alert">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="inq-email" className="sr-only">Email address</label>
        <input
          id="inq-email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="Email address"
          autoComplete="email"
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "err-email" : undefined}
        />
        {errors.email && <p id="err-email" className="text-xs text-red-500 mt-1" role="alert">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="inq-phone" className="sr-only">Phone number</label>
        <input
          id="inq-phone"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          placeholder="Phone number"
          autoComplete="tel"
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "err-phone" : undefined}
        />
        {errors.phone && <p id="err-phone" className="text-xs text-red-500 mt-1" role="alert">{errors.phone}</p>}
      </div>
      <div>
        <label htmlFor="inq-msg" className="sr-only">Message</label>
        <textarea
          id="inq-msg"
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          rows={3}
          placeholder="Your message"
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-full py-3 text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
        style={{ background: C.gold, color: C.navy }}
      >
        Send Inquiry
      </button>
    </form>
  );
}
