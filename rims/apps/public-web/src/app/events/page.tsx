import { apiFetch } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { EventCard } from '@/components/EventCard';
import { EmptyState } from '@/components/EmptyState';

interface EventItem {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  startDatetime: string;
  venue?: string | null;
  isOnline?: boolean;
}

interface PaginatedResponse {
  data: EventItem[];
}

export default async function EventsPage() {
  const data = await apiFetch<PaginatedResponse>('/events?pageSize=20');
  const items = data?.data ?? [];

  return (
    <>
      <PageHeader title="Events" description="Upcoming conferences, workshops, and seminars." />
      <section aria-label="Events list" className="max-w-6xl mx-auto py-12 px-6">
        {items.length === 0 ? (
          <EmptyState message="No upcoming events at this time." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <EventCard
                key={item.id}
                title={item.title}
                slug={item.slug}
                summary={item.summary}
                startDatetime={item.startDatetime}
                venue={item.venue}
                isOnline={item.isOnline}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
