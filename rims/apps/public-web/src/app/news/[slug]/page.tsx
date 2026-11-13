import { notFound } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';

interface Article {
  title: string;
  summary?: string | null;
  body?: string | null;
  publishedAt?: string | null;
  category?: string | null;
}

interface Props {
  params: { slug: string };
}

export default async function NewsArticlePage({ params }: Props) {
  const article = await apiFetch<Article>(`/news/${params.slug}`);

  if (!article) notFound();

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <>
      <PageHeader title={article.title} description={article.summary ?? undefined} />
      <article className="max-w-3xl mx-auto py-12 px-6">
        <div className="flex items-center gap-4 mb-8 text-sm text-slate-500">
          {article.category && (
            <span className="bg-slate-100 px-2.5 py-0.5 rounded-full">{article.category}</span>
          )}
          {formattedDate && (
            <time dateTime={article.publishedAt ?? undefined}>{formattedDate}</time>
          )}
        </div>
        {article.body ? (
          // Body is staff-authored CMS content, not user-supplied input
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />
        ) : (
          <p className="text-slate-500">Full content coming soon.</p>
        )}
        <div className="mt-12 pt-6 border-t border-slate-200">
          <a href="/news" className="text-brand-600 font-medium hover:underline text-sm">
            ← Back to News
          </a>
        </div>
      </article>
    </>
  );
}
