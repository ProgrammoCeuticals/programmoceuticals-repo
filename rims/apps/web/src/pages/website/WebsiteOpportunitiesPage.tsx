import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  PageHeader, Button, Badge, DataTable, Modal, FormField, Input, Select,
} from '@rims/ui';
import { toast } from '@rims/ui';
import api from '../../lib/api';
import { useAuthStore } from '../../store/auth.store';

interface Opportunity {
  id: string;
  title: string;
  slug: string;
  opportunityType: string;
  status: string;
  closingDate?: string | null;
}

interface PaginatedResponse {
  data: Opportunity[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

interface CreateOppForm {
  title: string;
  slug: string;
  opportunityType: string;
  summary?: string;
  closingDate?: string;
  applicationUrl?: string;
}

const OPP_TYPE_OPTIONS = [
  { value: 'VACANCY', label: 'Vacancy' },
  { value: 'CALL_FOR_PAPERS', label: 'Call for Papers' },
  { value: 'VOLUNTEER_CALL', label: 'Volunteer Call' },
  { value: 'FELLOWSHIP', label: 'Fellowship' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'RESEARCH_ASSISTANT', label: 'Research Assistant' },
  { value: 'GRADUATE', label: 'Graduate' },
  { value: 'CALL_FOR_COLLABORATION', label: 'Call for Collaboration' },
  { value: 'OTHER', label: 'Other' },
];

function statusVariant(s: string) {
  return s === 'PUBLISHED' ? 'active' : 'default';
}

export function WebsiteOpportunitiesPage() {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<CreateOppForm>({ defaultValues: { opportunityType: 'VACANCY' } });

  const { data, isLoading } = useQuery({
    queryKey: ['website-opportunities', page, typeFilter],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' });
      if (typeFilter) params.set('type', typeFilter);
      return api.get<PaginatedResponse>(`/institutional-web/opportunities?${params}`).then((r) => r.data);
    },
  });

  const items: Opportunity[] = (data as PaginatedResponse | undefined)?.data ?? [];
  const meta = (data as PaginatedResponse | undefined)?.meta;

  const createMutation = useMutation({
    mutationFn: (values: CreateOppForm) =>
      api.post('/institutional-web/opportunities', values).then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Opportunity created', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-opportunities'] });
      reset(); setCreateOpen(false);
    },
    onError: (err: Error) =>
      toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) =>
      api.post(`/institutional-web/opportunities/${id}/publish`).then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Published', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-opportunities'] });
    },
    onError: (err: Error) =>
      toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'opportunityType', header: 'Type' },
    {
      key: 'status',
      header: 'Status',
      render: (row: Opportunity) => <Badge variant={statusVariant(row.status)} label={row.status} />,
    },
    {
      key: 'closingDate',
      header: 'Closing',
      render: (row: Opportunity) => row.closingDate ? new Date(row.closingDate).toLocaleDateString() : '—',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Opportunities"
        actions={
          hasPermission('website.content.submit') ? (
            <Button onClick={() => setCreateOpen(true)}>New Opportunity</Button>
          ) : undefined
        }
      />

      <div className="mb-4">
        <Select
          options={[{ value: '', label: 'All Types' }, ...OPP_TYPE_OPTIONS]}
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="w-48"
        />
      </div>

      <DataTable<Opportunity>
        columns={columns}
        data={items}
        isLoading={isLoading}
        getRowKey={(r) => r.id}
        rowActions={(row) => (
          hasPermission('website.content.publish') && row.status !== 'PUBLISHED' ? (
            <Button variant="ghost" size="sm" onClick={() => publishMutation.mutate(row.id)}>
              Publish
            </Button>
          ) : null
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
        title="New Opportunity"
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
          <FormField label="Type" htmlFor="opp-type" required>
            <Select id="opp-type" options={OPP_TYPE_OPTIONS} {...register('opportunityType')} />
          </FormField>
          <FormField label="Title" htmlFor="opp-title" required>
            <Input id="opp-title" {...register('title')} />
          </FormField>
          <FormField label="Slug" htmlFor="opp-slug" required>
            <Input id="opp-slug" {...register('slug')} />
          </FormField>
          <FormField label="Summary" htmlFor="opp-summary">
            <Input id="opp-summary" {...register('summary')} />
          </FormField>
          <FormField label="Closing Date" htmlFor="opp-closing">
            <Input id="opp-closing" type="date" {...register('closingDate')} />
          </FormField>
          <FormField label="Application URL" htmlFor="opp-app-url">
            <Input id="opp-app-url" {...register('applicationUrl')} />
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
