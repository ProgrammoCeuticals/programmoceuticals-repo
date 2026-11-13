import { Phone, Mail, MapPin, Clock, Compass } from "lucide-react";

const SocialIcon = ({ name }) => {
  if (name === "Facebook") return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
  if (name === "Twitter") return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;
  if (name === "Instagram") return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
  if (name === "LinkedIn") return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
  return null;
};
import { SectionTitle, Breadcrumbs } from "../components/UI.jsx";
import { InquiryForm } from "../components/PropertyCard.jsx";
import { CONTACT, C } from "../data/index.js";

export default function ContactPage({ go }) {
  const details = [
    { icon: MapPin, label: "Office Address", value: CONTACT.address, href: null },
    { icon: Phone, label: "Phone", value: CONTACT.phone, href: `tel:${CONTACT.phone}` },
    { icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: Clock, label: "Business Hours", value: CONTACT.hours, href: null },
  ];

  const socials = [
    { href: CONTACT.social.facebook, label: "Facebook" },
    { href: CONTACT.social.twitter, label: "Twitter" },
    { href: CONTACT.social.instagram, label: "Instagram" },
    { href: CONTACT.social.linkedin, label: "LinkedIn" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <Breadcrumbs items={[{ label: "Home", key: "home" }, { label: "Contact" }]} onNavigate={go} />
      <div className="mt-6 mb-10">
        <SectionTitle
          eyebrow="Get In Touch"
          title="We'd Love to Hear From You"
          subtitle="Whether you're buying, investing or need a management partner, our team responds within one business day."
        />
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Form */}
        <div className="rounded-2xl border border-slate-100 p-8 shadow-sm">
          <h2 className="ff-display text-xl font-semibold mb-5" style={{ color: C.navy }}>Send a Message</h2>
          <InquiryForm />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-100 p-6 grid gap-4">
            {details.map((c) => (
              <div key={c.label} className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: C.gold + "1f" }}
                >
                  <c.icon size={17} style={{ color: C.gold }} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{c.label}</p>
                  {c.href ? (
                    <a
                      href={c.href}
                      className="text-sm font-medium text-slate-800 hover:text-[#C9A227] transition-colors"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-slate-800">{c.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              {socials.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  rel="noopener noreferrer"
                  className="rounded-full border border-slate-200 p-2 hover:border-[#C9A227] hover:text-[#C9A227] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                >
                  <SocialIcon name={label} />
                </a>
              ))}
            </div>
          </div>

          {/* Map placeholder */}
          <div
            className="rounded-2xl border border-slate-200 h-64 flex items-center justify-center text-slate-400 text-sm"
            style={{ background: C.lightGray }}
            aria-label="Map placeholder"
          >
            <span className="flex items-center gap-2">
              <Compass size={16} aria-hidden="true" /> Gwarinpa Estate, Abuja
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
