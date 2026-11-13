import { apiFetch } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';

interface Resource {
  id: string;
  title: string;
  description?: string | null;
  fileName?: string | null;
  mimeType?: string | null;
  category?: string | null;
}

export default async function ResourcesPage() {
  const items = await apiFetch<Resource[]>('/resources');
  const resources = items ?? [];

  return (
    <>
      <PageHeader title="Resources" description="Download reports, guides, and research materials." />
      <section aria-label="Resources" className="max-w-4xl mx-auto py-12 px-6">
        {resources.length === 0 ? (
          <EmptyState message="No resources available at this time." />
        ) : (
          <ul className="space-y-4" role="list">
            {resources.map((r) => (
              <li
                key={r.id}
                className="bg-white rounded-lg border border-slate-200 p-5 flex items-start justify-between gap-4"
              >
                <div>
                  <h2 className="font-semibold text-slate-800">{r.title}</h2>
                  {r.description && (
                    <p className="mt-1 text-sm text-slate-600">{r.description}</p>
                  )}
                  {r.category && (
                    <span className="mt-2 inline-block text-xs text-slate-500 bg-slate-100 rounded px-2 py-0.5">
                      {r.category}
                    </span>
                  )}
                </div>
                {r.fileName && (
                  <span className="shrink-0 text-xs text-slate-500">{r.fileName}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
