import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/api';
import { AdminPageHeader, AdminTable, AdminModal, StatusBadge, TableSkeleton } from '../../components/admin';
import './AdminPages.css';

const EMPTY_FORM = {
  title: '', slug: '', category: '', level: 'Beginner', description: '',
  durationWeeks: 12, objectives: '', outline: '', color: '#0b5ed7',
  iconKey: '', previewPercent: 20, sortOrder: 100, isPublished: true,
};

function CourseForm({ initial = EMPTY_FORM, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial);
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));
  const setCheck = f => e => setForm(p => ({ ...p, [f]: e.target.checked }));

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({
      ...form,
      durationWeeks: Number(form.durationWeeks),
      previewPercent: Number(form.previewPercent),
      sortOrder: Number(form.sortOrder),
      objectives: form.objectives ? form.objectives.split('\n').filter(Boolean) : [],
      outline: form.outline ? form.outline.split('\n').filter(Boolean) : [],
    });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-row">
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input className="form-input" value={form.title} onChange={set('title')} required />
        </div>
        <div className="form-group">
          <label className="form-label">Slug *</label>
          <input className="form-input" value={form.slug} onChange={set('slug')} required placeholder="e.g. python" />
        </div>
      </div>
      <div className="admin-form-row">
        <div className="form-group">
          <label className="form-label">Category</label>
          <input className="form-input" value={form.category} onChange={set('category')} placeholder="e.g. programming" />
        </div>
        <div className="form-group">
          <label className="form-label">Level</label>
          <select className="form-select" value={form.level} onChange={set('level')}>
            <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea className="form-textarea" value={form.description} onChange={set('description')} rows={3} />
      </div>
      <div className="admin-form-row">
        <div className="form-group">
          <label className="form-label">Duration (weeks)</label>
          <input className="form-input" type="number" value={form.durationWeeks} onChange={set('durationWeeks')} min={1} />
        </div>
        <div className="form-group">
          <label className="form-label">Preview %</label>
          <input className="form-input" type="number" value={form.previewPercent} onChange={set('previewPercent')} min={0} max={100} />
        </div>
      </div>
      <div className="admin-form-row">
        <div className="form-group">
          <label className="form-label">Icon key</label>
          <input className="form-input" value={form.iconKey} onChange={set('iconKey')} placeholder="e.g. python" />
        </div>
        <div className="form-group">
          <label className="form-label">Color</label>
          <input className="form-input" type="color" value={form.color} onChange={set('color')} style={{ height: 42, padding: '4px 8px' }} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Objectives (one per line)</label>
        <textarea className="form-textarea" value={form.objectives} onChange={set('objectives')} rows={3} placeholder="Write clean Python programs..." />
      </div>
      <div className="form-group">
        <label className="form-label">Outline (one per line)</label>
        <textarea className="form-textarea" value={form.outline} onChange={set('outline')} rows={3} placeholder="Python syntax and variables..." />
      </div>
      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input type="checkbox" id="isPublished" checked={form.isPublished} onChange={setCheck('isPublished')} />
        <label htmlFor="isPublished" className="form-label" style={{ margin: 0 }}>Published</label>
      </div>
      <div className="admin-form-actions">
        <button type="button" className="btn btn-secondary btn-md" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary btn-md" disabled={loading}>
          {loading ? 'Saving…' : 'Save Course'}
        </button>
      </div>
    </form>
  );
}

export default function AdminCoursesPage() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(null); // null | 'create' | course object
  const [error, setError] = useState('');

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: adminService.getCourses,
  });

  const createMutation = useMutation({
    mutationFn: adminService.createCourse,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-courses'] }); setModal(null); },
    onError: err => setError(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => adminService.updateCourse(id, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-courses'] }); setModal(null); },
    onError: err => setError(err.message),
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ id, isPublished }) => isPublished ? adminService.unpublishCourse(id) : adminService.publishCourse(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-courses'] }),
  });

  const [syncingId, setSyncingId] = useState(null);
  const syncMutation = useMutation({
    mutationFn: (id) => { setSyncingId(id); return adminService.syncCourseContent(id); },
    onSuccess: (data) => {
      setSyncingId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['course-content'] });
      const s = data?.summary;
      if (s) alert(`Synced: ${s.moduleCount} modules, ${s.lessonCount} lessons`);
    },
    onError: (err) => { setSyncingId(null); alert(err.message || 'Sync failed.'); },
  });

  const columns = [
    { label: 'Course', render: r => (
      <div>
        <div style={{ fontWeight: 'var(--weight-medium)', color: 'var(--color-text)' }}>{r.title}</div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{r.slug}</div>
      </div>
    )},
    { label: 'Category', key: 'category' },
    { label: 'Level', key: 'level' },
    { label: 'Duration', render: r => `${r.durationWeeks}w` },
    { label: 'Preview', render: r => `${r.previewPercent}%` },
    { label: 'Status', render: r => <StatusBadge status={r.isPublished ? 'published' : 'archived'} /> },
    { label: 'Actions', render: r => (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Link to={`/admin/courses/${r.id}`} className="btn btn-primary btn-sm">Manage</Link>
        <button className="btn btn-secondary btn-sm" onClick={() => { setError(''); setModal(r); }}>Edit</button>
        <button
          className={`btn btn-sm ${r.isPublished ? 'btn-danger' : 'btn-accent'}`}
          onClick={() => togglePublishMutation.mutate({ id: r.id, isPublished: r.isPublished })}
        >
          {r.isPublished ? 'Unpublish' : 'Publish'}
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => syncMutation.mutate(r.id)}
          disabled={syncingId === r.id}
          title="Sync slide content into modules and lessons"
        >
          {syncingId === r.id ? 'Syncing…' : 'Sync'}
        </button>
      </div>
    )},
  ];

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Courses"
        description={`${courses.length} courses`}
        action={<button className="btn btn-primary btn-md" onClick={() => { setError(''); setModal('create'); }}>+ New Course</button>}
      />

      {isLoading
        ? <TableSkeleton rows={6} cols={7} />
        : <AdminTable columns={columns} rows={courses} emptyText="No courses yet." />
      }

      <AdminModal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === 'create' ? 'New Course' : `Edit — ${modal?.title}`}
        size="lg"
      >
        {error && <div className="alert alert-danger">{error}</div>}
        <CourseForm
          initial={modal === 'create' ? EMPTY_FORM : {
            ...modal,
            objectives: (modal?.objectives || []).join('\n'),
            outline: (modal?.outline || []).join('\n'),
          }}
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
