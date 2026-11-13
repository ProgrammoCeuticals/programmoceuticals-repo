interface EventCardProps {
  title: string;
  summary?: string | null;
  startDatetime: string;
  venue?: string | null;
  isOnline?: boolean;
  slug: string;
}

export function EventCard({ title, summary, startDatetime, venue, isOnline, slug }: EventCardProps) {
  const d = new Date(startDatetime);
  const day   = d.toLocaleDateString('en-GB', { day: '2-digit' });
  const month = d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
  const time  = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <article className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-brand-300 hover:shadow-md transition-all group flex">
      {/* Date badge */}
      <div className="w-16 shrink-0 bg-brand-50 border-r border-slate-200 flex flex-col items-center justify-center py-4 group-hover:bg-brand-600 transition-colors">
        <span className="text-xl font-bold text-brand-600 group-hover:text-white transition-colors leading-none">{day}</span>
        <span className="text-xs font-semibold text-brand-400 group-hover:text-blue-200 transition-colors mt-0.5">{month}</span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h2 className="text-base font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
          <a href={`/events/${slug}`}>{title}</a>
        </h2>
        {summary && (
          <p className="mt-1.5 text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">{summary}</p>
        )}
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <span className="text-xs text-slate-400">{time}</span>
          {isOnline ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 inline-block" />
              Online
            </span>
          ) : venue ? (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {venue}
            </span>
          ) : null}
        </div>
        <a
          href={`/events/${slug}`}
          className="mt-3 inline-flex items-center gap-1 text-brand-600 font-medium text-sm hover:gap-2 transition-all"
        >
          View details
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </article>
  );
}
