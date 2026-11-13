import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services/api';
import { AdminModal, StatusBadge, TableSkeleton } from '../../components/admin';
import './AssessmentManager.css';

const slugify = (v) =>
  String(v || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

// ─── Assessment Form ──────────────────────────────────────────────────────────

function AssessmentForm({ initial = {}, modules, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    slug: initial.slug || '',
    type: initial.type || 'quiz',
    instructions: initial.instructions || '',
    passScore: initial.passScore ?? 70,
    maxAttempts: initial.maxAttempts ?? 3,
    moduleId: initial.moduleId || '',
    isPublished: initial.isPublished !== false,
    questionsRaw: initial.questions?.length
      ? JSON.stringify(initial.questions, null, 2)
      : '[]',
  });
  const [qError, setQError] = useState('');

  const set = (f) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((p) => ({
      ...p,
      [f]: val,
      ...(f === 'title' && !initial.slug ? { slug: slugify(e.target.value) } : {}),
    }));
    if (f === 'questionsRaw') setQError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let questions = [];
    try { questions = JSON.parse(form.questionsRaw || '[]'); } catch {
      setQError('Questions must be valid JSON array.');
      return;
    }
    onSubmit({
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      type: form.type,
      instructions: form.instructions.trim(),
      passScore: Number(form.passScore),
      maxAttempts: Number(form.maxAttempts),
      moduleId: form.moduleId || undefined,
      isPublished: form.isPublished,
      questions,
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
          <label className="form-label">Type</label>
          <select className="form-select" value={form.type} onChange={set('type')}>
            <option value="quiz">Quiz</option>
            <option value="assignment">Assignment</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Linked module <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(optional)</span></label>
          <select className="form-select" value={form.moduleId} onChange={set('moduleId')}>
            <option value="">Course-level</option>
            {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
        </div>
      </div>
      <div className="admin-form-row">
        <div className="form-group">
          <label className="form-label">Pass score (%)</label>
          <input className="form-input" type="number" value={form.passScore} onChange={set('passScore')} min={0} max={100} />
        </div>
        <div className="form-group">
          <label className="form-label">Max attempts</label>
          <input className="form-input" type="number" value={form.maxAttempts} onChange={set('maxAttempts')} min={1} max={20} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Instructions</label>
        <textarea className="form-textarea" value={form.instructions} onChange={set('instructions')} rows={3} placeholder="Answer all questions carefully." />
      </div>
      <div className="form-group">
        <label className="form-label">
          Questions <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(JSON array)</span>
        </label>
        <textarea
          className="form-textarea"
          value={form.questionsRaw}
          onChange={set('questionsRaw')}
          rows={6}
          style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
          placeholder={'[\n  { "id": 1, "question": "What is Python?", "type": "text" }\n]'}
        />
        {qError && <span className="form-error">{qError}</span>}
      </div>
      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input type="checkbox" id="assess-published" checked={form.isPublished} onChange={set('isPublished')} />
        <label htmlFor="assess-published" className="form-label" style={{ margin: 0 }}>Published</label>
      </div>
      <div className="admin-form-actions">
        <button type="button" className="btn btn-secondary btn-md" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary btn-md" disabled={loading}>
          {loading ? 'Saving…' : 'Save Assessment'}
        </button>
      </div>
    </form>
  );
}

// ─── Submission Grader ────────────────────────────────────────────────────────

function SubmissionGrader({ assessment, onClose }) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [gradeForm, setGradeForm] = useState({ status: 'graded', score: '', feedback: '' });
  const [error, setError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-submissions', assessment.id],
    queryFn: () => adminService.getSubmissions(assessment.id),
  });

  const submissions = data?.submissions || [];

  const gradeMutation = useMutation({
    mutationFn: () => adminService.gradeSubmission(selected.id, {
      status: gradeForm.status,
      score: gradeForm.score !== '' ? Number(gradeForm.score) : null,
      feedback: gradeForm.feedback,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-submissions', assessment.id] });
      setSelected(null);
    },
    onError: (err) => setError(err.message),
  });

  const openGrade = (sub) => {
    setError('');
    setGradeForm({ status: sub.status === 'submitted' ? 'graded' : sub.status, score: sub.score ?? '', feedback: sub.feedback || '' });
    setSelected(sub);
  };

  const statusClass = { submitted: 'badge-warning', graded: 'badge-success', returned: 'badge-primary', draft: 'badge-neutral' };

  return (
    <div>
      <div className="submission-grader__header">
        <h4>{assessment.title}</h4>
        <span className="badge badge-neutral">{assessment.type}</span>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Pass: {assessment.passScore}%</span>
      </div>

      {isLoading
        ? <TableSkeleton rows={4} cols={4} />
        : submissions.length === 0
          ? <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', padding: 'var(--space-6) 0' }}>No submissions yet.</p>
          : (
            <div className="submission-list">
              {submissions.map(sub => (
                <div key={sub.id} className="submission-item">
                  <div className="submission-item__info">
                    <span className="submission-item__student">{sub.student?.name || 'Unknown'}</span>
                    <span className="submission-item__meta">
                      Attempt {sub.attemptNumber} ·{' '}
                      {new Date(sub.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="submission-item__right">
                    {sub.score !== null && <span className="submission-item__score">{sub.score}%</span>}
                    <span className={`badge ${statusClass[sub.status] || 'badge-neutral'}`}>{sub.status}</span>
                    <button className="btn btn-secondary btn-sm" onClick={() => openGrade(sub)}>Grade</button>
                  </div>
                </div>
              ))}
            </div>
          )
      }

      <AdminModal open={!!selected} onClose={() => setSelected(null)} title="Grade Submission" size="sm">
        {selected && (
          <div className="admin-form">
            {error && <div className="alert alert-danger">{error}</div>}
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
              <strong>{selected.student?.name}</strong> — Attempt {selected.attemptNumber}
            </p>
            {selected.answers && (
              <div className="form-group">
                <label className="form-label">Submitted answers</label>
                <pre className="submission-answers">{JSON.stringify(selected.answers, null, 2)}</pre>
              </div>
            )}
            <div className="admin-form-row">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={gradeForm.status} onChange={e => setGradeForm(p => ({ ...p, status: e.target.value }))}>
                  <option value="graded">Graded</option>
                  <option value="returned">Returned</option>
                  <option value="submitted">Submitted</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Score (%)</label>
                <input className="form-input" type="number" min={0} max={100} value={gradeForm.score} onChange={e => setGradeForm(p => ({ ...p, score: e.target.value }))} placeholder="0–100" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Feedback</label>
              <textarea className="form-textarea" value={gradeForm.feedback} onChange={e => setGradeForm(p => ({ ...p, feedback: e.target.value }))} rows={3} placeholder="Good work. Consider improving…" />
            </div>
            <div className="admin-form-actions">
              <button type="button" className="btn btn-secondary btn-md" onClick={() => setSelected(null)}>Cancel</button>
              <button className="btn btn-primary btn-md" onClick={() => gradeMutation.mutate()} disabled={gradeMutation.isPending}>
                {gradeMutation.isPending ? 'Saving…' : 'Save Grade'}
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AssessmentManager({ courseId }) {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(null); // null | 'create' | assessment
  const [gradingAssessment, setGradingAssessment] = useState(null);

  const { data: assessments = [], isLoading } = useQuery({
    queryKey: ['admin-assessments', courseId],
    queryFn: () => adminService.getCourseAssessments(courseId),
    enabled: !!courseId,
  });

  const { data: modules = [] } = useQuery({
    queryKey: ['admin-modules', courseId],
    queryFn: () => adminService.getModules(courseId),
    enabled: !!courseId,
  });

  const createMutation = useMutation({
    mutationFn: (payload) => adminService.createAssessment(courseId, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-assessments', courseId] }); setModal(null); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => adminService.updateAssessment(id, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-assessments', courseId] }); setModal(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteAssessment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-assessments', courseId] }),
  });

  return (
    <div className="assessment-manager">
      <div className="assessment-manager__header">
        <h2 className="assessment-manager__title">Assessments</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setModal('create')}>+ Add Assessment</button>
      </div>

      {isLoading
        ? <TableSkeleton rows={3} cols={4} />
        : assessments.length === 0
          ? <p className="assessment-manager__empty">No assessments yet. Add a quiz or assignment.</p>
          : (
            <div className="assessment-list">
              {assessments.map(a => (
                <div key={a.id} className="assessment-item">
                  <div className="assessment-item__info">
                    <span className="assessment-item__title">{a.title}</span>
                    <span className="assessment-item__meta">
                      {a.type} · Pass {a.passScore}% · {a.maxAttempts} attempts · {a.questions?.length || 0} questions
                      {a.moduleId && ` · ${modules.find(m => m.id === a.moduleId)?.title || 'Module'}`}
                    </span>
                  </div>
                  <div className="assessment-item__actions">
                    <StatusBadge status={a.isPublished ? 'published' : 'archived'} />
                    <button className="btn btn-secondary btn-sm" onClick={() => setGradingAssessment(a)}>Submissions</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setModal(a)}>Edit</button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => { if (window.confirm('Delete this assessment and all submissions?')) deleteMutation.mutate(a.id); }}
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
        title={modal === 'create' ? 'New Assessment' : `Edit — ${modal?.title}`}
        size="lg"
      >
        <AssessmentForm
          initial={modal === 'create' ? {} : modal}
          modules={modules}
          onSubmit={(payload) => modal === 'create'
            ? createMutation.mutate(payload)
            : updateMutation.mutate({ id: modal.id, payload })
          }
          onCancel={() => setModal(null)}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      </AdminModal>

      <AdminModal
        open={!!gradingAssessment}
        onClose={() => setGradingAssessment(null)}
        title={`Submissions — ${gradingAssessment?.title || ''}`}
        size="lg"
      >
        {gradingAssessment && (
          <SubmissionGrader assessment={gradingAssessment} onClose={() => setGradingAssessment(null)} />
        )}
      </AdminModal>
    </div>
  );
}
