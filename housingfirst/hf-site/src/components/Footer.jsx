import { Building2, Send, Phone, Mail, MapPin } from "lucide-react";

const SocialIcon = ({ name }) => {
  if (name === "Facebook") return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
  if (name === "Twitter") return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;
  if (name === "Instagram") return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
  if (name === "LinkedIn") return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
  return null;
};
import { SERVICES, CONTACT, C } from "../data/index.js";

export default function Footer({ go }) {
  return (
    <footer style={{ background: C.navy }} className="text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: C.gold }}>
              <Building2 size={18} color={C.navy} aria-hidden="true" />
            </div>
            <span className="ff-display text-lg font-semibold text-white">HousingFirst</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Building tomorrow's communities today — development, investment and management under one trusted roof.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { href: CONTACT.social.facebook, label: "Facebook" },
              { href: CONTACT.social.twitter, label: "Twitter" },
              { href: CONTACT.social.instagram, label: "Instagram" },
              { href: CONTACT.social.linkedin, label: "LinkedIn" },
            ].map(({ href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 p-2 hover:border-[#C9A227] hover:text-[#C9A227] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              >
                <SocialIcon name={label} />
              </a>
            ))}
          </div>
        </div>

        {/* Company links */}
        <div>
          <h3 className="ff-display text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            {["about", "properties", "projects", "investments", "contact"].map((k) => (
              <li key={k}>
                <button
                  onClick={() => go(k)}
                  className="capitalize hover:text-[#C9A227] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-yellow-400 rounded"
                >
                  {k}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Services links */}
        <div>
          <h3 className="ff-display text-white font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            {SERVICES.map((s) => (
              <li key={s.title}>
                <button
                  onClick={() => go("services")}
                  className="hover:text-[#C9A227] transition-colors text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-yellow-400 rounded"
                >
                  {s.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter + contact */}
        <div>
          <h3 className="ff-display text-white font-semibold mb-4">Stay Updated</h3>
          <p className="text-sm text-slate-400 mb-3">Subscribe for new listings and investment insights.</p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2"
            aria-label="Newsletter signup"
          >
            <label htmlFor="footer-email" className="sr-only">Email address</label>
            <input
              id="footer-email"
              type="email"
              required
              placeholder="Your email"
              className="w-full rounded-full bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full p-2.5 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              style={{ background: C.gold }}
              aria-label="Subscribe"
            >
              <Send size={16} color={C.navy} aria-hidden="true" />
            </button>
          </form>

          <address className="mt-5 space-y-2 text-sm text-slate-400 not-italic">
            <p className="flex items-center gap-2">
              <Phone size={14} aria-hidden="true" />
              <a href={`tel:${CONTACT.phone}`} className="hover:text-[#C9A227] transition-colors">{CONTACT.phone}</a>
            </p>
            <p className="flex items-center gap-2">
              <Mail size={14} aria-hidden="true" />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-[#C9A227] transition-colors">{CONTACT.email}</a>
            </p>
            <p className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
              {CONTACT.address}
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} HousingFirst Holdings Ltd. All rights reserved.
        <span className="mx-2">·</span>
        <button onClick={() => {}} className="hover:text-slate-300 transition-colors">Privacy Policy</button>
        <span className="mx-2">·</span>
        <button onClick={() => {}} className="hover:text-slate-300 transition-colors">Terms of Service</button>
      </div>
    </footer>
  );
}
