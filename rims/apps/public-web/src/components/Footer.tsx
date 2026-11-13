interface Branding {
  copyrightStatement?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  address?: string | null;
  socialLinksJson?: Record<string, string> | null;
}

interface FooterProps {
  branding?: Branding | null;
}

const NAV_GROUPS = [
  {
    heading: 'Institute',
    links: [
      { label: 'About Us',    href: '/about' },
      { label: 'Our Team',    href: '/team' },
      { label: 'Partners',    href: '/partners' },
      { label: 'Contact',     href: '/contact' },
    ],
  },
  {
    heading: 'Research',
    links: [
      { label: 'Research Areas',  href: '/research' },
      { label: 'Publications',    href: '/publications' },
      { label: 'Resources',       href: '/resources' },
    ],
  },
  {
    heading: 'Engage',
    links: [
      { label: 'News',            href: '/news' },
      { label: 'Events',          href: '/events' },
      { label: 'Opportunities',   href: '/opportunities' },
    ],
  },
];

const SOCIAL_ICONS: Record<string, JSX.Element> = {
  twitter: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  researchgate: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a3.193 3.193 0 00-.112.437 8.365 8.365 0 00-.078.53 9 9 0 00-.05.727c-.01.282-.013.621-.013 1.016a31.121 31.123 0 00.014 1.017 9 9 0 00.05.727 7.946 7.946 0 00.077.53c.02.148.056.29.112.437.243.743.65 1.303 1.213 1.68.565.376 1.255.564 2.073.564.818 0 1.508-.188 2.073-.563.565-.377.97-.937 1.213-1.68a3.193 3.193 0 00.112-.437 8.365 8.365 0 00.078-.53 9 9 0 00.05-.727c.01-.282.013-.621.013-1.017 0-.395-.003-.734-.013-1.016a9 9 0 00-.05-.727 7.946 7.946 0 00-.077-.53 3.193 3.193 0 00-.112-.437c-.243-.744-.648-1.303-1.213-1.68C21.094.19 20.404 0 19.586 0zm-7.953 0C9.768 0 8.17.88 7.099 2.64L4.62 6.898V.424H0v23.152h4.62v-7.045l2.532 4.31C8.17 22.6 9.768 23.576 11.633 23.576c1.865 0 3.463-.976 4.793-2.735l-3.29-5.6c-.565.94-1.213 1.41-1.944 1.41-.73 0-1.378-.47-1.944-1.41L5.956 9.633l3.29-5.6c.566-.94 1.214-1.41 1.944-1.41.73 0 1.379.47 1.944 1.41l3.29-5.6C15.096.976 13.498 0 11.633 0z" />
    </svg>
  ),
};

export function Footer({ branding }: FooterProps) {
  const year = new Date().getFullYear();
  const copyright = branding?.copyrightStatement ?? `© ${year} Research Institute. All rights reserved.`;
  const socials = branding?.socialLinksJson ?? {};

  return (
    <footer role="contentinfo" className="bg-slate-900 text-slate-400">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="md:col-span-2">
            <a href="/" className="flex items-center gap-3 mb-4 group">
              <span className="flex items-center justify-center w-8 h-8 rounded bg-brand-600 text-white text-xs font-bold shrink-0">
                RI
              </span>
              <span className="text-white font-bold text-lg tracking-tight">Research Institute</span>
            </a>
            <p className="text-sm leading-relaxed max-w-xs">
              A multidisciplinary research institution advancing pharmaceutical science, regulatory knowledge, and global health outcomes.
            </p>

            {/* Social links */}
            {Object.keys(socials).length > 0 && (
              <div className="mt-6 flex gap-3">
                {Object.entries(socials).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform}
                    className="w-8 h-8 flex items-center justify-center rounded border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
                  >
                    {SOCIAL_ICONS[platform.toLowerCase()] ?? (
                      <span className="text-xs capitalize">{platform[0]}</span>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Nav groups */}
          {NAV_GROUPS.map((group) => (
            <div key={group.heading}>
              <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">{group.heading}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact row */}
        {(branding?.contactEmail || branding?.contactPhone || branding?.address) && (
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap gap-6 text-sm">
            {branding.contactEmail && (
              <a href={`mailto:${branding.contactEmail}`} className="hover:text-white transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                {branding.contactEmail}
              </a>
            )}
            {branding.contactPhone && (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                {branding.contactPhone}
              </span>
            )}
            {branding.address && (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {branding.address}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>{copyright}</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="/terms"   className="hover:text-slate-300 transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
