import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/api';
import { AdminPageHeader, AdminModal, StatusBadge, TableSkeleton } from '../../components/admin';
import AssessmentManager from '../../components/admin/AssessmentManager';
import MaterialsManager from '../../components/admin/MaterialsManager';
import './AdminCourseDetailPage.css';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const slugify = (v) =>
  String(v || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

// ─── Module Form ─────────────────────────────────────────────────────────────

function ModuleForm({ initial = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    slug: initial.slug || '',
    description: initial.description || '',
    orderIndex: initial.orderIndex || '',
    isPublished: initial.isPublished !== false,
  });

  const set = (f) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((p) => ({
      ...p,
      [f]: val,
      ...(f === 'title' && !initial.slug ? { slug: slugify(e.target.value) } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      description: form.description.trim(),
      ...(form.orderIndex !== '' ? { orderIndex: Number(form.orderIndex) } : {}),
      isPublished: form.isPublished,
    });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input className="form-input" value={form.title} onChange={set('title')} required autoFocus />
      </div>
      <div className="form-group">
        <label className="form-label">Slug *</label>
        <input className="form-input" value={form.slug} onChange={set('slug')} required placeholder="auto-generated from title" />
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea className="form-textarea" value={form.description} onChange={set('description')} rows={2} />
      </div>
      <div className="form-group">
        <label className="form-label">Order index <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(leave blank for auto)</span></label>
        <input className="form-input" type="number" value={form.orderIndex} onChange={set('orderIndex')} min={1} placeholder="auto" />
      </div>
      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input type="checkbox" id="mod-published" checked={form.isPublished} onChange={set('isPublished')} />
        <label htmlFor="mod-published" className="form-label" style={{ margin: 0 }}>Published</label>
      </div>
      <div className="admin-form-actions">
        <button type="button" className="btn btn-secondary btn-md" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary btn-md" disabled={loading}>
          {loading ? 'Saving…' : 'Save Module'}
        </button>
      </div>
    </form>
  );
}

// ─── Lesson Form ──────────────────────────────────────────────────────────────

const LESSON_TYPES = ['hero', 'two-column', 'infographic', 'diagram', 'steps', 'code-plus', 'slide', 'video', 'text'];

function LessonForm({ initial = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    slug: initial.slug || '',
    lessonType: initial.lessonType || 'slide',
    summary: initial.summary || '',
    estimatedDurationMinutes: initial.estimatedDurationMinutes || 5,
    slideCount: initial.slideCount || 1,
    orderIndex: initial.orderIndex || '',
    isPublished: initial.isPublished !== false,
    contentRaw: initial.content ? JSON.stringify(initial.content, null, 2) : '{}',
  });
  const [contentError, setContentError] = useState('');

  const set = (f) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((p) => ({
      ...p,
      [f]: val,
      ...(f === 'title' && !initial.slug ? { slug: slugify(e.target.value) } : {}),
    }));
    if (f === 'contentRaw') setContentError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let content = {};
    try {
      content = JSON.parse(form.contentRaw || '{}');
    } catch {
      setContentError('Content must be valid JSON.');
      return;
    }
    onSubmit({
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      lessonType: form.lessonType,
      summary: form.summary.trim(),
      estimatedDurationMinutes: Number(form.estimatedDurationMinutes),
      slideCount: Number(form.slideCount),
      ...(form.orderIndex !== '' ? { orderIndex: Number(form.orderIndex) } : {}),
      isPublished: form.isPublished,
      content,
    });
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-row">
        <div className="form-group">
          <label className="form-label">Title *</label>
          <input className="form-input" value={form.title} onChange={set('title')} required autoFocus />
        </div>
        <div className="form-group">
          <label className="form-label">Slug *</label>
          <input className="form-input" value={form.slug} onChange={set('slug')} required />
        </div>
      </div>
      <div className="admin-form-row">
        <div className="form-group">
          <label className="form-label">Lesson type</label>
          <select className="form-select" value={form.lessonType} onChange={set('lessonType')}>
            {LESSON_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Est. duration (min)</label>
          <input className="form-input" type="number" value={form.estimatedDurationMinutes} onChange={set('estimatedDurationMinutes')} min={1} />
        </div>
      </div>
      <div className="admin-form-row">
        <div className="form-group">
          <label className="form-label">Slide count</label>
          <input className="form-input" type="number" value={form.slideCount} onChange={set('slideCount')} min={1} />
        </div>
        <div className="form-group">
          <label className="form-label">Order index <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(blank = auto)</span></label>
          <input className="form-input" type="number" value={form.orderIndex} onChange={set('orderIndex')} min={1} placeholder="auto" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Summary</label>
        <input className="form-input" value={form.summary} onChange={set('summary')} placeholder="Brief description of this lesson" />
      </div>
      <div className="form-group">
        <label className="form-label">
          Content <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(JSON)</span>
        </label>
        <textarea
          className="form-textarea"
          value={form.contentRaw}
          onChange={set('contentRaw')}
          rows={6}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
        />
        {contentError && <span className="form-error">{contentError}</span>}
      </div>
      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input type="checkbox" id="lesson-published" checked={form.isPublished} onChange={set('isPublished')} />
        <label htmlFor="lesson-published" className="form-label" style={{ margin: 0 }}>Published</label>
      </div>
      <div className="admin-form-actions">
        <button type="button" className="btn btn-secondary btn-md" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary btn-md" disabled={loading}>
          {loading ? 'Saving…' : 'Save Lesson'}
        </button>
      </div>
    </form>
  );
}

// ─── Lesson Row ───────────────────────────────────────────────────────────────

function LessonRow({ lesson, onEdit, onDelete, deleting }) {
  return (
    <div className="lesson-row-item">
      <div className="lesson-row-item__left">
        <span className="lesson-row-item__num">{lesson.orderIndex}</span>
        <div>
          <span className="lesson-row-item__title">{lesson.title}</span>
          <span className="lesson-row-item__meta">
            {lesson.lessonType} · {lesson.estimatedDurationMinutes}min
            {lesson.summary && ` · ${lesson.summary}`}
          </span>
        </div>
      </div>
      <div className="lesson-row-item__right">
        <StatusBadge status={lesson.isPublished ? 'published' : 'archived'} />
        <button className="btn btn-secondary btn-sm" onClick={() => onEdit(lesson)}>Edit</button>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(lesson.id)} disabled={deleting}>Delete</button>
      </div>
    </div>
  );
}

// ─── Module Block ─────────────────────────────────────────────────────────────

function ModuleBlock({ module, courseId, onEditModule, onDeleteModule }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [lessonModal, setLessonModal] = useState(null); // null | 'create' | lesson
  const [deletingLesson, setDeletingLesson] = useState(null);

  const { data: lessons = [], isLoading: loadingLessons } = useQuery({
    queryKey: ['admin-lessons', module.id],
    queryFn: () => adminService.getLessons(module.id),
    enabled: open,
  });

  const createLessonMutation = useMutation({
    mutationFn: (payload) => adminService.createLesson(module.id, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-lessons', module.id] }); queryClient.invalidateQueries({ queryKey: ['admin-modules', courseId] }); setLessonModal(null); },
  });

  const updateLessonMutation = useMutation({
    mutationFn: ({ id, payload }) => adminService.updateLesson(id, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-lessons', module.id] }); setLessonModal(null); },
  });

  const deleteLessonMutation = useMutation({
    mutationFn: (id) => { setDeletingLesson(id); return adminService.deleteLesson(id); },
    onSuccess: () => { setDeletingLesson(null); queryClient.invalidateQueries({ queryKey: ['admin-lessons', module.id] }); queryClient.invalidateQueries({ queryKey: ['admin-modules', courseId] }); },
    onError: () => setDeletingLesson(null),
  });

  return (
    <div className="module-block">
      <div className="module-block__header">
        <button className="module-block__toggle" onClick={() => setOpen(o => !o)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
          <span className="module-block__num">Module {module.orderIndex}</span>
          <span className="module-block__title">{module.title}</span>
          <span className="module-block__count">{module.lessonCount} lessons · {module.estimatedMinutes}min</span>
        </button>
        <div className="module-block__actions">
          <StatusBadge status={module.isPublished ? 'published' : 'archived'} />
          <button className="btn btn-secondary btn-sm" onClick={() => onEditModule(module)}>Edit</button>
          <button className="btn btn-danger btn-sm" onClick={() => onDeleteModule(module.id)}>Delete</button>
        </div>
      </div>

      {open && (
        <div className="module-block__body">
          {loadingLessons
            ? <div className="spinner" style={{ margin: '16px auto' }} />
            : lessons.length === 0
              ? <p className="module-block__empty">No lessons yet.</p>
              : lessons.map(lesson => (
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  onEdit={(l) => setLessonModal(l)}
                  onDelete={(id) => { if (window.confirm('Delete this lesson?')) deleteLessonMutation.mutate(id); }}
                  deleting={deletingLesson === lesson.id}
                />
              ))
          }
          <button
            className="btn btn-secondary btn-sm module-block__add-lesson"
            onClick={() => setLessonModal('create')}
          >
            + Add Lesson
          </button>
        </div>
      )}

      <AdminModal
        open={!!lessonModal}
        onClose={() => setLessonModal(null)}
        title={lessonModal === 'create' ? `New Lesson — ${module.title}` : `Edit Lesson — ${lessonModal?.title}`}
        size="lg"
      >
        <LessonForm
          initial={lessonModal === 'create' ? {} : lessonModal}
          onSubmit={(payload) => lessonModal === 'create'
            ? createLessonMutation.mutate(payload)
            : updateLessonMutation.mutate({ id: lessonModal.id, payload })
          }
          onCancel={() => setLessonModal(null)}
          loading={createLessonMutation.isPending || updateLessonMutation.isPending}
        />
      </AdminModal>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminCourseDetailPage() {
  const { courseId } = useParams();
  const queryClient = useQueryClient();
  const [moduleModal, setModuleModal] = useState(null); // null | 'create' | module
  const [syncResult, setSyncResult] = useState(null);

  const { data: courses = [] } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: adminService.getCourses,
  });

  const course = courses.find(c => c.id === courseId || c.slug === courseId);

  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['admin-modules', courseId],
    queryFn: () => adminService.getModules(courseId),
    enabled: !!courseId,
  });

  const createModuleMutation = useMutation({
    mutationFn: (payload) => adminService.createModule(courseId, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-modules', courseId] }); setModuleModal(null); },
  });

  const updateModuleMutation = useMutation({
    mutationFn: ({ id, payload }) => adminService.updateModule(id, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-modules', courseId] }); setModuleModal(null); },
  });

  const deleteModuleMutation = useMutation({
    mutationFn: adminService.deleteModule,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-modules', courseId] }),
  });

  const syncMutation = useMutation({
    mutationFn: () => adminService.syncCourseContent(courseId),
    onSuccess: (data) => {
      setSyncResult(data?.summary);
      queryClient.invalidateQueries({ queryKey: ['admin-modules', courseId] });
      queryClient.invalidateQueries({ queryKey: ['course-content', course?.slug] });
    },
  });

  return (
    <div className="admin-page">
      <div className="course-detail-nav">
        <Link to="/admin/courses" className="btn btn-ghost btn-sm">← All Courses</Link>
      </div>

      <AdminPageHeader
        title={course?.title || 'Course Builder'}
        description={course ? `${course.slug} · ${course.level} · ${course.category}` : courseId}
        action={
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="btn btn-secondary btn-md"
              onClick={() => syncMutation.mutate()}
              disabled={syncMutation.isPending}
              title="Sync slide data into modules and lessons"
            >
              {syncMutation.isPending ? 'Syncing…' : 'Sync Content'}
            </button>
            <button className="btn btn-primary btn-md" onClick={() => setModuleModal('create')}>
              + Add Module
            </button>
          </div>
        }
      />

      {syncResult && (
        <div className="alert alert-success" style={{ marginBottom: 'var(--space-5)' }}>
          Sync complete — {syncResult.moduleCount} modules, {syncResult.lessonCount} lessons.
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: '12px' }} onClick={() => setSyncResult(null)}>Dismiss</button>
        </div>
      )}

      {syncMutation.isError && (
        <div className="alert alert-danger" style={{ marginBottom: 'var(--space-5)' }}>
          {syncMutation.error?.message || 'Sync failed.'}
        </div>
      )}

      <div className="course-detail-meta">
        <div className="course-detail-meta__item">
          <span className="course-detail-meta__label">Modules</span>
          <span className="course-detail-meta__value">{modules.length}</span>
        </div>
        <div className="course-detail-meta__item">
          <span className="course-detail-meta__label">Total lessons</span>
          <span className="course-detail-meta__value">{modules.reduce((s, m) => s + (m.lessonCount || 0), 0)}</span>
        </div>
        <div className="course-detail-meta__item">
          <span className="course-detail-meta__label">Est. duration</span>
          <span className="course-detail-meta__value">{modules.reduce((s, m) => s + (m.estimatedMinutes || 0), 0)} min</span>
        </div>
        <div className="course-detail-meta__item">
          <span className="course-detail-meta__label">Status</span>
          <StatusBadge status={course?.isPublished ? 'published' : 'archived'} />
        </div>
      </div>

      <div className="course-detail-modules">
        {isLoading
          ? <TableSkeleton rows={4} cols={3} />
          : modules.length === 0
            ? (
              <div className="empty-state">
                <h3>No modules yet</h3>
                <p>Add a module manually or use Sync Content to import from slide data.</p>
              </div>
            )
            : modules.map(mod => (
              <ModuleBlock
                key={mod.id}
                module={mod}
                courseId={courseId}
                onEditModule={(m) => setModuleModal(m)}
                onDeleteModule={(id) => { if (window.confirm('Delete this module and all its lessons?')) deleteModuleMutation.mutate(id); }}
              />
            ))
        }
      </div>

      <AdminModal
        open={!!moduleModal}
        onClose={() => setModuleModal(null)}
        title={moduleModal === 'create' ? 'New Module' : `Edit Module — ${moduleModal?.title}`}
        size="md"
      >
        <ModuleForm
          initial={moduleModal === 'create' ? {} : moduleModal}
          onSubmit={(payload) => moduleModal === 'create'
            ? createModuleMutation.mutate(payload)
            : updateModuleMutation.mutate({ id: moduleModal.id, payload })
          }
          onCancel={() => setModuleModal(null)}
          loading={createModuleMutation.isPending || updateModuleMutation.isPending}
        />
      </AdminModal>

      <AssessmentManager courseId={courseId} />

      <MaterialsManager courseId={courseId} courseSlug={course?.slug} />
    </div>
  );
}
