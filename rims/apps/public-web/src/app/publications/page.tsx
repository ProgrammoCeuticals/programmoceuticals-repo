import { apiFetch } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { PublicationCard } from '@/components/PublicationCard';
import { EmptyState } from '@/components/EmptyState';

interface Author {
  authorOrder: number;
  employee: { firstName: string; lastName: string };
}

interface Manuscript {
  id: string;
  title: string;
  doi?: string | null;
  targetJournal?: string | null;
  publishedAt?: string | null;
  authors?: Author[];
}

interface PublicationLink {
  id: string;
  manuscript: Manuscript;
}

interface PaginatedResponse {
  data: PublicationLink[];
}

export default async function PublicationsPage() {
  const data = await apiFetch<PaginatedResponse>('/publications?pageSize=20');
  const items = data?.data ?? [];

  return (
    <>
      <PageHeader title="Publications" description="Peer-reviewed research from our institute." eyebrow="Scholarly Output" />
      <section aria-label="Publications list" className="max-w-7xl mx-auto py-12 px-6">
        {items.length === 0 ? (
          <EmptyState message="No publications available yet." />
        ) : (
          <div className="space-y-4">
            {items.map((link) => (
              <PublicationCard
                key={link.id}
                id={link.manuscript.id}
                title={link.manuscript.title}
                authors={link.manuscript.authors}
                targetJournal={link.manuscript.targetJournal}
                doi={link.manuscript.doi}
                publishedAt={link.manuscript.publishedAt}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
