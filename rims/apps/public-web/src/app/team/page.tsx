import { apiFetch } from '@/lib/api';
import { PageHeader } from '@/components/PageHeader';
import { TeamProfileCard } from '@/components/TeamProfileCard';
import { EmptyState } from '@/components/EmptyState';

interface TeamProfile {
  id: string;
  displayName: string;
  role?: string | null;
  department?: string | null;
  biography?: string | null;
  photoUrl?: string | null;
}

export default async function TeamPage() {
  const items = await apiFetch<TeamProfile[]>('/team');
  const profiles = items ?? [];

  return (
    <>
      <PageHeader title="Our Team" description="Meet the researchers and staff driving our mission." eyebrow="People" />
      <section aria-label="Team profiles" className="max-w-7xl mx-auto py-12 px-6">
        {profiles.length === 0 ? (
          <EmptyState message="Team profiles coming soon." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {profiles.map((profile) => (
              <TeamProfileCard
                key={profile.id}
                displayName={profile.displayName}
                role={profile.role}
                department={profile.department}
                biography={profile.biography}
                photoUrl={profile.photoUrl}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
