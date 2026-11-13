import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader, Button, FormField, Input } from '@rims/ui';
import { toast } from '@rims/ui';
import api from '../../lib/api';
import { useAuthStore } from '../../store/auth.store';

interface Branding {
  logoUrl?: string | null;
  logoDarkUrl?: string | null;
  tagline?: string | null;
  shortDescription?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  address?: string | null;
  socialLinksJson?: Record<string, string> | null;
  copyrightStatement?: string | null;
}

interface WebsiteWithBranding {
  branding?: Branding | null;
}

export function WebsiteBrandingPage() {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const queryClient = useQueryClient();
  const canEdit = hasPermission('website.branding.manage');

  const { data: website, isLoading } = useQuery({
    queryKey: ['institutional-web'],
    queryFn: () =>
      api.get<WebsiteWithBranding>('/institutional-web').then((r) => r.data),
  });

  const [form, setForm] = useState<Branding>({});

  useEffect(() => {
    if (website?.branding) {
      setForm(website.branding);
    }
  }, [website]);

  const mutation = useMutation({
    mutationFn: (values: Branding) =>
      api.patch('/institutional-web/branding', values).then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Branding saved', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['institutional-web'] });
    },
    onError: (err: Error) =>
      toast({ title: 'Failed to save', description: err.message, variant: 'error' }),
  });

  function set(key: keyof Branding, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  if (isLoading) return <div className="text-slate-500 mt-4">Loading…</div>;

  return (
    <div>
      <PageHeader
        title="Website Branding"
        actions={
          canEdit ? (
            <Button
              variant="primary"
              onClick={() => mutation.mutate(form)}
              loading={mutation.isPending}
            >
              Save Changes
            </Button>
          ) : undefined
        }
      />

      <div className="mt-6 bg-white rounded-lg border border-slate-200 p-6 space-y-4 max-w-2xl">
        <FormField label="Logo URL" htmlFor="brand-logo">
          <Input
            id="brand-logo"
            value={form.logoUrl ?? ''}
            onChange={(e) => set('logoUrl', e.target.value)}
            disabled={!canEdit}
            placeholder="https://..."
          />
        </FormField>

        <FormField label="Tagline" htmlFor="brand-tagline">
          <Input
            id="brand-tagline"
            value={form.tagline ?? ''}
            onChange={(e) => set('tagline', e.target.value)}
            disabled={!canEdit}
            placeholder="Advancing research…"
          />
        </FormField>

        <FormField label="Short Description" htmlFor="brand-desc">
          <Input
            id="brand-desc"
            value={form.shortDescription ?? ''}
            onChange={(e) => set('shortDescription', e.target.value)}
            disabled={!canEdit}
          />
        </FormField>

        <div className="grid grid-cols-3 gap-4">
          <FormField label="Primary Color" htmlFor="brand-primary">
            <Input
              id="brand-primary"
              value={form.primaryColor ?? ''}
              onChange={(e) => set('primaryColor', e.target.value)}
              disabled={!canEdit}
              placeholder="#1e3a5f"
            />
          </FormField>
          <FormField label="Secondary Color" htmlFor="brand-secondary">
            <Input
              id="brand-secondary"
              value={form.secondaryColor ?? ''}
              onChange={(e) => set('secondaryColor', e.target.value)}
              disabled={!canEdit}
              placeholder="#ffffff"
            />
          </FormField>
          <FormField label="Accent Color" htmlFor="brand-accent">
            <Input
              id="brand-accent"
              value={form.accentColor ?? ''}
              onChange={(e) => set('accentColor', e.target.value)}
              disabled={!canEdit}
              placeholder="#3b82f6"
            />
          </FormField>
        </div>

        <FormField label="Contact Email" htmlFor="brand-email">
          <Input
            id="brand-email"
            type="email"
            value={form.contactEmail ?? ''}
            onChange={(e) => set('contactEmail', e.target.value)}
            disabled={!canEdit}
          />
        </FormField>

        <FormField label="Contact Phone" htmlFor="brand-phone">
          <Input
            id="brand-phone"
            value={form.contactPhone ?? ''}
            onChange={(e) => set('contactPhone', e.target.value)}
            disabled={!canEdit}
          />
        </FormField>

        <FormField label="Address" htmlFor="brand-address">
          <Input
            id="brand-address"
            value={form.address ?? ''}
            onChange={(e) => set('address', e.target.value)}
            disabled={!canEdit}
          />
        </FormField>

        <FormField label="Copyright Statement" htmlFor="brand-copyright">
          <Input
            id="brand-copyright"
            value={form.copyrightStatement ?? ''}
            onChange={(e) => set('copyrightStatement', e.target.value)}
            disabled={!canEdit}
          />
        </FormField>
      </div>
    </div>
  );
}
