import { apiFetch } from '@/lib/api';
import { MobileMenu } from './MobileMenu';

interface NavItem {
  id: string;
  label: string;
  linkType: string;
  externalUrl?: string | null;
  pageId?: string | null;
  parentId?: string | null;
  sortOrder: number;
}

interface Navigation {
  id: string;
  location: string;
  items: NavItem[];
}

interface SiteInfo {
  name?: string;
}

const FALLBACK_NAV: NavItem[] = [
  { id: '1', label: 'About',        linkType: 'internal', pageId: 'about',        parentId: null, sortOrder: 1 },
  { id: '2', label: 'Research',     linkType: 'internal', pageId: 'research',     parentId: null, sortOrder: 2 },
  { id: '3', label: 'Publications', linkType: 'internal', pageId: 'publications', parentId: null, sortOrder: 3 },
  { id: '4', label: 'Team',         linkType: 'internal', pageId: 'team',         parentId: null, sortOrder: 4 },
  { id: '5', label: 'News',         linkType: 'internal', pageId: 'news',         parentId: null, sortOrder: 5 },
  { id: '6', label: 'Contact',      linkType: 'internal', pageId: 'contact',      parentId: null, sortOrder: 6 },
];

function getHref(item: NavItem): string {
  if (item.linkType === 'external' && item.externalUrl) return item.externalUrl;
  return item.pageId ? `/${item.pageId}` : '#';
}

export async function Navbar() {
  const [navData, siteData] = await Promise.all([
    apiFetch<Navigation[]>('/navigation'),
    apiFetch<SiteInfo>(''),
  ]);

  const primaryNav = navData?.find((n) => n.location === 'primary');
  const topLevelItems = (primaryNav?.items ?? FALLBACK_NAV).filter((i) => !i.parentId);
  const siteName = siteData?.name ?? 'RIMS';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-0 flex items-stretch justify-between">

        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-3 py-4 group"
          aria-label={`${siteName} — home`}
        >
          {/* Icon mark */}
          <span className="flex items-center justify-center w-8 h-8 rounded bg-brand-600 text-white text-xs font-bold shrink-0 group-hover:bg-brand-700 transition-colors">
            RI
          </span>
          <span className="text-slate-900 font-bold text-lg tracking-tight leading-none">
            {siteName}
          </span>
        </a>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-stretch">
          <ul className="flex items-stretch gap-1">
            {topLevelItems.map((item) => (
              <li key={item.id} className="flex items-stretch">
                <a
                  href={getHref(item)}
                  className="flex items-center px-4 text-sm font-medium text-slate-600 hover:text-brand-600 border-b-2 border-transparent hover:border-brand-600 transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA + mobile */}
        <div className="flex items-center gap-3">
          <a
            href="/contact"
            className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded transition-colors"
          >
            Get in Touch
          </a>
          <MobileMenu items={topLevelItems} siteName={siteName} />
        </div>
      </div>
    </header>
  );
}
