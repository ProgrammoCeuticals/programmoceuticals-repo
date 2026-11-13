import { apiFetch } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { SectionRenderer } from '@/components/SectionRenderer';
import { EmptyState } from '@/components/EmptyState';

interface Section {
  id: string;
  sectionType: string;
  sortOrder: number;
  configJson: Record<string, unknown>;
}

interface Page {
  title: string;
  summary?: string | null;
  sections: Section[];
}

export default async function ResearchPage() {
  const page = await apiFetch<Page>('/pages/research');

  return (
    <>
      <PageHeader
        title={page?.title ?? 'Research'}
        description={page?.summary ?? undefined}
        eyebrow="Our Work"
      />
      <div className="max-w-7xl mx-auto py-12 px-6">
        {!page || page.sections.length === 0 ? (
          <EmptyState message="Research content coming soon." />
        ) : (
          page.sections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))
        )}
      </div>
    </>
  );
}
