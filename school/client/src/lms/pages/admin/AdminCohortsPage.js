import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/api';
import { AdminPageHeader, AdminTable, AdminModal, StatusBadge, TableSkeleton } from '../../components/admin';
import './AdminPages.css';

const EMPTY_COHORT = {
  courseId: '', name: '', startDate: '', durationWeeks: 12,
  maxStudents: 25, instructor: 'ProgrammoCeuticals Faculty',
  daysPerWeek: 3, hoursPerSession: 2, timeSlot: '6:00 PM WAT', status: 'upcoming',
};

function CohortForm({ initial = EMPTY_COHORT, courses, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial);
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({
      courseId: form.courseId,
      name: form.name,
      startDate: form.startDate,
      durationWeeks: Number(form.durationWeeks),
      maxStudents: Number(form.maxStudents),
      instructor: form.instructor,
      daysPerWeek: Number(form.daysPerWeek),
      hoursPerSession: Number(form.hoursPerSession),
      timeSlot: form.timeSlot,
      status: form.status,
    });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Course *</label>
        <select className="form-select" value={form.courseId} onChange={set('courseId')} required>
          <option value="">Select course…</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Cohort name *</label>
        <input className="form-input" value={form.name} onChange={set('name')} required placeholder="e.g. Python May 2026 Cohort" />
      </div>
      <div className="admin-form-row">
        <div className="form-group">
          <label className="form-label">Start date *</label>
          <input className="form-input" type="date" value={form.startDate} onChange={set('startDate')} required />
        </div>
        <div className="form-group">
          <label className="form-label">Duration (weeks)</label>
          <input className="form-input" type="number" value={form.durationWeeks} onChange={set('durationWeeks')} min={1} />
        </div>
      </div>
      <div className="admin-form-row">
        <div className="form-group">
          <label className="form-label">Max students</label>
          <input className="form-input" type="number" value={form.maxStudents} onChange={set('maxStudents')} min={1} />
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" value={form.status} onChange={set('status')}>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Instructor</label>
        <input className="form-input" value={form.instructor} onChange={set('instructor')} />
      </div>
      <div className="admin-form-row">
        <div className="form-group">
          <label className="form-label">Days/week</label>
          <input className="form-input" type="number" value={form.daysPerWeek} onChange={set('daysPerWeek')} min={1} max={7} />
        </div>
        <div className="form-group">
          <label className="form-label">Hours/session</label>
          <input className="form-input" type="number" value={form.hoursPerSession} onChange={set('hoursPerSession')} min={1} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Time slot</label>
        <input className="form-input" value={form.timeSlot} onChange={set('timeSlot')} placeholder="6:00 PM WAT" />
      </div>
      <div className="admin-form-actions">
        <button type="button" className="btn btn-secondary btn-md" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary btn-md" disabled={loading}>
          {loading ? 'Saving…' : 'Save Cohort'}
        </button>
      </div>
    </form>
  );
}

function EnrollStudentForm({ cohortId, students, onSuccess, onCancel }) {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => adminService.enrollStudent(cohortId, { userId, status: 'active' }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-cohorts'] }); onSuccess(); },
    onError: err => setError(err.message),
  });

  return (
    <div className="admin-form">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="form-group">
        <label className="form-label">Select learner</label>
        <select className="form-select" value={userId} onChange={e => setUserId(e.target.value)}>
          <option value="">Choose learner…</option>
          {students.map(s => <option key={s.id || s._id} value={s.id || s._id}>{s.name} — {s.email}</option>)}
        </select>
      </div>
      <div className="admin-form-actions">
        <button type="button" className="btn btn-secondary btn-md" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary btn-md" onClick={() => mutation.mutate()} disabled={!userId || mutation.isPending}>
          {mutation.isPending ? 'Enrolling…' : 'Enroll'}
        </button>
      </div>
    </div>
  );
}

export default function AdminCohortsPage() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(null);
  const [enrollModal, setEnrollModal] = useState(null);
  const [error, setError] = useState('');

  const { data: cohorts = [], isLoading } = useQuery({
    queryKey: ['admin-cohorts'],
    queryFn: adminService.getCohorts,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: adminService.getCourses,
  });

  const { data: students = [] } = useQuery({
    queryKey: ['admin-students'],
    queryFn: adminService.getStudents,
  });

  const createMutation = useMutation({
    mutationFn: adminService.createCohort,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-cohorts'] }); setModal(null); },
    onError: err => setError(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => adminService.updateCohort(id, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-cohorts'] }); setModal(null); },
    onError: err => setError(err.message),
  });

  const columns = [
    { label: 'Cohort', render: r => (
      <div>
        <div style={{ fontWeight: 'var(--weight-medium)', color: 'var(--color-text)' }}>{r.name}</div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{r.course?.title}</div>
      </div>
    )},
    { label: 'Start', render: r => r.startDate ? new Date(r.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
    { label: 'Duration', render: r => `${r.durationWeeks}w` },
    { label: 'Schedule', render: r => r.schedule?.timeSlot || '—' },
    { label: 'Seats', render: r => `${r.enrollmentCount}/${r.maxStudents}` },
    { label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { label: 'Actions', render: r => (
      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => { setError(''); setModal(r); }}>Edit</button>
        <button className="btn btn-primary btn-sm" onClick={() => setEnrollModal(r.id)}>Enroll</button>
      </div>
    )},
  ];

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Cohorts"
        description={`${cohorts.length} cohorts`}
        action={<button className="btn btn-primary btn-md" onClick={() => { setError(''); setModal('create'); }}>+ New Cohort</button>}
      />

      {isLoading
        ? <TableSkeleton rows={5} cols={7} />
        : <AdminTable columns={columns} rows={cohorts} emptyText="No cohorts yet." />
      }

      <AdminModal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === 'create' ? 'New Cohort' : `Edit — ${modal?.name}`}
        size="md"
      >
        {error && <div className="alert alert-danger">{error}</div>}
        <CohortForm
          initial={modal === 'create' ? EMPTY_COHORT : {
            ...modal,
            courseId: modal?.course?.id || '',
            startDate: modal?.startDate ? modal.startDate.split('T')[0] : '',
          }}
          courses={courses}
          onSubmit={payload => modal === 'create'
            ? createMutation.mutate(payload)
            : updateMutation.mutate({ id: modal.id, payload })
          }
          onCancel={() => setModal(null)}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      </AdminModal>

      <AdminModal
        open={!!enrollModal}
        onClose={() => setEnrollModal(null)}
        title="Enroll Learner"
        size="sm"
      >
        <EnrollStudentForm
          cohortId={enrollModal}
          students={students}
          onSuccess={() => setEnrollModal(null)}
          onCancel={() => setEnrollModal(null)}
        />
      </AdminModal>
    </div>
  );
}
