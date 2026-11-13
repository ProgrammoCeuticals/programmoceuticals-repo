import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { contact, brand } from "@/data/site";
import { footerColumns } from "@/data/navigation";

export default function Footer() {
  return (
    <footer className="bg-bg-dark text-text-light">
      <div className="max-w-[1380px] mx-auto px-[clamp(20px,5vw,80px)]">
        {/* Main grid */}
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-green flex items-center justify-center">
                <span className="text-white font-black text-sm">OS</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold text-white">
                  Operation Smile Foundation
                </span>
                <span className="text-[10px] text-text-light-muted font-medium tracking-[0.06em] uppercase">
                  Nigeria
                </span>
              </div>
            </Link>

            <p className="text-sm text-text-light-muted leading-relaxed max-w-xs">
              {brand.missionShort}
            </p>

            {/* Contact info */}
            <div className="space-y-3 text-sm">
              <a
                href={`tel:+${contact.phone.replace(/-/g, "")}`}
                className="flex items-start gap-2.5 text-text-light-muted hover:text-white transition-colors"
              >
                <Phone
                  size={15}
                  className="mt-0.5 shrink-0 text-gold"
                  aria-hidden="true"
                />
                <span>+{contact.phone}</span>
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-start gap-2.5 text-text-light-muted hover:text-white transition-colors"
              >
                <Mail
                  size={15}
                  className="mt-0.5 shrink-0 text-gold"
                  aria-hidden="true"
                />
                <span>{contact.email}</span>
              </a>
              <address className="not-italic flex items-start gap-2.5 text-text-light-muted">
                <MapPin
                  size={15}
                  className="mt-0.5 shrink-0 text-gold"
                  aria-hidden="true"
                />
                <span>{contact.address}</span>
              </address>
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-text-light-muted mb-5">
                {col.heading}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-light-muted hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border-dark py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-light-muted">
            © {new Date().getFullYear()} Operation Smile Foundation Nigeria. All
            rights reserved.
          </p>
          <p className="text-xs text-text-light-muted/50">
            Proudly built for OSFNG
          </p>
        </div>
      </div>
    </footer>
  );
}
