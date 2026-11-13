import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { cohortsService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function CohortApplicationForm({ course, onSuccess, onCancel }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    preferredStartDate: '',
    notes: '',
  });
  const [error, setError] = useState('');

  const { data: cohortsData } = useQuery({
    queryKey: ['cohorts', course?.mongoId],
    queryFn: () => cohortsService.getByCourse(course.mongoId),
    enabled: !!course?.mongoId,
  });

  const cohorts = cohortsData?.cohorts || [];
  const upcomingCohort = cohorts.find(c => c.status === 'upcoming') || cohorts[0];

  const mutation = useMutation({
    mutationFn: (payload) => cohortsService.submitApplication(payload),
    onSuccess: () => onSuccess?.(),
    onError: (err) => setError(err.message || 'Submission failed. Please try again.'),
  });

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.fullName || !form.email || !form.phone) {
      setError('Please fill in all required fields.');
      return;
    }
    mutation.mutate({
      applicationType: 'cohort_training',
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      preferredStartDate: form.preferredStartDate || undefined,
      notes: form.notes,
      sourcePage: window.location.href,
      courseSlug: course.slug,
      cohortId: upcomingCohort?._id || upcomingCohort?.id || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {upcomingCohort && (
        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
          Next cohort: <strong>{upcomingCohort.name}</strong> — starts{' '}
          {new Date(upcomingCohort.start_date || upcomingCohort.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="form-group">
        <label className="form-label">Full name *</label>
        <input className="form-input" value={form.fullName} onChange={set('fullName')} placeholder="Ada Lovelace" required />
      </div>
      <div className="form-group">
        <label className="form-label">Email address *</label>
        <input className="form-input" type="email" value={form.email} onChange={set('email')} placeholder="ada@example.com" required />
      </div>
      <div className="form-group">
        <label className="form-label">Phone number *</label>
        <input className="form-input" type="tel" value={form.phone} onChange={set('phone')} placeholder="+234 800 000 0000" required />
      </div>
      <div className="form-group">
        <label className="form-label">Preferred start date</label>
        <input className="form-input" type="date" value={form.preferredStartDate} onChange={set('preferredStartDate')} />
      </div>
      <div className="form-group">
        <label className="form-label">Additional notes</label>
        <textarea className="form-textarea" value={form.notes} onChange={set('notes')} placeholder="Any questions or preferences..." rows={3} />
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
        <button type="button" className="btn btn-secondary btn-md" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary btn-md" disabled={mutation.isPending}>
          {mutation.isPending ? 'Submitting…' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
}
