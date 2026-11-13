import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  PageHeader, Button, Badge, DataTable, Modal, FormField, Select,
} from '@rims/ui';
import { toast } from '@rims/ui';
import api from '../../lib/api';
import { useAuthStore } from '../../store/auth.store';

interface PublicationLink {
  id: string;
  status: string;
  publishedAt?: string | null;
  manuscript: { id: string; title: string; status: string };
}

interface ManuscriptItem {
  id: string;
  title: string;
}

interface PaginatedResponse {
  data: PublicationLink[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

interface ManuscriptResponse {
  data: ManuscriptItem[];
}

interface LinkForm {
  manuscriptId: string;
}

function statusVariant(s: string) {
  return s === 'PUBLISHED' ? 'active' : s === 'APPROVED' ? 'pending' : 'default';
}

export function WebsitePublicationsPage() {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [linkOpen, setLinkOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<LinkForm>();

  const { data, isLoading } = useQuery({
    queryKey: ['website-publication-links', page],
    queryFn: () =>
      api.get<PaginatedResponse>(`/institutional-web/publication-links?page=${page}&pageSize=20`).then((r) => r.data),
  });

  const { data: manuscriptsData } = useQuery({
    queryKey: ['manuscripts-list'],
    queryFn: () =>
      api.get<ManuscriptResponse>('/publications?pageSize=100').then((r) => r.data),
    enabled: linkOpen,
  });

  const items: PublicationLink[] = (data as PaginatedResponse | undefined)?.data ?? [];
  const meta = (data as PaginatedResponse | undefined)?.meta;
  const manuscripts: ManuscriptItem[] = (manuscriptsData as ManuscriptResponse | undefined)?.data ?? [];

  const linkMutation = useMutation({
    mutationFn: (values: LinkForm) =>
      api.post('/institutional-web/publication-links', values).then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Publication linked', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-publication-links'] });
      reset(); setLinkOpen(false);
    },
    onError: (err: Error) =>
      toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) =>
      api.post(`/institutional-web/publication-links/${id}/approve`).then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Approved', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-publication-links'] });
    },
    onError: (err: Error) =>
      toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) =>
      api.post(`/institutional-web/publication-links/${id}/publish`).then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Published', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-publication-links'] });
    },
    onError: (err: Error) =>
      toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  const unpublishMutation = useMutation({
    mutationFn: (id: string) =>
      api.post(`/institutional-web/publication-links/${id}/unpublish`).then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Unpublished', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-publication-links'] });
    },
    onError: (err: Error) =>
      toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  const columns = [
    { key: 'manuscript', header: 'Manuscript', render: (row: PublicationLink) => row.manuscript.title },
    {
      key: 'status',
      header: 'Status',
      render: (row: PublicationLink) => <Badge variant={statusVariant(row.status)} label={row.status} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Website Publications"
        actions={
          hasPermission('website.content.submit') ? (
            <Button onClick={() => setLinkOpen(true)}>Link Publication</Button>
          ) : undefined
        }
      />

      <DataTable<PublicationLink>
        columns={columns}
        data={items}
        isLoading={isLoading}
        getRowKey={(r) => r.id}
        rowActions={(row) => (
          <div className="flex gap-2">
            {hasPermission('website.content.approve') && row.status === 'DRAFT' && (
              <Button variant="ghost" size="sm" onClick={() => approveMutation.mutate(row.id)}>Approve</Button>
            )}
            {hasPermission('website.content.publish') && row.status === 'APPROVED' && (
              <Button variant="ghost" size="sm" onClick={() => publishMutation.mutate(row.id)}>Publish</Button>
            )}
            {hasPermission('website.content.unpublish') && row.status === 'PUBLISHED' && (
              <Button variant="ghost" size="sm" onClick={() => unpublishMutation.mutate(row.id)}>Unpublish</Button>
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
        open={linkOpen}
        onClose={() => { setLinkOpen(false); reset(); }}
        title="Link Publication"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => { setLinkOpen(false); reset(); }}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit((v) => linkMutation.mutate(v))} loading={linkMutation.isPending}>
              Link
            </Button>
          </div>
        }
      >
        <FormField label="Manuscript" htmlFor="link-manuscript" required>
          <Select
            id="link-manuscript"
            options={[
              { value: '', label: 'Select a manuscript…' },
              ...manuscripts.map((m) => ({ value: m.id, label: m.title })),
            ]}
            {...register('manuscriptId')}
          />
        </FormField>
      </Modal>
    </div>
  );
}
