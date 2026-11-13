import Link from 'next/link'
import { contact } from '@/data/navigation'

const footerColumns = [
  {
    heading: 'Diagnostics',
    links: [
      { label: 'Laboratory Diagnostics', href: '/services/laboratory' },
      { label: 'Medical Imaging', href: '/services/imaging' },
      { label: 'Health Screening', href: '/services/screening' },
      { label: 'Specialized Diagnostics', href: '/services/specialized' },
    ],
  },
  {
    heading: 'Services',
    links: [
      { label: 'Corporate Health', href: '/services/corporate' },
      { label: 'Home Collection', href: '/services/home-collection' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    heading: 'Information',
    links: [
      { label: 'About Labville', href: '/about' },
      { label: 'For Clinicians', href: '/professionals' },
      { label: 'Quality & Trust', href: '/quality' },
      { label: 'Resources', href: '/resources' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-bg-primary border-t border-white/8">
      <div className="max-w-[1400px] mx-auto px-[clamp(20px,5vw,80px)]">

        {/* Main grid */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-science flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="2.5" fill="white" />
                  <circle cx="8" cy="2.5" r="1.5" fill="white" opacity="0.7" />
                  <circle cx="8" cy="13.5" r="1.5" fill="white" opacity="0.7" />
                  <circle cx="2.5" cy="8" r="1.5" fill="white" opacity="0.7" />
                  <circle cx="13.5" cy="8" r="1.5" fill="white" opacity="0.7" />
                  <line x1="8" y1="4" x2="8" y2="5.5" stroke="white" strokeWidth="1" opacity="0.5" />
                  <line x1="8" y1="10.5" x2="8" y2="12" stroke="white" strokeWidth="1" opacity="0.5" />
                  <line x1="4" y1="8" x2="5.5" y2="8" stroke="white" strokeWidth="1" opacity="0.5" />
                  <line x1="10.5" y1="8" x2="12" y2="8" stroke="white" strokeWidth="1" opacity="0.5" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-semibold text-white tracking-[-0.01em]">
                  Labville
                </span>
                <span className="text-[10px] text-text-muted font-medium tracking-[0.06em] uppercase">
                  Diagnostic Centre
                </span>
              </div>
            </Link>

            <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
              Advanced laboratory diagnostics, medical imaging and health screening
              for better clinical decisions.
            </p>

            {/* Contact info */}
            <div className="space-y-2.5 text-sm">
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors"
              >
                <span className="text-accent-cyan">↗</span>
                {contact.phone}
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors"
              >
                <span className="text-accent-cyan">↗</span>
                {contact.email}
              </a>
              <address
                className="not-italic text-text-secondary leading-relaxed text-xs max-w-xs"
              >
                {contact.address.full}
              </address>
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-text-muted mb-5">
                {col.heading}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-white transition-colors duration-150"
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
        <div className="border-t border-white/8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} Labville Diagnostic Centre. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/contact"
              className="text-xs text-text-muted hover:text-white transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/resources"
              className="text-xs text-text-muted hover:text-white transition-colors"
            >
              Resources
            </Link>
            {/* Placeholder for privacy/terms when Labville provides them */}
            <span className="text-xs text-text-muted/40 cursor-default" title="Coming soon">
              Privacy Policy
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
