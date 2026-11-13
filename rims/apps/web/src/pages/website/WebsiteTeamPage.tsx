import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader, Button, Badge, DataTable, Modal, FormField, Input } from '@rims/ui';
import { toast } from '@rims/ui';
import api from '../../lib/api';
import { useAuthStore } from '../../store/auth.store';

interface TeamProfile {
  id: string;
  displayName: string;
  role?: string | null;
  department?: string | null;
  photoUrl?: string | null;
  status: string;
  sortOrder?: number | null;
}

interface PaginatedResponse {
  data: TeamProfile[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

function statusVariant(s: string) {
  return s === 'PUBLISHED' ? 'active' : s === 'DRAFT' ? 'default' : 'pending';
}

interface ProfileForm {
  displayName: string; role: string; department: string;
  biography: string; photoUrl: string; qualifications: string; sortOrder: string;
}

const EMPTY: ProfileForm = { displayName: '', role: '', department: '', biography: '', photoUrl: '', qualifications: '', sortOrder: '' };

function ProfileModal({ open, onClose, initial, profileId }: { open: boolean; onClose: () => void; initial?: ProfileForm; profileId?: string }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ProfileForm>(initial ?? EMPTY);
  const isEdit = !!profileId;

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        displayName: form.displayName,
        role: form.role || undefined,
        department: form.department || undefined,
        biography: form.biography || undefined,
        photoUrl: form.photoUrl || undefined,
        qualifications: form.qualifications || undefined,
        sortOrder: form.sortOrder ? Number(form.sortOrder) : undefined,
      };
      return isEdit
        ? api.patch(`/institutional-web/team/${profileId}`, payload).then((r) => r.data)
        : api.post('/institutional-web/team', payload).then((r) => r.data);
    },
    onSuccess: () => {
      toast({ title: isEdit ? 'Profile updated' : 'Profile created', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-team'] });
      setForm(EMPTY);
      onClose();
    },
    onError: (err: Error) => toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  function set(key: keyof ProfileForm, value: string) { setForm((f) => ({ ...f, [key]: value })); }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Profile' : 'New Team Profile'}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
          <Button variant="primary" onClick={() => mutation.mutate()} loading={mutation.isPending} disabled={!form.displayName.trim()}>
            {isEdit ? 'Save' : 'Create'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField label="Display Name" htmlFor="tp-name" required>
          <Input id="tp-name" value={form.displayName} onChange={(e) => set('displayName', e.target.value)} placeholder="Dr. Jane Smith" />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Role / Title" htmlFor="tp-role">
            <Input id="tp-role" value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Principal Investigator" />
          </FormField>
          <FormField label="Department" htmlFor="tp-dept">
            <Input id="tp-dept" value={form.department} onChange={(e) => set('department', e.target.value)} placeholder="Oncology" />
          </FormField>
        </div>
        <FormField label="Photo URL" htmlFor="tp-photo">
          <Input id="tp-photo" value={form.photoUrl} onChange={(e) => set('photoUrl', e.target.value)} placeholder="https://..." />
        </FormField>
        <FormField label="Biography" htmlFor="tp-bio">
          <textarea id="tp-bio" value={form.biography} onChange={(e) => set('biography', e.target.value)} rows={4}
            placeholder="Short biography…"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </FormField>
        <FormField label="Qualifications" htmlFor="tp-quals">
          <Input id="tp-quals" value={form.qualifications} onChange={(e) => set('qualifications', e.target.value)} placeholder="PhD, MRCP…" />
        </FormField>
        <FormField label="Sort Order" htmlFor="tp-sort">
          <Input id="tp-sort" type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} placeholder="0" />
        </FormField>
      </div>
    </Modal>
  );
}

export function WebsiteTeamPage() {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<TeamProfile | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['website-team', page],
    queryFn: () => api.get<PaginatedResponse>(`/institutional-web/team?page=${page}&pageSize=20`).then((r) => r.data),
  });

  const items: TeamProfile[] = (data as PaginatedResponse | undefined)?.data ?? [];
  const meta = (data as PaginatedResponse | undefined)?.meta;

  const publishMutation = useMutation({
    mutationFn: (id: string) => api.post(`/institutional-web/team/${id}/publish`).then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'Profile published', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-team'] });
    },
    onError: (err: Error) => toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  const columns = [
    {
      key: 'displayName', header: 'Name',
      render: (row: TeamProfile) => (
        <div className="flex items-center gap-3">
          {row.photoUrl
            ? <img src={row.photoUrl} alt={row.displayName} className="h-8 w-8 rounded-full object-cover" />
            : <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">{row.displayName.charAt(0)}</div>
          }
          <span className="font-medium text-slate-800">{row.displayName}</span>
        </div>
      ),
    },
    { key: 'role', header: 'Role', render: (row: TeamProfile) => row.role ?? '—' },
    { key: 'department', header: 'Department', render: (row: TeamProfile) => row.department ?? '—' },
    { key: 'status', header: 'Status', render: (row: TeamProfile) => <Badge variant={statusVariant(row.status)} label={row.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Team & Researchers"
        actions={hasPermission('website.content.submit') ? <Button onClick={() => setCreateOpen(true)}>Add Profile</Button> : undefined}
      />
      <DataTable<TeamProfile>
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
      <ProfileModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {editing && (
        <ProfileModal open={!!editing} onClose={() => setEditing(null)} profileId={editing.id}
          initial={{ displayName: editing.displayName, role: editing.role ?? '', department: editing.department ?? '', biography: '', photoUrl: editing.photoUrl ?? '', qualifications: '', sortOrder: String(editing.sortOrder ?? '') }}
        />
      )}
    </div>
  );
}
