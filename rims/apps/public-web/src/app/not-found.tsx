import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';

export default function NotFound() {
  return (
    <>
      <PageHeader title="Page Not Found" description="The page you are looking for does not exist." />
      <div className="py-16">
        <EmptyState message="Try navigating back to the home page." />
        <div className="text-center mt-6">
          <a href="/" className="text-brand-600 font-medium hover:underline">
            ← Back to home
          </a>
        </div>
      </div>
    </>
  );
}
