import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  PageHeader, Button, Badge, DataTable, Modal, FormField, Input,
} from '@rims/ui';
import { toast } from '@rims/ui';
import api from '../../lib/api';
import { useAuthStore } from '../../store/auth.store';

interface Domain {
  id: string;
  hostname: string;
  verificationStatus: string;
  isPrimary: boolean;
  verifiedAt?: string | null;
}

interface CreateDomainForm {
  hostname: string;
}

function verificationVariant(s: string) {
  return s === 'VERIFIED' ? 'active' : s === 'FAILED' ? 'suspended' : 'pending';
}

export function WebsiteDomainsPage() {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<CreateDomainForm>();

  const { data, isLoading } = useQuery({
    queryKey: ['website-domains'],
    queryFn: () =>
      api.get<Domain[]>('/institutional-web/domains').then((r) => r.data),
  });

  const domains: Domain[] = (data as Domain[] | undefined) ?? [];

  const createMutation = useMutation({
    mutationFn: (values: CreateDomainForm) =>
      api.post('/institutional-web/domains', values).then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Domain added', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-domains'] });
      reset(); setAddOpen(false);
    },
    onError: (err: Error) =>
      toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  const verifyMutation = useMutation({
    mutationFn: (id: string) =>
      api.post(`/institutional-web/domains/${id}/verify`).then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Domain verified', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-domains'] });
    },
    onError: (err: Error) =>
      toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  const setPrimaryMutation = useMutation({
    mutationFn: (id: string) =>
      api.post(`/institutional-web/domains/${id}/set-primary`).then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Primary domain updated', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-domains'] });
    },
    onError: (err: Error) =>
      toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  const columns = [
    { key: 'hostname', header: 'Hostname' },
    {
      key: 'verificationStatus',
      header: 'Verification',
      render: (row: Domain) => (
        <Badge variant={verificationVariant(row.verificationStatus)} label={row.verificationStatus} />
      ),
    },
    {
      key: 'isPrimary',
      header: 'Primary',
      render: (row: Domain) =>
        row.isPrimary ? <Badge variant="active" label="Primary" /> : null,
    },
    {
      key: 'verifiedAt',
      header: 'Verified At',
      render: (row: Domain) =>
        row.verifiedAt ? new Date(row.verifiedAt).toLocaleDateString() : '—',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Domains"
        actions={
          hasPermission('website.domains.manage') ? (
            <Button onClick={() => setAddOpen(true)}>Add Domain</Button>
          ) : undefined
        }
      />

      <DataTable<Domain>
        columns={columns}
        data={domains}
        isLoading={isLoading}
        getRowKey={(r) => r.id}
        rowActions={(row) => (
          <div className="flex gap-2">
            {hasPermission('website.domains.manage') && row.verificationStatus !== 'VERIFIED' && (
              <Button variant="ghost" size="sm" onClick={() => verifyMutation.mutate(row.id)}>
                Verify
              </Button>
            )}
            {hasPermission('website.domains.manage') && !row.isPrimary && row.verificationStatus === 'VERIFIED' && (
              <Button variant="ghost" size="sm" onClick={() => setPrimaryMutation.mutate(row.id)}>
                Set Primary
              </Button>
            )}
          </div>
        )}
      />

      <Modal
        open={addOpen}
        onClose={() => { setAddOpen(false); reset(); }}
        title="Add Domain"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => { setAddOpen(false); reset(); }}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit((v) => createMutation.mutate(v))} loading={createMutation.isPending}>
              Add
            </Button>
          </div>
        }
      >
        <FormField label="Hostname" htmlFor="domain-hostname" required>
          <Input
            id="domain-hostname"
            placeholder="www.example.org"
            {...register('hostname')}
          />
        </FormField>
        <p className="mt-2 text-sm text-slate-500">
          After adding, you will receive a DNS verification token to add as a TXT record.
        </p>
      </Modal>
    </div>
  );
}
