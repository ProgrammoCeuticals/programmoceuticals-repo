import { apiFetch } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { OpportunityCard } from '@/components/OpportunityCard';
import { EmptyState } from '@/components/EmptyState';

interface Opportunity {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  opportunityType: string;
  closingDate?: string | null;
  department?: string | null;
}

interface PaginatedResponse {
  data: Opportunity[];
}

interface Props {
  searchParams: { type?: string };
}

export default async function OpportunitiesPage({ searchParams }: Props) {
  const type = searchParams.type ?? '';
  const path = type ? `/opportunities?type=${type}&pageSize=20` : '/opportunities?pageSize=20';
  const data = await apiFetch<PaginatedResponse>(path);
  const items = data?.data ?? [];

  const types = [
    { value: '', label: 'All Types' },
    { value: 'VACANCY', label: 'Vacancies' },
    { value: 'CALL_FOR_PAPERS', label: 'Call for Papers' },
    { value: 'VOLUNTEER_CALL', label: 'Volunteer Calls' },
    { value: 'FELLOWSHIP', label: 'Fellowships' },
    { value: 'INTERNSHIP', label: 'Internships' },
  ];

  return (
    <>
      <PageHeader
        title="Opportunities"
        description="Join our team or collaborate with us."
      />
      <section aria-label="Opportunities" className="max-w-6xl mx-auto py-12 px-6">
        {/* Type filter */}
        <nav aria-label="Filter by type" className="flex flex-wrap gap-2 mb-8">
          {types.map((t) => (
            <a
              key={t.value}
              href={t.value ? `/opportunities?type=${t.value}` : '/opportunities'}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                type === t.value
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.label}
            </a>
          ))}
        </nav>

        {items.length === 0 ? (
          <EmptyState message="No opportunities available at this time." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
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
      </section>
    </>
  );
}
