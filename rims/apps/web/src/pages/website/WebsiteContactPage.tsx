import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader, DataTable, Badge } from '@rims/ui';
import api from '../../lib/api';
import { useAuthStore } from '../../store/auth.store';

interface Submission {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  processingStatus: string;
  receivedAt: string;
}

interface PaginatedResponse {
  data: Submission[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
}

function statusVariant(s: string) {
  return s === 'NEW' ? 'pending' : s === 'CLOSED' ? 'active' : 'default';
}

export function WebsiteContactPage() {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const [page, setPage] = useState(1);

  if (!hasPermission('website.content.review')) {
    return (
      <div className="mt-8 text-center text-slate-500">
        You do not have permission to view contact submissions.
      </div>
    );
  }

  const { data, isLoading } = useQuery({
    queryKey: ['website-contact-submissions', page],
    queryFn: () =>
      api
        .get<PaginatedResponse>(`/institutional-web/contact-submissions?page=${page}&pageSize=20`)
        .then((r) => r.data),
  });

  const items: Submission[] = (data as PaginatedResponse | undefined)?.data ?? [];
  const meta = (data as PaginatedResponse | undefined)?.meta;

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'subject', header: 'Subject', render: (row: Submission) => row.subject ?? '—' },
    {
      key: 'processingStatus',
      header: 'Status',
      render: (row: Submission) => (
        <Badge variant={statusVariant(row.processingStatus)} label={row.processingStatus} />
      ),
    },
    {
      key: 'receivedAt',
      header: 'Received',
      render: (row: Submission) => new Date(row.receivedAt).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <PageHeader title="Contact Submissions" />
      <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        Contact submissions contain personal data — treat with care and in accordance with your
        data protection policy.
      </div>

      <DataTable<Submission>
        columns={columns}
        data={items}
        isLoading={isLoading}
        getRowKey={(r) => r.id}
        pagination={
          meta
            ? { page: meta.page, pageSize: meta.pageSize, total: meta.total, totalPages: meta.totalPages, onPageChange: setPage }
            : undefined
        }
      />
    </div>
  );
}
