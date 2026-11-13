import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/api';
import { AdminModal, TableSkeleton } from '../../components/admin';
import './MaterialsManager.css';

function MaterialForm({ initial = {}, courses, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    type: initial.type || 'link',
    url: initial.url || '',
    courseId: initial.courseId || '',
  });

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title: form.title.trim(), type: form.type, url: form.url.trim(), courseId: form.courseId || undefined });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input className="form-input" value={form.title} onChange={set('title')} required autoFocus placeholder="e.g. Python Cheat Sheet" />
      </div>
      <div className="admin-form-row">
        <div className="form-group">
          <label className="form-label">Type</label>
          <select className="form-select" value={form.type} onChange={set('type')}>
            <option value="link">Link</option>
            <option value="pdf">PDF</option>
          </select>
        </div>
        {courses && (
          <div className="form-group">
            <label className="form-label">Course <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(optional override)</span></label>
            <select className="form-select" value={form.courseId} onChange={set('courseId')}>
              <option value="">Current course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
        )}
      </div>
      <div className="form-group">
        <label className="form-label">URL *</label>
        <input className="form-input" type="url" value={form.url} onChange={set('url')} required placeholder="https://…" />
      </div>
      <div className="admin-form-actions">
        <button type="button" className="btn btn-secondary btn-md" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary btn-md" disabled={loading}>
          {loading ? 'Saving…' : 'Save Material'}
        </button>
      </div>
    </form>
  );
}

export default function MaterialsManager({ courseId, courseSlug }) {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(null); // null | 'create' | material

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ['admin-materials', courseId],
    queryFn: () => adminService.getMaterials(`courseSlug=${courseSlug}`),
    enabled: !!courseSlug,
  });

  const createMutation = useMutation({
    mutationFn: (payload) => adminService.createAnnouncement({ ...payload, _isMaterial: true }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-materials', courseId] }); setModal(null); },
  });

  // Create uses existing POST /admin/materials endpoint
  const createMaterialMutation = useMutation({
    mutationFn: (payload) => fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/admin/materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ course_id: courseId, ...payload }),
    }).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-materials', courseId] }); setModal(null); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => adminService.updateMaterial(id, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-materials', courseId] }); setModal(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteMaterial,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-materials', courseId] }),
  });

  const typeIcon = (type) => type === 'pdf'
    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;

  return (
    <div className="materials-manager">
      <div className="materials-manager__header">
        <h2 className="materials-manager__title">Course Materials</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setModal('create')}>+ Add Material</button>
      </div>

      {isLoading
        ? <TableSkeleton rows={3} cols={3} />
        : materials.length === 0
          ? <p className="materials-manager__empty">No materials yet. Add PDFs or links for learners.</p>
          : (
            <div className="materials-list">
              {materials.map(m => (
                <div key={m.id} className="material-item">
                  <div className="material-item__icon material-item__icon--admin">
                    {typeIcon(m.type)}
                  </div>
                  <div className="material-item__info">
                    <span className="material-item__title">{m.title}</span>
                    <a href={m.url} target="_blank" rel="noopener noreferrer" className="material-item__url">{m.url}</a>
                  </div>
                  <div className="material-item__actions">
                    <span className="badge badge-neutral">{m.type}</span>
                    <button className="btn btn-secondary btn-sm" onClick={() => setModal(m)}>Edit</button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => { if (window.confirm('Delete this material?')) deleteMutation.mutate(m.id); }}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
      }

      <AdminModal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === 'create' ? 'Add Material' : `Edit — ${modal?.title}`}
        size="sm"
      >
        <MaterialForm
          initial={modal === 'create' ? { courseId } : modal}
          onSubmit={(payload) => modal === 'create'
            ? createMaterialMutation.mutate(payload)
            : updateMutation.mutate({ id: modal.id, payload })
          }
          onCancel={() => setModal(null)}
          loading={createMaterialMutation.isPending || updateMutation.isPending}
        />
      </AdminModal>
    </div>
  );
}
