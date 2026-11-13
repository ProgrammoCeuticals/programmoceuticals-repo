interface Author {
  authorOrder: number;
  employee: { firstName: string; lastName: string };
}

interface PublicationCardProps {
  title: string;
  authors?: Author[];
  targetJournal?: string | null;
  doi?: string | null;
  publishedAt?: string | null;
  id: string;
}

export function PublicationCard({
  title, authors, targetJournal, doi, publishedAt, id,
}: PublicationCardProps) {
  const authorNames = (authors ?? [])
    .sort((a, b) => a.authorOrder - b.authorOrder)
    .map((a) => `${a.employee.firstName} ${a.employee.lastName}`)
    .join(', ');

  const year = publishedAt ? new Date(publishedAt).getFullYear() : null;

  return (
    <article className="bg-white border border-slate-200 rounded-lg p-6 hover:border-brand-300 hover:shadow-md transition-all group">
      {/* Journal + year row */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        {targetJournal && (
          <span className="text-xs font-medium text-brand-600 bg-brand-50 border border-brand-100 px-2.5 py-0.5 rounded-full">
            {targetJournal}
          </span>
        )}
        {year && (
          <span className="text-xs text-slate-400 font-medium">{year}</span>
        )}
      </div>

      <h2 className="text-base font-semibold text-slate-900 leading-snug group-hover:text-brand-600 transition-colors">
        <a href={`/publications/${id}`}>{title}</a>
      </h2>

      {authorNames && (
        <p className="mt-2 text-sm text-slate-500 line-clamp-1">{authorNames}</p>
      )}

      {doi && (
        <a
          href={`https://doi.org/${doi}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-brand-600 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          DOI: {doi}
        </a>
      )}
    </article>
  );
}
