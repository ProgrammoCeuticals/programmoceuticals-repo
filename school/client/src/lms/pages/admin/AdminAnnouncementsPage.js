import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/api';
import { AdminPageHeader, AdminTable, AdminModal, StatusBadge, TableSkeleton } from '../../components/admin';
import './AdminPages.css';

function AnnouncementForm({ initial = {}, cohorts, onSubmit, onCancel, loading }) {
  const [cohortId, setCohortId] = useState(initial.cohortId || '');
  const [message, setMessage] = useState(initial.message || '');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!message.trim()) { setError('Message is required.'); return; }
    onSubmit({ cohort_id: cohortId || undefined, message });
  };

  return (
    <div className="admin-form">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="form-group">
        <label className="form-label">Cohort <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(optional)</span></label>
        <select className="form-select" value={cohortId} onChange={e => setCohortId(e.target.value)}>
          <option value="">All / General</option>
          {cohorts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Message *</label>
        <textarea className="form-textarea" value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="Class starts next week…" />
      </div>
      <div className="admin-form-actions">
        <button type="button" className="btn btn-secondary btn-md" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary btn-md" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving…' : 'Save Announcement'}
        </button>
      </div>
    </div>
  );
}

function ApplicationsTable() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ status: '', paymentStatus: '', adminNotes: '' });
  const [error, setError] = useState('');

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['admin-applications'],
    queryFn: adminService.getCohortApplications,
  });

  const updateMutation = useMutation({
    mutationFn: () => adminService.updateCohortApplication(selected.id, {
      status: form.status,
      paymentStatus: form.paymentStatus,
      adminNotes: form.adminNotes,
    }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-applications'] }); setSelected(null); },
    onError: err => setError(err.message),
  });

  const openEdit = app => {
    setError('');
    setForm({ status: app.status, paymentStatus: app.paymentStatus, adminNotes: app.adminNotes || '' });
    setSelected(app);
  };

  const columns = [
    { label: 'Applicant', render: r => (
      <div>
        <div style={{ fontWeight: 'var(--weight-medium)', color: 'var(--color-text)' }}>{r.fullName}</div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{r.email} · {r.phone}</div>
      </div>
    )},
    { label: 'Course', render: r => r.course?.title || '—' },
    { label: 'Cohort', render: r => r.cohort?.name || '—' },
    { label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { label: 'Payment', render: r => <StatusBadge status={r.paymentStatus} /> },
    { label: 'Applied', render: r => new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
    { label: '', render: r => <button className="btn btn-secondary btn-sm" onClick={() => openEdit(r)}>Update</button> },
  ];

  return (
    <>
      {isLoading ? <TableSkeleton rows={5} cols={7} /> : <AdminTable columns={columns} rows={applications} emptyText="No applications yet." />}
      <AdminModal open={!!selected} onClose={() => setSelected(null)} title="Update Application" size="sm">
        {selected && (
          <div className="admin-form">
            {error && <div className="alert alert-danger">{error}</div>}
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              <strong>{selected.fullName}</strong> — {selected.course?.title}
            </p>
            <div className="form-group">
              <label className="form-label">Application status</label>
              <select className="form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="admitted">Admitted</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Payment status</label>
              <select className="form-select" value={form.paymentStatus} onChange={e => setForm(p => ({ ...p, paymentStatus: e.target.value }))}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="waived">Waived</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Admin notes</label>
              <textarea className="form-textarea" value={form.adminNotes} onChange={e => setForm(p => ({ ...p, adminNotes: e.target.value }))} rows={2} />
            </div>
            <div className="admin-form-actions">
              <button type="button" className="btn btn-secondary btn-md" onClick={() => setSelected(null)}>Cancel</button>
              <button className="btn btn-primary btn-md" onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </>
  );
}

export default function AdminAnnouncementsPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('applications');
  const [modal, setModal] = useState(null); // null | 'create' | announcement object

  const { data: announcements = [], isLoading: loadingAnnouncements } = useQuery({
    queryKey: ['admin-announcements'],
    queryFn: () => adminService.getAnnouncements(),
    enabled: tab === 'announcements',
  });

  const { data: cohorts = [] } = useQuery({
    queryKey: ['admin-cohorts'],
    queryFn: adminService.getCohorts,
  });

  const createMutation = useMutation({
    mutationFn: adminService.createAnnouncement,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-announcements'] }); setModal(null); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => adminService.updateAnnouncement(id, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-announcements'] }); setModal(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteAnnouncement,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-announcements'] }),
  });

  const announcementColumns = [
    { label: 'Cohort', render: r => r.cohort?.name || <span style={{ color: 'var(--color-text-muted)' }}>General</span> },
    { label: 'Course', render: r => r.cohort?.course?.title || '—' },
    { label: 'Message', render: r => (
      <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {r.message}
      </span>
    )},
    { label: 'Sent', render: r => r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
    { label: '', render: r => (
      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => setModal(r)}>Edit</button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => { if (window.confirm('Delete this announcement?')) deleteMutation.mutate(r.id); }}
          disabled={deleteMutation.isPending}
        >
          Delete
        </button>
      </div>
    )},
  ];

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Announcements & Applications"
        description="Manage cohort applications and send announcements."
        action={
          tab === 'announcements'
            ? <button className="btn btn-primary btn-md" onClick={() => setModal('create')}>+ New Announcement</button>
            : null
        }
      />

      <div className="tab-bar" style={{ marginBottom: 'var(--space-6)' }}>
        <button className={`tab-btn ${tab === 'applications' ? 'active' : ''}`} onClick={() => setTab('applications')}>
          Cohort Applications
        </button>
        <button className={`tab-btn ${tab === 'announcements' ? 'active' : ''}`} onClick={() => setTab('announcements')}>
          Announcements
        </button>
      </div>

      {tab === 'applications' && <ApplicationsTable />}

      {tab === 'announcements' && (
        loadingAnnouncements
          ? <TableSkeleton rows={4} cols={5} />
          : <AdminTable columns={announcementColumns} rows={announcements} emptyText="No announcements yet." />
      )}

      <AdminModal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === 'create' ? 'New Announcement' : 'Edit Announcement'}
        size="sm"
      >
        <AnnouncementForm
          initial={modal === 'create' ? {} : { cohortId: modal?.cohort?.id, message: modal?.message }}
          cohorts={cohorts}
          onSubmit={payload => modal === 'create'
            ? createMutation.mutate(payload)
            : updateMutation.mutate({ id: modal.id, payload })
          }
          onCancel={() => setModal(null)}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      </AdminModal>
    </div>
  );
}
