'use client';

import { useState } from 'react';

interface NavItem {
  label: string;
  linkType: string;
  externalUrl?: string | null;
  pageId?: string | null;
}

interface MobileMenuProps {
  items: NavItem[];
  siteName: string;
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        className="p-2 text-slate-600 hover:text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600 rounded"
      >
        {open ? (
          /* X icon */
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          /* Hamburger */
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-50"
        >
          <ul className="px-4 py-3 space-y-1">
            {items.map((item, idx) => {
              const href =
                item.linkType === 'external'
                  ? (item.externalUrl ?? '#')
                  : item.pageId
                  ? `/${item.pageId}`
                  : '#';
              return (
                <li key={idx}>
                  <a
                    href={href}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 text-slate-700 hover:text-brand-600 hover:bg-slate-50 rounded text-sm font-medium transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
            <li className="pt-2 border-t border-slate-100">
              <a
                href="/contact"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-white bg-brand-600 hover:bg-brand-700 rounded text-sm font-medium text-center transition-colors"
              >
                Get in Touch
              </a>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
