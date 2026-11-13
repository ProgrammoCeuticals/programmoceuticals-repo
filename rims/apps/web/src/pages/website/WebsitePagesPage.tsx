import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  PageHeader,
  Button,
  Badge,
  DataTable,
  Modal,
  FormField,
  Input,
  Select,
} from '@rims/ui';
import { toast } from '@rims/ui';
import api from '../../lib/api';
import { useAuthStore } from '../../store/auth.store';

interface WebsitePage {
  id: string;
  title: string;
  slug: string;
  pageType: string;
  status: string;
  publishedAt?: string | null;
}

interface PagesResponse {
  data: WebsitePage[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

const PAGE_TYPE_OPTIONS = [
  { value: 'HOME', label: 'Home' },
  { value: 'ABOUT', label: 'About' },
  { value: 'RESEARCH', label: 'Research' },
  { value: 'PUBLICATIONS', label: 'Publications' },
  { value: 'OPPORTUNITIES', label: 'Opportunities' },
  { value: 'NEWS', label: 'News' },
  { value: 'EVENTS', label: 'Events' },
  { value: 'TEAM', label: 'Team' },
  { value: 'PARTNERS', label: 'Partners' },
  { value: 'RESOURCES', label: 'Resources' },
  { value: 'CONTACT', label: 'Contact' },
  { value: 'FAQ', label: 'FAQ' },
  { value: 'CUSTOM', label: 'Custom' },
];

function statusVariant(status: string): string {
  switch (status) {
    case 'PUBLISHED': return 'active';
    case 'DRAFT': return 'default';
    case 'APPROVED': return 'pending';
    case 'ARCHIVED': return 'suspended';
    default: return 'default';
  }
}

interface CreatePageForm {
  title: string;
  slug: string;
  pageType: string;
}

export function WebsitePagesPage() {
  const navigate = useNavigate();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['website-pages', page],
    queryFn: () =>
      api
        .get<PagesResponse>(`/institutional-web/pages?page=${page}&pageSize=20`)
        .then((r) => r.data),
  });

  const pages: WebsitePage[] = (data as PagesResponse | undefined)?.data ?? [];
  const meta = (data as PagesResponse | undefined)?.meta;

  const { register, handleSubmit, reset } = useForm<CreatePageForm>({
    defaultValues: { pageType: 'CUSTOM' },
  });

  const createMutation = useMutation({
    mutationFn: (values: CreatePageForm) =>
      api.post('/institutional-web/pages', values).then((r) => r.data),
    onSuccess: (newPage: WebsitePage) => {
      toast({ title: 'Page created', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-pages'] });
      reset();
      setCreateOpen(false);
      navigate(`/website/pages/${newPage.id}`);
    },
    onError: (err: Error) =>
      toast({ title: 'Failed to create page', description: err.message, variant: 'error' }),
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) =>
      api.post(`/institutional-web/pages/${id}/publish`).then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Page published', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-pages'] });
    },
    onError: (err: Error) =>
      toast({ title: 'Failed to publish', description: err.message, variant: 'error' }),
  });

  const unpublishMutation = useMutation({
    mutationFn: (id: string) =>
      api.post(`/institutional-web/pages/${id}/unpublish`).then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Page unpublished', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-pages'] });
    },
    onError: (err: Error) =>
      toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'slug', header: 'Slug' },
    { key: 'pageType', header: 'Type' },
    {
      key: 'status',
      header: 'Status',
      render: (row: WebsitePage) => (
        <Badge variant={statusVariant(row.status)} label={row.status} />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Website Pages"
        actions={
          hasPermission('website.pages.create') ? (
            <Button onClick={() => setCreateOpen(true)}>Create Page</Button>
          ) : undefined
        }
      />

      <DataTable<WebsitePage>
        columns={columns}
        data={pages}
        isLoading={isLoading}
        getRowKey={(row) => row.id}
        rowActions={(row) => (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/website/pages/${row.id}`)}
            >
              Edit
            </Button>
            {hasPermission('website.content.publish') && row.status === 'APPROVED' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => publishMutation.mutate(row.id)}
              >
                Publish
              </Button>
            )}
            {hasPermission('website.content.unpublish') && row.status === 'PUBLISHED' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => unpublishMutation.mutate(row.id)}
              >
                Unpublish
              </Button>
            )}
          </div>
        )}
        pagination={
          meta
            ? {
                page: meta.page,
                pageSize: meta.pageSize,
                total: meta.total,
                totalPages: meta.totalPages,
                onPageChange: setPage,
              }
            : undefined
        }
      />

      <Modal
        open={createOpen}
        onClose={() => { setCreateOpen(false); reset(); }}
        title="Create Page"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => { setCreateOpen(false); reset(); }}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit((v) => createMutation.mutate(v))}
              loading={createMutation.isPending}
            >
              Create
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField label="Title" htmlFor="page-title" required>
            <Input id="page-title" {...register('title')} />
          </FormField>
          <FormField label="Slug" htmlFor="page-slug" required>
            <Input id="page-slug" {...register('slug')} placeholder="my-page-slug" />
          </FormField>
          <FormField label="Page Type" htmlFor="page-type">
            <Select
              id="page-type"
              options={PAGE_TYPE_OPTIONS}
              {...register('pageType')}
            />
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
