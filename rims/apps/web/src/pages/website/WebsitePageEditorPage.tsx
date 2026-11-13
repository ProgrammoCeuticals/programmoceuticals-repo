import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader, Button, Badge, FormField, Input, Select, Modal } from '@rims/ui';
import { toast } from '@rims/ui';
import api from '../../lib/api';
import { useAuthStore } from '../../store/auth.store';

interface Section {
  id: string;
  sectionType: string;
  sortOrder: number;
  configJson: Record<string, unknown>;
  isVisible: boolean;
}

interface PageDetail {
  id: string;
  title: string;
  publicTitle?: string | null;
  slug: string;
  status: string;
  summary?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  sections: Section[];
}

const SECTION_TYPES = [
  'HERO', 'RICH_TEXT', 'IMAGE_TEXT', 'STATISTICS', 'CTA',
  'FEATURED_PUBLICATIONS', 'NEWS_CARDS', 'EVENT_LISTINGS',
  'OPPORTUNITY_LISTINGS', 'TEAM_PROFILES', 'PARTNER_LOGOS',
  'CONTACT_FORM', 'FAQ_ACCORDION',
];

function statusVariant(status: string): string {
  switch (status) {
    case 'PUBLISHED': return 'active';
    case 'DRAFT': return 'default';
    case 'APPROVED': return 'pending';
    case 'SUBMITTED': return 'pending';
    case 'ARCHIVED': return 'suspended';
    default: return 'default';
  }
}

export function WebsitePageEditorPage() {
  const { id } = useParams<{ id: string }>();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const queryClient = useQueryClient();

  const { data: page, isLoading } = useQuery({
    queryKey: ['website-page', id],
    queryFn: () =>
      api.get<PageDetail>(`/institutional-web/pages/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const [form, setForm] = useState({
    title: '', publicTitle: '', slug: '', summary: '', seoTitle: '', seoDescription: '',
  });
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [newSectionType, setNewSectionType] = useState(SECTION_TYPES[0]);

  useEffect(() => {
    if (page) {
      setForm({
        title: page.title,
        publicTitle: page.publicTitle ?? '',
        slug: page.slug,
        summary: page.summary ?? '',
        seoTitle: page.seoTitle ?? '',
        seoDescription: page.seoDescription ?? '',
      });
    }
  }, [page]);

  const saveMutation = useMutation({
    mutationFn: () =>
      api.patch(`/institutional-web/pages/${id}`, form).then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Page saved', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-page', id] });
    },
    onError: (err: Error) =>
      toast({ title: 'Failed to save', description: err.message, variant: 'error' }),
  });

  const workflowMutation = useMutation({
    mutationFn: (action: string) =>
      api.post(`/institutional-web/pages/${id}/${action}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-page', id] });
      queryClient.invalidateQueries({ queryKey: ['website-pages'] });
    },
    onError: (err: Error) =>
      toast({ title: 'Action failed', description: err.message, variant: 'error' }),
  });

  const addSectionMutation = useMutation({
    mutationFn: (sectionType: string) =>
      api
        .post(`/institutional-web/pages/${id}/sections`, {
          sectionType,
          configJson: {},
          sortOrder: (page?.sections.length ?? 0),
        })
        .then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Section added', variant: 'success' });
      setAddSectionOpen(false);
      queryClient.invalidateQueries({ queryKey: ['website-page', id] });
    },
    onError: (err: Error) =>
      toast({ title: 'Failed to add section', description: err.message, variant: 'error' }),
  });

  const removeSectionMutation = useMutation({
    mutationFn: (sid: string) =>
      api.delete(`/institutional-web/pages/${id}/sections/${sid}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-page', id] });
    },
    onError: (err: Error) =>
      toast({ title: 'Failed to remove section', description: err.message, variant: 'error' }),
  });

  if (isLoading) return <div className="text-slate-500 mt-4">Loading…</div>;
  if (!page) return <div className="text-slate-500 mt-4">Page not found.</div>;

  return (
    <div>
      <PageHeader
        title={page.title}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant={statusVariant(page.status)} label={page.status} />
            {hasPermission('website.pages.edit') && (
              <Button
                variant="primary"
                onClick={() => saveMutation.mutate()}
                loading={saveMutation.isPending}
              >
                Save
              </Button>
            )}
          </div>
        }
      />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-800">Page Details</h2>
            <FormField label="Title" htmlFor="pe-title">
              <Input
                id="pe-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                disabled={!hasPermission('website.pages.edit')}
              />
            </FormField>
            <FormField label="Public Title" htmlFor="pe-public-title">
              <Input
                id="pe-public-title"
                value={form.publicTitle}
                onChange={(e) => setForm({ ...form, publicTitle: e.target.value })}
                disabled={!hasPermission('website.pages.edit')}
              />
            </FormField>
            <FormField label="Slug" htmlFor="pe-slug">
              <Input
                id="pe-slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                disabled={!hasPermission('website.pages.edit')}
              />
            </FormField>
            <FormField label="Summary" htmlFor="pe-summary">
              <Input
                id="pe-summary"
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                disabled={!hasPermission('website.pages.edit')}
              />
            </FormField>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-800">SEO</h2>
            <FormField label="SEO Title" htmlFor="pe-seo-title">
              <Input
                id="pe-seo-title"
                value={form.seoTitle}
                onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                disabled={!hasPermission('website.pages.edit')}
              />
            </FormField>
            <FormField label="SEO Description" htmlFor="pe-seo-desc">
              <Input
                id="pe-seo-desc"
                value={form.seoDescription}
                onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                disabled={!hasPermission('website.pages.edit')}
              />
            </FormField>
          </div>

          {/* Sections */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800">Sections</h2>
              {hasPermission('website.pages.edit') && (
                <Button size="sm" onClick={() => setAddSectionOpen(true)}>
                  Add Section
                </Button>
              )}
            </div>
            {page.sections.length === 0 ? (
              <p className="text-slate-500 text-sm">No sections yet.</p>
            ) : (
              <ul className="space-y-2">
                {page.sections.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between rounded border border-slate-100 px-3 py-2"
                  >
                    <div>
                      <span className="text-sm font-medium text-slate-700">{s.sectionType}</span>
                      <span className="ml-2 text-xs text-slate-400">order: {s.sortOrder}</span>
                    </div>
                    {hasPermission('website.pages.edit') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSectionMutation.mutate(s.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Sidebar: workflow */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Workflow</h2>
            <div className="space-y-2">
              {hasPermission('website.content.submit') &&
                (page.status === 'DRAFT' || page.status === 'CHANGES_REQUESTED') && (
                  <Button
                    className="w-full"
                    onClick={() => workflowMutation.mutate('submit')}
                    loading={workflowMutation.isPending}
                  >
                    Submit for Review
                  </Button>
                )}
              {hasPermission('website.content.approve') &&
                (page.status === 'SUBMITTED' || page.status === 'CHANGES_REQUESTED') && (
                  <Button
                    className="w-full"
                    onClick={() => workflowMutation.mutate('approve')}
                    loading={workflowMutation.isPending}
                  >
                    Approve
                  </Button>
                )}
              {hasPermission('website.content.publish') &&
                (page.status === 'APPROVED' || page.status === 'DRAFT') && (
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => workflowMutation.mutate('publish')}
                    loading={workflowMutation.isPending}
                  >
                    Publish
                  </Button>
                )}
              {hasPermission('website.content.unpublish') && page.status === 'PUBLISHED' && (
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => workflowMutation.mutate('unpublish')}
                  loading={workflowMutation.isPending}
                >
                  Unpublish
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add section modal */}
      <Modal
        open={addSectionOpen}
        onClose={() => setAddSectionOpen(false)}
        title="Add Section"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setAddSectionOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => addSectionMutation.mutate(newSectionType)}
              loading={addSectionMutation.isPending}
            >
              Add
            </Button>
          </div>
        }
      >
        <FormField label="Section Type" htmlFor="section-type">
          <Select
            id="section-type"
            value={newSectionType}
            onChange={(e) => setNewSectionType(e.target.value)}
            options={SECTION_TYPES.map((t) => ({ value: t, label: t.replace(/_/g, ' ') }))}
          />
        </FormField>
      </Modal>
    </div>
  );
}
