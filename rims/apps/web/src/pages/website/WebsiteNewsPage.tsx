import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  PageHeader, Button, Badge, DataTable, Modal, FormField, Input,
} from '@rims/ui';
import { toast } from '@rims/ui';
import api from '../../lib/api';
import { useAuthStore } from '../../store/auth.store';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  category?: string | null;
  publishedAt?: string | null;
}

interface PaginatedResponse {
  data: NewsItem[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

interface CreateNewsForm {
  title: string;
  slug: string;
  summary?: string;
  body?: string;
  category?: string;
}

function statusVariant(s: string) {
  return s === 'PUBLISHED' ? 'active' : s === 'DRAFT' ? 'default' : 'pending';
}

export function WebsiteNewsPage() {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<CreateNewsForm>();

  const { data, isLoading } = useQuery({
    queryKey: ['website-news', page],
    queryFn: () =>
      api.get<PaginatedResponse>(`/institutional-web/news?page=${page}&pageSize=20`).then((r) => r.data),
  });

  const items: NewsItem[] = (data as PaginatedResponse | undefined)?.data ?? [];
  const meta = (data as PaginatedResponse | undefined)?.meta;

  const createMutation = useMutation({
    mutationFn: (values: CreateNewsForm) =>
      api.post('/institutional-web/news', values).then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'News article created', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-news'] });
      reset(); setCreateOpen(false);
    },
    onError: (err: Error) =>
      toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) =>
      api.post(`/institutional-web/news/${id}/publish`).then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Published', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-news'] });
    },
    onError: (err: Error) =>
      toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  const unpublishMutation = useMutation({
    mutationFn: (id: string) =>
      api.post(`/institutional-web/news/${id}/unpublish`).then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Unpublished', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-news'] });
    },
    onError: (err: Error) =>
      toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'slug', header: 'Slug' },
    {
      key: 'status',
      header: 'Status',
      render: (row: NewsItem) => <Badge variant={statusVariant(row.status)} label={row.status} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="News"
        actions={
          hasPermission('website.content.submit') ? (
            <Button onClick={() => setCreateOpen(true)}>New Article</Button>
          ) : undefined
        }
      />

      <DataTable<NewsItem>
        columns={columns}
        data={items}
        isLoading={isLoading}
        getRowKey={(r) => r.id}
        rowActions={(row) => (
          <div className="flex gap-2">
            {hasPermission('website.content.publish') && row.status !== 'PUBLISHED' && (
              <Button variant="ghost" size="sm" onClick={() => publishMutation.mutate(row.id)}>
                Publish
              </Button>
            )}
            {hasPermission('website.content.unpublish') && row.status === 'PUBLISHED' && (
              <Button variant="ghost" size="sm" onClick={() => unpublishMutation.mutate(row.id)}>
                Unpublish
              </Button>
            )}
          </div>
        )}
        pagination={
          meta
            ? { page: meta.page, pageSize: meta.pageSize, total: meta.total, totalPages: meta.totalPages, onPageChange: setPage }
            : undefined
        }
      />

      <Modal
        open={createOpen}
        onClose={() => { setCreateOpen(false); reset(); }}
        title="New News Article"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => { setCreateOpen(false); reset(); }}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit((v) => createMutation.mutate(v))} loading={createMutation.isPending}>
              Create
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField label="Title" htmlFor="news-title" required>
            <Input id="news-title" {...register('title')} />
          </FormField>
          <FormField label="Slug" htmlFor="news-slug" required>
            <Input id="news-slug" {...register('slug')} />
          </FormField>
          <FormField label="Category" htmlFor="news-category">
            <Input id="news-category" {...register('category')} />
          </FormField>
          <FormField label="Summary" htmlFor="news-summary">
            <Input id="news-summary" {...register('summary')} />
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
