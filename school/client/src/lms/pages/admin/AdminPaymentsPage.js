import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/api';
import { AdminPageHeader, AdminTable, AdminModal, StatusBadge, TableSkeleton } from '../../components/admin';
import './AdminPages.css';

function PaymentDetailModal({ payment, onClose }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState(payment.status);
  const [notes, setNotes] = useState(payment.adminNotes || '');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => adminService.updatePayment(payment.id, { status, adminNotes: notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
      onClose();
    },
    onError: err => setError(err.message),
  });

  return (
    <div className="admin-form">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="payment-detail-grid">
        <div className="payment-detail-row">
          <span>Reference</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{payment.reference}</span>
        </div>
        <div className="payment-detail-row">
          <span>Type</span>
          <span style={{ textTransform: 'capitalize' }}>{payment.type?.replace('_', ' ')}</span>
        </div>
        <div className="payment-detail-row">
          <span>Amount</span>
          <span>₦{(payment.amount / 100).toLocaleString()}</span>
        </div>
        <div className="payment-detail-row">
          <span>Method</span>
          <span>{payment.method}</span>
        </div>
        {payment.proofReference && (
          <div className="payment-detail-row">
            <span>Proof Reference</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{payment.proofReference}</span>
          </div>
        )}
        {payment.proofNote && (
          <div className="payment-detail-row">
            <span>Proof Note</span>
            <span>{payment.proofNote}</span>
          </div>
        )}
        {payment.application && (
          <>
            <div className="payment-detail-row">
              <span>Course</span>
              <span>{payment.application.courseTitle}</span>
            </div>
            <div className="payment-detail-row">
              <span>Cohort</span>
              <span>{payment.application.cohortName}</span>
            </div>
          </>
        )}
      </div>

      <div className="form-group" style={{ marginTop: '16px' }}>
        <label className="form-label">Update status</label>
        <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="initiated">Initiated</option>
          <option value="pending_review">Pending Review</option>
          <option value="confirmed">Confirmed</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Admin notes</label>
        <textarea className="form-textarea" value={notes} onChange={e => setNotes(e.target.value)} rows={2} />
      </div>
      <div className="admin-form-actions">
        <button type="button" className="btn btn-secondary btn-md" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary btn-md" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving…' : 'Update Payment'}
        </button>
      </div>
    </div>
  );
}

export default function AdminPaymentsPage() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: adminService.getPayments,
  });

  const filtered = useMemo(() => {
    if (filter === 'all') return payments;
    return payments.filter(p => p.status === filter);
  }, [payments, filter]);

  const columns = [
    { label: 'Reference', render: r => (
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{r.reference}</span>
    )},
    { label: 'Learner', render: r => r.user?.name || r.application?.courseTitle || '—' },
    { label: 'Type', render: r => <span style={{ textTransform: 'capitalize' }}>{r.type?.replace('_', ' ')}</span> },
    { label: 'Amount', render: r => `₦${(r.amount / 100).toLocaleString()}` },
    { label: 'Method', key: 'method' },
    { label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { label: 'Date', render: r => new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
    { label: '', render: r => (
      <button className="btn btn-secondary btn-sm" onClick={() => setSelected(r)}>Review</button>
    )},
  ];

  const pendingCount = payments.filter(p => p.status === 'pending_review').length;

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Payments"
        description={`${payments.length} total · ${pendingCount} pending review`}
      />

      <div className="admin-filter-bar">
        {['all', 'initiated', 'pending_review', 'confirmed', 'failed'].map(s => (
          <button
            key={s}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(s)}
          >
            {s === 'all' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {isLoading
        ? <TableSkeleton rows={6} cols={8} />
        : <AdminTable columns={columns} rows={filtered} emptyText="No payments found." />
      }

      <AdminModal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Payment Review"
        size="md"
      >
        {selected && <PaymentDetailModal payment={selected} onClose={() => setSelected(null)} />}
      </AdminModal>
    </div>
  );
}
