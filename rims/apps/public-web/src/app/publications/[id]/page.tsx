import { notFound } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';

interface Author {
  authorOrder: number;
  isCorresponding: boolean;
  employee: { firstName: string; lastName: string };
}

interface Manuscript {
  id: string;
  title: string;
  abstract?: string | null;
  doi?: string | null;
  url?: string | null;
  targetJournal?: string | null;
  publishedAt?: string | null;
  authors?: Author[];
}

interface PublicationDetail {
  id: string;
  publicSummaryOverride?: string | null;
  manuscript: Manuscript;
}

interface Props {
  params: { id: string };
}

export default async function PublicationDetailPage({ params }: Props) {
  const data = await apiFetch<PublicationDetail>(`/publications/${params.id}`);

  if (!data) notFound();

  const { manuscript } = data;
  const authorNames = (manuscript.authors ?? [])
    .sort((a, b) => a.authorOrder - b.authorOrder)
    .map(
      (a) =>
        `${a.employee.firstName} ${a.employee.lastName}${a.isCorresponding ? '*' : ''}`,
    )
    .join(', ');

  return (
    <>
      <PageHeader title={manuscript.title} />
      <article className="max-w-3xl mx-auto py-12 px-6">
        {authorNames && (
          <p className="text-slate-600 mb-4">{authorNames}</p>
        )}

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-8">
          {manuscript.targetJournal && (
            <>
              <dt className="font-semibold text-slate-700">Journal</dt>
              <dd className="text-slate-600">{manuscript.targetJournal}</dd>
            </>
          )}
          {manuscript.publishedAt && (
            <>
              <dt className="font-semibold text-slate-700">Published</dt>
              <dd className="text-slate-600">
                {new Date(manuscript.publishedAt).getFullYear()}
              </dd>
            </>
          )}
          {manuscript.doi && (
            <>
              <dt className="font-semibold text-slate-700">DOI</dt>
              <dd>
                <a
                  href={`https://doi.org/${manuscript.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 hover:underline"
                >
                  {manuscript.doi}
                </a>
              </dd>
            </>
          )}
        </dl>

        {data.publicSummaryOverride ? (
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Summary</h2>
            <p className="text-slate-600">{data.publicSummaryOverride}</p>
          </div>
        ) : manuscript.abstract ? (
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Abstract</h2>
            <p className="text-slate-600">{manuscript.abstract}</p>
          </div>
        ) : null}

        {manuscript.url && (
          <div className="mt-8">
            <a
              href={manuscript.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-700 transition-colors"
            >
              View full publication ↗
            </a>
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-slate-200">
          <a href="/publications" className="text-brand-600 font-medium hover:underline text-sm">
            ← Back to Publications
          </a>
        </div>
      </article>
    </>
  );
}
