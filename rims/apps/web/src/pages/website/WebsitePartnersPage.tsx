import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader, Button, Badge, DataTable, Modal, FormField, Input } from '@rims/ui';
import { toast } from '@rims/ui';
import api from '../../lib/api';
import { useAuthStore } from '../../store/auth.store';

interface Partner {
  id: string;
  name: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  partnershipType?: string | null;
  status: string;
  sortOrder?: number | null;
}

interface PaginatedResponse {
  data: Partner[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

function statusVariant(s: string) {
  return s === 'PUBLISHED' ? 'active' : 'default';
}

interface PartnerForm {
  name: string; logoUrl: string; description: string;
  websiteUrl: string; partnershipType: string; sortOrder: string;
}

const EMPTY: PartnerForm = { name: '', logoUrl: '', description: '', websiteUrl: '', partnershipType: '', sortOrder: '' };

function PartnerModal({ open, onClose, initial, partnerId }: { open: boolean; onClose: () => void; initial?: PartnerForm; partnerId?: string }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<PartnerForm>(initial ?? EMPTY);
  const isEdit = !!partnerId;

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        name: form.name,
        logoUrl: form.logoUrl || undefined,
        description: form.description || undefined,
        websiteUrl: form.websiteUrl || undefined,
        partnershipType: form.partnershipType || undefined,
        sortOrder: form.sortOrder ? Number(form.sortOrder) : undefined,
      };
      return isEdit
        ? api.patch(`/institutional-web/partners/${partnerId}`, payload).then((r) => r.data)
        : api.post('/institutional-web/partners', payload).then((r) => r.data);
    },
    onSuccess: () => {
      toast({ title: isEdit ? 'Partner updated' : 'Partner created', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-partners'] });
      setForm(EMPTY);
      onClose();
    },
    onError: (err: Error) => toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  function set(key: keyof PartnerForm, value: string) { setForm((f) => ({ ...f, [key]: value })); }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Partner' : 'New Partner'}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
          <Button variant="primary" onClick={() => mutation.mutate()} loading={mutation.isPending} disabled={!form.name.trim()}>
            {isEdit ? 'Save' : 'Create'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField label="Name" htmlFor="pt-name" required>
          <Input id="pt-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Partner organisation name" />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Partnership Type" htmlFor="pt-type">
            <select id="pt-type" value={form.partnershipType} onChange={(e) => set('partnershipType', e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select type…</option>
              <option value="ACADEMIC">Academic</option>
              <option value="INDUSTRY">Industry</option>
              <option value="GOVERNMENT">Government</option>
              <option value="NGO">NGO</option>
              <option value="FUNDER">Funder</option>
              <option value="OTHER">Other</option>
            </select>
          </FormField>
          <FormField label="Sort Order" htmlFor="pt-sort">
            <Input id="pt-sort" type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} placeholder="0" />
          </FormField>
        </div>
        <FormField label="Logo URL" htmlFor="pt-logo">
          <Input id="pt-logo" value={form.logoUrl} onChange={(e) => set('logoUrl', e.target.value)} placeholder="https://..." />
        </FormField>
        <FormField label="Website URL" htmlFor="pt-web">
          <Input id="pt-web" value={form.websiteUrl} onChange={(e) => set('websiteUrl', e.target.value)} placeholder="https://..." />
        </FormField>
        <FormField label="Description" htmlFor="pt-desc">
          <textarea id="pt-desc" value={form.description} onChange={(e) => set('description', e.target.value)} rows={3}
            placeholder="Brief description…"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </FormField>
      </div>
    </Modal>
  );
}

export function WebsitePartnersPage() {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['website-partners', page],
    queryFn: () => api.get<PaginatedResponse>(`/institutional-web/partners?page=${page}&pageSize=20`).then((r) => r.data),
  });

  const items: Partner[] = (data as PaginatedResponse | undefined)?.data ?? [];
  const meta = (data as PaginatedResponse | undefined)?.meta;

  const publishMutation = useMutation({
    mutationFn: (id: string) => api.post(`/institutional-web/partners/${id}/publish`).then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Partner published', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-partners'] });
    },
    onError: (err: Error) => toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  const columns = [
    {
      key: 'name', header: 'Partner',
      render: (row: Partner) => (
        <div className="flex items-center gap-3">
          {row.logoUrl
            ? <img src={row.logoUrl} alt={row.name} className="h-8 w-16 object-contain" />
            : <div className="h-8 w-16 rounded bg-slate-100 flex items-center justify-center text-xs text-slate-400">No logo</div>
          }
          <span className="font-medium text-slate-800">{row.name}</span>
        </div>
      ),
    },
    { key: 'partnershipType', header: 'Type', render: (row: Partner) => row.partnershipType ?? '—' },
    {
      key: 'websiteUrl', header: 'Website',
      render: (row: Partner) => row.websiteUrl
        ? <a href={row.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs truncate max-w-xs block">{row.websiteUrl}</a>
        : '—',
    },
    { key: 'status', header: 'Status', render: (row: Partner) => <Badge variant={statusVariant(row.status)} label={row.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Partners"
        actions={hasPermission('website.content.submit') ? <Button onClick={() => setCreateOpen(true)}>Add Partner</Button> : undefined}
      />
      <DataTable<Partner>
        columns={columns} data={items} isLoading={isLoading} getRowKey={(r) => r.id}
        rowActions={(row) => (
          <div className="flex gap-2">
            {hasPermission('website.pages.edit') && <Button variant="ghost" size="sm" onClick={() => setEditing(row)}>Edit</Button>}
            {hasPermission('website.content.publish') && row.status !== 'PUBLISHED' && (
              <Button variant="ghost" size="sm" onClick={() => publishMutation.mutate(row.id)}>Publish</Button>
            )}
          </div>
        )}
        pagination={meta ? { page: meta.page, pageSize: meta.pageSize, total: meta.total, totalPages: meta.totalPages, onPageChange: setPage } : undefined}
      />
      <PartnerModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {editing && (
        <PartnerModal open={!!editing} onClose={() => setEditing(null)} partnerId={editing.id}
          initial={{ name: editing.name, logoUrl: editing.logoUrl ?? '', description: '', websiteUrl: editing.websiteUrl ?? '', partnershipType: editing.partnershipType ?? '', sortOrder: String(editing.sortOrder ?? '') }}
        />
      )}
    </div>
  );
}
