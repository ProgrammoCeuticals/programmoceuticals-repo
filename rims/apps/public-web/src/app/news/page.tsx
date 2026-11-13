import { apiFetch } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { NewsCard } from '@/components/NewsCard';
import { EmptyState } from '@/components/EmptyState';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  publishedAt?: string | null;
}

interface PaginatedResponse {
  data: NewsItem[];
}

export default async function NewsPage() {
  const data = await apiFetch<PaginatedResponse>('/news?pageSize=20');
  const items = data?.data ?? [];

  return (
    <>
      <PageHeader title="News" description="Latest news and updates from our institute." />
      <section aria-label="News articles" className="max-w-6xl mx-auto py-12 px-6">
        {items.length === 0 ? (
          <EmptyState message="No news articles published yet." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <NewsCard
                key={item.id}
                title={item.title}
                slug={item.slug}
                summary={item.summary}
                publishedAt={item.publishedAt}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
