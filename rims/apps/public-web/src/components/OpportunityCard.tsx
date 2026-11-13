interface OpportunityCardProps {
  title: string;
  summary?: string | null;
  opportunityType: string;
  closingDate?: string | null;
  department?: string | null;
  slug: string;
}

const TYPE_LABELS: Record<string, string> = {
  VACANCY:            'Vacancy',
  INTERNSHIP:         'Internship',
  FELLOWSHIP:         'Fellowship',
  GRADUATE:           'Graduate',
  VOLUNTEER:          'Volunteer',
  RESEARCH_ASSISTANT: 'Research Assistant',
};

export function OpportunityCard({
  title, summary, opportunityType, closingDate, department, slug,
}: OpportunityCardProps) {
  const formattedClosing = closingDate
    ? new Date(closingDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  const typeLabel = TYPE_LABELS[opportunityType] ?? opportunityType.replace(/_/g, ' ');

  const isClosingSoon = closingDate
    ? (new Date(closingDate).getTime() - Date.now()) < 7 * 24 * 60 * 60 * 1000
    : false;

  return (
    <article className="bg-white border border-slate-200 rounded-lg p-6 hover:border-brand-300 hover:shadow-md transition-all group flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="inline-flex items-center text-xs font-semibold text-brand-600 bg-brand-50 border border-brand-100 px-2.5 py-1 rounded-full">
          {typeLabel}
        </span>
        {isClosingSoon && (
          <span className="inline-flex items-center text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            Closing soon
          </span>
        )}
      </div>

      <h2 className="text-base font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
        <a href={`/opportunities/${slug}`}>{title}</a>
      </h2>

      {department && (
        <p className="mt-1 text-xs text-slate-400 font-medium uppercase tracking-wide">{department}</p>
      )}

      {summary && (
        <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">{summary}</p>
      )}

      {formattedClosing && (
        <p className="mt-3 text-xs text-slate-400 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          Closes <time dateTime={closingDate ?? undefined}>{formattedClosing}</time>
        </p>
      )}

      <a
        href={`/opportunities/${slug}`}
        className="mt-4 inline-flex items-center gap-1 text-brand-600 font-medium text-sm hover:gap-2 transition-all"
      >
        Learn more
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
    </article>
  );
}
