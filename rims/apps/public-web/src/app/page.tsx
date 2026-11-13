import { apiFetch } from '@/lib/api';
import { HeroSection } from '@/components/HeroSection';
import { NewsCard } from '@/components/NewsCard';
import { EventCard } from '@/components/EventCard';
import { OpportunityCard } from '@/components/OpportunityCard';
import { EmptyState } from '@/components/EmptyState';

interface SiteInfo {
  name?: string;
  branding?: { tagline?: string | null; shortDescription?: string | null } | null;
}

interface NewsItem {
  id: string; title: string; slug: string;
  summary?: string | null; publishedAt?: string | null;
}

interface EventItem {
  id: string; title: string; slug: string;
  summary?: string | null; startDatetime: string;
  venue?: string | null; isOnline?: boolean;
}

interface OpportunityItem {
  id: string; title: string; slug: string;
  summary?: string | null; opportunityType: string;
  closingDate?: string | null; department?: string | null;
}

interface PaginatedResponse<T> { data: T[]; }

const RESEARCH_AREAS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.607L5 14.5m14.8.5l.39 1.561a2.25 2.25 0 01-2.186 2.814H5.996a2.25 2.25 0 01-2.186-2.814L4.2 15" />
      </svg>
    ),
    title: 'Drug Development',
    description: 'Advancing novel therapeutic compounds from discovery through preclinical and clinical evaluation.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    title: 'Regulatory Science',
    description: 'Developing frameworks and evidence to support safe, effective, and timely regulatory decisions.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    title: 'Clinical Pharmacology',
    description: 'Investigating drug behaviour in human populations to optimise dosing and therapeutic outcomes.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Pharmacovigilance',
    description: 'Monitoring and evaluating the safety of medicines throughout their lifecycle in real-world use.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
    title: 'Health Data Science',
    description: 'Applying computational methods and real-world data to generate health insights at scale.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'Global Health Policy',
    description: 'Shaping evidence-based policies to improve equitable access to medicines worldwide.',
  },
];

const STATS = [
  { value: '120+', label: 'Published Studies' },
  { value: '48',   label: 'Active Researchers' },
  { value: '18',   label: 'Partner Institutions' },
  { value: '12',   label: 'Years of Research' },
];

export default async function HomePage() {
  const [siteData, newsData, eventsData, oppsData] = await Promise.all([
    apiFetch<SiteInfo>(''),
    apiFetch<PaginatedResponse<NewsItem>>('/news?pageSize=3'),
    apiFetch<PaginatedResponse<EventItem>>('/events?pageSize=3'),
    apiFetch<PaginatedResponse<OpportunityItem>>('/opportunities?pageSize=3'),
  ]);

  const siteName  = siteData?.name ?? 'Research Institute';
  const tagline   = siteData?.branding?.tagline ?? `Advancing Knowledge. Informing Policy. Improving Lives.`;
  const subtext   = siteData?.branding?.shortDescription ?? `${siteName} is a multidisciplinary research institution dedicated to generating rigorous evidence that shapes pharmaceutical regulation, clinical practice, and global health outcomes.`;

  const news   = newsData?.data   ?? [];
  const events = eventsData?.data ?? [];
  const opps   = oppsData?.data   ?? [];

  return (
    <>
      <HeroSection
        headline={tagline}
        subtext={subtext}
        ctaLabel="Explore Our Research"
        ctaHref="/research"
      />

      {/* Stats strip */}
      <section aria-label="Key statistics" className="bg-brand-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="mt-1 text-sm text-blue-200 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Research areas */}
      <section aria-label="Research areas" className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-2">What We Study</p>
            <h2 className="text-3xl font-bold text-slate-900">Research Areas</h2>
            <p className="mt-3 text-slate-500 max-w-xl">
              Our work spans the full spectrum of pharmaceutical and health sciences research.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESEARCH_AREAS.map((area) => (
              <div
                key={area.title}
                className="bg-white border border-slate-200 rounded-lg p-6 hover:border-brand-300 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded bg-brand-50 text-brand-600 mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  {area.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{area.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{area.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a href="/research" className="inline-flex items-center gap-2 text-brand-600 font-semibold text-sm hover:underline">
              View all research programmes
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* News */}
      <section aria-label="Latest news" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-2">Stay Informed</p>
              <h2 className="text-3xl font-bold text-slate-900">Latest News</h2>
            </div>
            <a href="/news" className="text-sm font-medium text-brand-600 hover:underline hidden sm:block">
              All news →
            </a>
          </div>
          {news.length === 0 ? (
            <EmptyState message="No news articles published yet." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((item) => (
                <NewsCard
                  key={item.id}
                  title={item.title}
                  slug={item.slug}
                  summary={item.summary}
                  publishedAt={item.publishedAt}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Events */}
      <section aria-label="Upcoming events" className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-2">Mark Your Calendar</p>
              <h2 className="text-3xl font-bold text-slate-900">Upcoming Events</h2>
            </div>
            <a href="/events" className="text-sm font-medium text-brand-600 hover:underline hidden sm:block">
              All events →
            </a>
          </div>
          {events.length === 0 ? (
            <EmptyState message="No upcoming events." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((item) => (
                <EventCard
                  key={item.id}
                  title={item.title}
                  slug={item.slug}
                  summary={item.summary}
                  startDatetime={item.startDatetime}
                  venue={item.venue}
                  isOnline={item.isOnline}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Opportunities */}
      <section aria-label="Opportunities" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-2">Join Us</p>
              <h2 className="text-3xl font-bold text-slate-900">Opportunities</h2>
            </div>
            <a href="/opportunities" className="text-sm font-medium text-brand-600 hover:underline hidden sm:block">
              All opportunities →
            </a>
          </div>
          {opps.length === 0 ? (
            <EmptyState message="No open opportunities at this time." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {opps.map((item) => (
                <OpportunityCard
                  key={item.id}
                  title={item.title}
                  slug={item.slug}
                  summary={item.summary}
                  opportunityType={item.opportunityType}
                  closingDate={item.closingDate}
                  department={item.department}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA banner */}
      <section aria-label="Call to action" className="bg-brand-950 text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Collaborate With Us</h2>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            We welcome partnerships with academic institutions, regulatory bodies, industry, and civil society organisations committed to advancing evidence-based health outcomes.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded transition-colors"
          >
            Get in Touch
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}
