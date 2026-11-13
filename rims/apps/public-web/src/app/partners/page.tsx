import { apiFetch } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { PartnerCard } from '@/components/PartnerCard';
import { EmptyState } from '@/components/EmptyState';

interface Partner {
  id: string;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  websiteUrl?: string | null;
}

export default async function PartnersPage() {
  const items = await apiFetch<Partner[]>('/partners');
  const partners = items ?? [];

  return (
    <>
      <PageHeader title="Partners" description="Organisations we collaborate with." />
      <section aria-label="Partners" className="max-w-6xl mx-auto py-12 px-6">
        {partners.length === 0 ? (
          <EmptyState message="Partner information coming soon." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {partners.map((p) => (
              <PartnerCard
                key={p.id}
                name={p.name}
                description={p.description}
                logoUrl={p.logoUrl}
                websiteUrl={p.websiteUrl}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
