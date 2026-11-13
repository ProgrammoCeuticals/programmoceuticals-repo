import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader, Button, Badge, DataTable, Modal, FormField, Input } from '@rims/ui';
import { toast } from '@rims/ui';
import api from '../../lib/api';
import { useAuthStore } from '../../store/auth.store';

interface Resource {
  id: string;
  title: string;
  category?: string | null;
  fileName?: string | null;
  mimeType?: string | null;
  publicDownload?: boolean;
  status: string;
}

interface PaginatedResponse {
  data: Resource[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

function statusVariant(s: string) {
  return s === 'PUBLISHED' ? 'active' : 'default';
}

interface ResourceForm {
  title: string; description: string; fileName: string;
  mimeType: string; category: string; publicDownload: boolean;
}

const EMPTY: ResourceForm = { title: '', description: '', fileName: '', mimeType: '', category: '', publicDownload: true };

function ResourceModal({ open, onClose, initial, resourceId }: { open: boolean; onClose: () => void; initial?: ResourceForm; resourceId?: string }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ResourceForm>(initial ?? EMPTY);
  const isEdit = !!resourceId;

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        title: form.title,
        description: form.description || undefined,
        fileName: form.fileName || undefined,
        mimeType: form.mimeType || undefined,
        category: form.category || undefined,
        publicDownload: form.publicDownload,
      };
      return isEdit
        ? api.patch(`/institutional-web/resources/${resourceId}`, payload).then((r) => r.data)
        : api.post('/institutional-web/resources', payload).then((r) => r.data);
    },
    onSuccess: () => {
      toast({ title: isEdit ? 'Resource updated' : 'Resource created', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-resources'] });
      setForm(EMPTY);
      onClose();
    },
    onError: (err: Error) => toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  function set(key: keyof ResourceForm, value: string | boolean) { setForm((f) => ({ ...f, [key]: value })); }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Resource' : 'New Resource'}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
          <Button variant="primary" onClick={() => mutation.mutate()} loading={mutation.isPending} disabled={!form.title.trim()}>
            {isEdit ? 'Save' : 'Create'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField label="Title" htmlFor="res-title" required>
          <Input id="res-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Resource title" />
        </FormField>
        <FormField label="Description" htmlFor="res-desc">
          <textarea id="res-desc" value={form.description} onChange={(e) => set('description', e.target.value)} rows={3}
            placeholder="Brief description…"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category" htmlFor="res-cat">
            <Input id="res-cat" value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="e.g. Protocol, Report" />
          </FormField>
          <FormField label="File Name" htmlFor="res-file">
            <Input id="res-file" value={form.fileName} onChange={(e) => set('fileName', e.target.value)} placeholder="report.pdf" />
          </FormField>
        </div>
        <FormField label="MIME Type" htmlFor="res-mime">
          <Input id="res-mime" value={form.mimeType} onChange={(e) => set('mimeType', e.target.value)} placeholder="application/pdf" />
        </FormField>
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <input type="checkbox" checked={form.publicDownload} onChange={(e) => set('publicDownload', e.target.checked)} className="rounded" />
          Allow public download
        </label>
      </div>
    </Modal>
  );
}

export function WebsiteResourcesPage() {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['website-resources', page],
    queryFn: () => api.get<PaginatedResponse>(`/institutional-web/resources?page=${page}&pageSize=20`).then((r) => r.data),
  });

  const items: Resource[] = (data as PaginatedResponse | undefined)?.data ?? [];
  const meta = (data as PaginatedResponse | undefined)?.meta;

  const publishMutation = useMutation({
    mutationFn: (id: string) => api.post(`/institutional-web/resources/${id}/publish`).then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Resource published', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-resources'] });
    },
    onError: (err: Error) => toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  const columns = [
    { key: 'title', header: 'Title', render: (row: Resource) => <span className="font-medium text-slate-800">{row.title}</span> },
    { key: 'category', header: 'Category', render: (row: Resource) => row.category ?? '—' },
    { key: 'fileName', header: 'File', render: (row: Resource) => row.fileName ?? '—' },
    {
      key: 'publicDownload', header: 'Public',
      render: (row: Resource) => (
        <Badge variant={row.publicDownload ? 'active' : 'inactive'} label={row.publicDownload ? 'Yes' : 'No'} />
      ),
    },
    { key: 'status', header: 'Status', render: (row: Resource) => <Badge variant={statusVariant(row.status)} label={row.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Resources"
        actions={hasPermission('website.content.submit') ? <Button onClick={() => setCreateOpen(true)}>Add Resource</Button> : undefined}
      />
      <DataTable<Resource>
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
      <ResourceModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {editing && (
        <ResourceModal open={!!editing} onClose={() => setEditing(null)} resourceId={editing.id}
          initial={{ title: editing.title, description: '', fileName: editing.fileName ?? '', mimeType: editing.mimeType ?? '', category: editing.category ?? '', publicDownload: editing.publicDownload ?? true }}
        />
      )}
    </div>
  );
}
