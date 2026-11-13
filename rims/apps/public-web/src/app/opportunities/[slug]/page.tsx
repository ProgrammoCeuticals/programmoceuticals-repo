import { notFound } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';

interface Opportunity {
  title: string;
  summary?: string | null;
  body?: string | null;
  opportunityType: string;
  department?: string | null;
  location?: string | null;
  isRemote?: boolean;
  closingDate?: string | null;
  applicationUrl?: string | null;
}

interface Props {
  params: { slug: string };
}

export default async function OpportunityDetailPage({ params }: Props) {
  const opp = await apiFetch<Opportunity>(`/opportunities/${params.slug}`);

  if (!opp) notFound();

  const formattedClosing = opp.closingDate
    ? new Date(opp.closingDate).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <>
      <PageHeader title={opp.title} description={opp.summary ?? undefined} />
      <article className="max-w-3xl mx-auto py-12 px-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600 border border-brand-100">
            {opp.opportunityType.replace(/_/g, ' ')}
          </span>
          {opp.isRemote && (
            <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 border border-green-200">
              Remote
            </span>
          )}
        </div>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-8">
          {opp.department && (
            <>
              <dt className="font-semibold text-slate-700">Department</dt>
              <dd className="text-slate-600">{opp.department}</dd>
            </>
          )}
          {opp.location && (
            <>
              <dt className="font-semibold text-slate-700">Location</dt>
              <dd className="text-slate-600">{opp.location}</dd>
            </>
          )}
          {formattedClosing && (
            <>
              <dt className="font-semibold text-slate-700">Closing date</dt>
              <dd className="text-slate-600">
                <time dateTime={opp.closingDate ?? undefined}>{formattedClosing}</time>
              </dd>
            </>
          )}
        </dl>

        {opp.body && (
          <div className="prose prose-slate max-w-none mb-8">
            <p>{opp.body}</p>
          </div>
        )}

        {opp.applicationUrl && (
          <a
            href={opp.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-brand-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-700 transition-colors"
          >
            Apply now
          </a>
        )}

        <div className="mt-12 pt-6 border-t border-slate-200">
          <a href="/opportunities" className="text-brand-600 font-medium hover:underline text-sm">
            ← Back to Opportunities
          </a>
        </div>
      </article>
    </>
  );
}
