import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader, Button, Badge, DataTable, Modal, FormField, Input } from '@rims/ui';
import { toast } from '@rims/ui';
import api from '../../lib/api';
import { useAuthStore } from '../../store/auth.store';

interface Faq {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  sortOrder?: number | null;
  status: string;
}

interface PaginatedResponse {
  data: Faq[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

function statusVariant(s: string) {
  return s === 'PUBLISHED' ? 'active' : 'default';
}

interface FaqForm { question: string; answer: string; category: string; sortOrder: string; }
const EMPTY: FaqForm = { question: '', answer: '', category: '', sortOrder: '' };

function FaqModal({ open, onClose, initial, faqId }: { open: boolean; onClose: () => void; initial?: FaqForm; faqId?: string }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FaqForm>(initial ?? EMPTY);
  const isEdit = !!faqId;

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        question: form.question,
        answer: form.answer,
        category: form.category || undefined,
        sortOrder: form.sortOrder ? Number(form.sortOrder) : undefined,
      };
      return isEdit
        ? api.patch(`/institutional-web/faqs/${faqId}`, payload).then((r) => r.data)
        : api.post('/institutional-web/faqs', payload).then((r) => r.data);
    },
    onSuccess: () => {
      toast({ title: isEdit ? 'FAQ updated' : 'FAQ created', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-faqs'] });
      setForm(EMPTY);
      onClose();
    },
    onError: (err: Error) => toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  function set(key: keyof FaqForm, value: string) { setForm((f) => ({ ...f, [key]: value })); }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit FAQ' : 'New FAQ'}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
          <Button variant="primary" onClick={() => mutation.mutate()} loading={mutation.isPending} disabled={!form.question.trim() || !form.answer.trim()}>
            {isEdit ? 'Save' : 'Create'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField label="Question" htmlFor="faq-q" required>
          <Input id="faq-q" value={form.question} onChange={(e) => set('question', e.target.value)} placeholder="What is…?" />
        </FormField>
        <FormField label="Answer" htmlFor="faq-a" required>
          <textarea id="faq-a" value={form.answer} onChange={(e) => set('answer', e.target.value)} rows={5}
            placeholder="Answer…"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category" htmlFor="faq-cat">
            <Input id="faq-cat" value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="e.g. General, Research" />
          </FormField>
          <FormField label="Sort Order" htmlFor="faq-sort">
            <Input id="faq-sort" type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} placeholder="0" />
          </FormField>
        </div>
      </div>
    </Modal>
  );
}

export function WebsiteFaqsPage() {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['website-faqs', page],
    queryFn: () => api.get<PaginatedResponse>(`/institutional-web/faqs?page=${page}&pageSize=20`).then((r) => r.data),
  });

  const items: Faq[] = (data as PaginatedResponse | undefined)?.data ?? [];
  const meta = (data as PaginatedResponse | undefined)?.meta;

  const publishMutation = useMutation({
    mutationFn: (id: string) => api.post(`/institutional-web/faqs/${id}/publish`).then((r) => r.data),
    onSuccess: () => {
      toast({ title: 'FAQ published', variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['website-faqs'] });
    },
    onError: (err: Error) => toast({ title: 'Failed', description: err.message, variant: 'error' }),
  });

  const columns = [
    {
      key: 'question', header: 'Question',
      render: (row: Faq) => <span className="font-medium text-slate-800 line-clamp-2">{row.question}</span>,
    },
    { key: 'category', header: 'Category', render: (row: Faq) => row.category ?? '—' },
    { key: 'sortOrder', header: 'Order', render: (row: Faq) => row.sortOrder ?? '—' },
    { key: 'status', header: 'Status', render: (row: Faq) => <Badge variant={statusVariant(row.status)} label={row.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="FAQs"
        actions={hasPermission('website.content.submit') ? <Button onClick={() => setCreateOpen(true)}>Add FAQ</Button> : undefined}
      />
      <DataTable<Faq>
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
      <FaqModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {editing && (
        <FaqModal open={!!editing} onClose={() => setEditing(null)} faqId={editing.id}
          initial={{ question: editing.question, answer: editing.answer, category: editing.category ?? '', sortOrder: String(editing.sortOrder ?? '') }}
        />
      )}
    </div>
  );
}
