import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  PageHeader, Button, Badge, DataTable, Modal, FormField, Input,
} from '@rims/ui';
import { toast } from '@rims/ui';
import api from '../../lib/api';
import { useAuthStore } from '../../store/auth.store';

interface EventItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  startDatetime: string;
  venue?: string | null;
}

interface PaginatedResponse {
  data: EventItem[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

interface CreateEventForm {
  title: string;
  slug: string;
  summary?: string;
  startDatetime: string;
  endDatetime?: string;
  timezone?: string;
  venue?: string;
  isOnline?: boolean;
  registrationUrl?: string;
}

function statusVariant(s: string) {
  return s === 'PUBLISHED' ? 'active' : 'default';
}

export function WebsiteEventsPage() {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<CreateEventForm>();

  const { data, isLoading } = useQuery({
    queryKey: ['website-events', page],
    queryFn: () =>
      api.get<PaginatedResponse>(`/institutional-web/events?page=${page}&pageSize=20`).then((r) => r.data),
  });

  const items: EventItem[] = (data as PaginatedResponse | undefined)?.data ?? [];
  const meta = (data as PaginatedResponse | undefined)?.meta;

  const createMutation = useMutation({
    mutationFn: (values: CreateEventForm) =>
      api.post('/institutional-web/events', values).then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Event created', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-events'] });
      reset(); setCreateOpen(false);
    },
    onError: (err: Error) =>
      toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) =>
      api.post(`/institutional-web/events/${id}/publish`).then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Published', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-events'] });
    },
    onError: (err: Error) =>
      toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'slug', header: 'Slug' },
    { key: 'startDatetime', header: 'Start', render: (row: EventItem) => new Date(row.startDatetime).toLocaleDateString() },
    {
      key: 'status',
      header: 'Status',
      render: (row: EventItem) => <Badge variant={statusVariant(row.status)} label={row.status} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Events"
        actions={
          hasPermission('website.content.submit') ? (
            <Button onClick={() => setCreateOpen(true)}>New Event</Button>
          ) : undefined
        }
      />

      <DataTable<EventItem>
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
        title="New Event"
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
          <FormField label="Title" htmlFor="ev-title" required>
            <Input id="ev-title" {...register('title')} />
          </FormField>
          <FormField label="Slug" htmlFor="ev-slug" required>
            <Input id="ev-slug" {...register('slug')} />
          </FormField>
          <FormField label="Start Date & Time" htmlFor="ev-start" required>
            <Input id="ev-start" type="datetime-local" {...register('startDatetime')} />
          </FormField>
          <FormField label="End Date & Time" htmlFor="ev-end">
            <Input id="ev-end" type="datetime-local" {...register('endDatetime')} />
          </FormField>
          <FormField label="Venue" htmlFor="ev-venue">
            <Input id="ev-venue" {...register('venue')} />
          </FormField>
          <FormField label="Registration URL" htmlFor="ev-reg">
            <Input id="ev-reg" {...register('registrationUrl')} />
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
