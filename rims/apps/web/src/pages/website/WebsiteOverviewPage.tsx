import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader, Button, Badge } from '@rims/ui';
import { toast } from '@rims/ui';
import api from '../../lib/api';
import { useAuthStore } from '../../store/auth.store';

interface Website {
  id: string;
  name: string;
  status: string;
  primaryDomainId?: string | null;
  domains?: { id: string; hostname: string; isPrimary: boolean }[];
  branding?: { tagline?: string | null } | null;
}

function statusVariant(status: string): string {
  switch (status) {
    case 'PUBLISHED': return 'active';
    case 'SETUP': return 'pending';
    case 'DRAFT': return 'default';
    case 'SUSPENDED': return 'suspended';
    default: return 'default';
  }
}

export function WebsiteOverviewPage() {
  const navigate = useNavigate();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const queryClient = useQueryClient();

  const { data: website, isLoading, error } = useQuery({
    queryKey: ['institutional-web'],
    queryFn: () =>
      api.get<Website>('/institutional-web').then((r) => r.data),
  });

  const provisionMutation = useMutation({
    mutationFn: () => api.post('/institutional-web/provision').then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Website provisioned', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['institutional-web'] });
    },
    onError: (err: Error) =>
      toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  const publishMutation = useMutation({
    mutationFn: () => api.post('/institutional-web/publish').then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Website published', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['institutional-web'] });
    },
    onError: (err: Error) =>
      toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  const primaryDomain = website?.domains?.find((d) => d.isPrimary);

  return (
    <div>
      <PageHeader
        title="Website Overview"
        actions={
          <div className="flex gap-2">
            {hasPermission('website.settings.manage') && !website && !isLoading && (
              <Button
                onClick={() => provisionMutation.mutate()}
                loading={provisionMutation.isPending}
              >
                Provision Website
              </Button>
            )}
            {hasPermission('website.settings.manage') &&
              website &&
              website.status !== 'PUBLISHED' && (
                <Button
                  variant="primary"
                  onClick={() => publishMutation.mutate()}
                  loading={publishMutation.isPending}
                >
                  Publish Website
                </Button>
              )}
          </div>
        }
      />

      {isLoading && <p className="text-slate-500 mt-4">Loading…</p>}

      {!isLoading && !website && (
        <div className="mt-8 rounded-lg border border-dashed border-slate-300 p-12 text-center">
          <p className="text-slate-600 mb-4">Your institute website has not been set up yet.</p>
          {hasPermission('website.settings.manage') && (
            <Button
              onClick={() => provisionMutation.mutate()}
              loading={provisionMutation.isPending}
            >
              Set up Website
            </Button>
          )}
        </div>
      )}

      {website && (
        <div className="mt-6 space-y-6">
          {/* Status card */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">{website.name}</h2>
                {primaryDomain && (
                  <p className="text-sm text-slate-500 mt-1">{primaryDomain.hostname}</p>
                )}
              </div>
              <Badge variant={statusVariant(website.status)} label={website.status} />
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { path: '/website/branding', label: 'Branding', desc: 'Logo, colors, contact info' },
              { path: '/website/pages', label: 'Pages', desc: 'Manage website pages' },
              { path: '/website/news', label: 'News', desc: 'News & announcements' },
              { path: '/website/events', label: 'Events', desc: 'Upcoming events' },
              { path: '/website/team', label: 'Team & Researchers', desc: 'Researcher profiles' },
              { path: '/website/partners', label: 'Partners', desc: 'Partner organisations' },
              { path: '/website/opportunities', label: 'Opportunities', desc: 'Jobs & fellowships' },
              { path: '/website/publications', label: 'Publications', desc: 'Link manuscripts' },
              { path: '/website/faqs', label: 'FAQs', desc: 'Frequently asked questions' },
              { path: '/website/resources', label: 'Resources', desc: 'Downloadable resources' },
              { path: '/website/contact', label: 'Contact Submissions', desc: 'Inbound enquiries' },
              { path: '/website/domains', label: 'Domains', desc: 'Custom domain setup' },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="bg-white rounded-lg border border-slate-200 p-4 text-left hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <p className="text-sm font-medium text-slate-700">{item.label}</p>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
