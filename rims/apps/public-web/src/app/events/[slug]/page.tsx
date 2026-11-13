import { notFound } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';

interface EventDetail {
  title: string;
  summary?: string | null;
  description?: string | null;
  startDatetime: string;
  endDatetime?: string | null;
  timezone?: string;
  venue?: string | null;
  isOnline?: boolean;
  registrationUrl?: string | null;
}

interface Props {
  params: { slug: string };
}

export default async function EventDetailPage({ params }: Props) {
  const event = await apiFetch<EventDetail>(`/events/${params.slug}`);

  if (!event) notFound();

  const formatDate = (dt: string) =>
    new Date(dt).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <>
      <PageHeader title={event.title} description={event.summary ?? undefined} />
      <article className="max-w-3xl mx-auto py-12 px-6">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-sm">
          <div>
            <dt className="font-semibold text-slate-700">Start</dt>
            <dd className="text-slate-600">
              <time dateTime={event.startDatetime}>{formatDate(event.startDatetime)}</time>
            </dd>
          </div>
          {event.endDatetime && (
            <div>
              <dt className="font-semibold text-slate-700">End</dt>
              <dd className="text-slate-600">
                <time dateTime={event.endDatetime}>{formatDate(event.endDatetime)}</time>
              </dd>
            </div>
          )}
          {event.venue && (
            <div>
              <dt className="font-semibold text-slate-700">Venue</dt>
              <dd className="text-slate-600">{event.venue}</dd>
            </div>
          )}
          {event.isOnline && (
            <div>
              <dt className="font-semibold text-slate-700">Format</dt>
              <dd className="text-slate-600">Online event</dd>
            </div>
          )}
        </dl>

        {event.description && (
          <div className="prose prose-slate max-w-none">
            <p>{event.description}</p>
          </div>
        )}

        {event.registrationUrl && (
          <div className="mt-8">
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-700 transition-colors"
            >
              Register now
            </a>
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-slate-200">
          <a href="/events" className="text-brand-600 font-medium hover:underline text-sm">
            ← Back to Events
          </a>
        </div>
      </article>
    </>
  );
}
