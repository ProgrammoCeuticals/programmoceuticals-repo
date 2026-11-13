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

export default async function AboutPage() {
  const page = await apiFetch<Page>('/pages/about');

  return (
    <>
      <PageHeader
        title={page?.title ?? 'About the Institute'}
        description={page?.summary ?? undefined}
        eyebrow="Who We Are"
      />
      <div className="max-w-7xl mx-auto py-12 px-6">
        {!page ? (
          <EmptyState message="This page is not available yet." />
        ) : page.sections.length === 0 ? (
          <EmptyState message="Content coming soon." />
        ) : (
          page.sections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))
        )}
      </div>
    </>
  );
}
