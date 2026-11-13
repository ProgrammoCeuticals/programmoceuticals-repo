interface NewsCardProps {
  title: string;
  summary?: string | null;
  publishedAt?: string | null;
  slug: string;
}

export function NewsCard({ title, summary, publishedAt, slug }: NewsCardProps) {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-GB', {
        year: 'numeric', month: 'short', day: 'numeric',
      })
    : null;

  return (
    <article className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-brand-300 hover:shadow-md transition-all group flex flex-col">
      {/* Top accent bar */}
      <div className="h-1 bg-brand-600 w-0 group-hover:w-full transition-all duration-300" />

      <div className="p-6 flex flex-col flex-1">
        {formattedDate && (
          <time className="text-xs font-medium text-slate-400 uppercase tracking-wide" dateTime={publishedAt ?? undefined}>
            {formattedDate}
          </time>
        )}
        <h2 className="mt-2 text-base font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
          <a href={`/news/${slug}`}>{title}</a>
        </h2>
        {summary && (
          <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">{summary}</p>
        )}
        <a
          href={`/news/${slug}`}
          className="mt-4 inline-flex items-center gap-1 text-brand-600 font-medium text-sm hover:gap-2 transition-all"
        >
          Read more
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </article>
  );
}
