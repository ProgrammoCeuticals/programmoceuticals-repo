import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/api';
import { AdminPageHeader, AdminTable, AdminModal, StatusBadge, TableSkeleton } from '../../components/admin';
import './AdminPages.css';

function IssueCertificateForm({ cohorts, onSuccess, onCancel }) {
  const queryClient = useQueryClient();
  const [enrollmentId, setEnrollmentId] = useState('');
  const [error, setError] = useState('');

  // Flatten all enrollments from all cohorts
  const enrollments = cohorts.flatMap(c =>
    (c.enrollments || []).map(e => ({
      id: e.id,
      label: `${e.user?.name || 'Unknown'} — ${c.name}`,
    }))
  );

  const mutation = useMutation({
    mutationFn: () => adminService.issueCertificate(enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
      onSuccess();
    },
    onError: err => setError(err.message),
  });

  return (
    <div className="admin-form">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="form-group">
        <label className="form-label">Select enrollment</label>
        <select className="form-select" value={enrollmentId} onChange={e => setEnrollmentId(e.target.value)}>
          <option value="">Choose enrollment…</option>
          {enrollments.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
        </select>
      </div>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
        Only issue certificates to learners who have completed the course and paid for certification.
      </p>
      <div className="admin-form-actions">
        <button type="button" className="btn btn-secondary btn-md" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary btn-md" onClick={() => mutation.mutate()} disabled={!enrollmentId || mutation.isPending}>
          {mutation.isPending ? 'Issuing…' : 'Issue Certificate'}
        </button>
      </div>
    </div>
  );
}

export default function AdminCertificatesPage() {
  const [search, setSearch] = useState('');
  const [issueModal, setIssueModal] = useState(false);

  const { data: certificates = [], isLoading } = useQuery({
    queryKey: ['admin-certificates'],
    queryFn: adminService.getCertificates,
  });

  const { data: cohorts = [] } = useQuery({
    queryKey: ['admin-cohorts'],
    queryFn: adminService.getCohorts,
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return certificates;
    const q = search.toLowerCase();
    return certificates.filter(c =>
      c.student?.name?.toLowerCase().includes(q) ||
      c.certificateNumber?.toLowerCase().includes(q) ||
      c.course?.title?.toLowerCase().includes(q)
    );
  }, [certificates, search]);

  const columns = [
    { label: 'Certificate No.', render: r => (
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{r.certificateNumber}</span>
    )},
    { label: 'Learner', render: r => (
      <div>
        <div style={{ fontWeight: 'var(--weight-medium)', color: 'var(--color-text)' }}>{r.student?.name}</div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{r.student?.email}</div>
      </div>
    )},
    { label: 'Course', render: r => r.course?.title || '—' },
    { label: 'Cohort', render: r => r.cohort?.name || '—' },
    { label: 'Status', render: r => <StatusBadge status={r.status || 'issued'} /> },
    { label: 'Issued', render: r => r.issuedAt
      ? new Date(r.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : '—'
    },
  ];

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Certificates"
        description={`${certificates.length} issued`}
        action={<button className="btn btn-primary btn-md" onClick={() => setIssueModal(true)}>+ Issue Certificate</button>}
      />

      <div className="admin-filter-bar">
        <input
          placeholder="Search by learner, course, or certificate number…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {isLoading
        ? <TableSkeleton rows={5} cols={6} />
        : <AdminTable columns={columns} rows={filtered} emptyText="No certificates issued yet." />
      }

      <AdminModal
        open={issueModal}
        onClose={() => setIssueModal(false)}
        title="Issue Certificate"
        size="sm"
      >
        <IssueCertificateForm
          cohorts={cohorts}
          onSuccess={() => setIssueModal(false)}
          onCancel={() => setIssueModal(false)}
        />
      </AdminModal>
    </div>
  );
}
