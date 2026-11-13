import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService, coursesService, authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './AccountPage.css';

function SubmissionsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['student-submissions-all'],
    queryFn: () => studentService.getSubmissions(),
  });

  const submissions = data?.submissions || [];

  const statusClass = {
    submitted: 'badge-warning',
    graded: 'badge-success',
    returned: 'badge-primary',
    draft: 'badge-neutral',
  };

  return (
    <div className="account-section">
      <h2 className="account-section__title">Assessment Submissions</h2>
      {isLoading
        ? <div className="spinner" style={{ margin: '20px auto' }} />
        : submissions.length === 0
          ? <p className="account-section__empty">No submissions yet.</p>
          : (
            <div className="submissions-list">
              {submissions.map(sub => (
                <div key={sub.id} className="submission-history-row">
                  <div className="submission-history-row__info">
                    <span className="submission-history-row__title">
                      {sub.assessment?.title || 'Assessment'}
                    </span>
                    <span className="submission-history-row__meta">
                      {sub.assessment?.type} · Attempt {sub.attemptNumber} ·{' '}
                      {new Date(sub.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {sub.feedback && (
                      <span className="submission-history-row__feedback">{sub.feedback}</span>
                    )}
                  </div>
                  <div className="submission-history-row__right">
                    {sub.score !== null && (
                      <span className="submission-history-row__score">{sub.score}%</span>
                    )}
                    <span className={`badge ${statusClass[sub.status] || 'badge-neutral'}`}>{sub.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )
      }
    </div>
  );
}

function ProfileSection({ user }) {
  const { updateUser } = useAuth();
  const [name, setName] = useState(user.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: (payload) => authService.updateProfile(payload),
    onSuccess: (data) => {
      updateUser({ name: data.user.name });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
    onError: (err) => setError(err.message || 'Update failed.'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    const payload = {};
    if (name.trim() && name.trim() !== user.name) payload.name = name.trim();
    if (newPassword) { payload.currentPassword = currentPassword; payload.newPassword = newPassword; }
    if (Object.keys(payload).length === 0) return;
    mutation.mutate(payload);
  };

  return (
    <div className="account-section">
      <h2 className="account-section__title">Profile</h2>
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="profile-form__avatar">{user.name?.charAt(0).toUpperCase()}</div>

        <div className="form-field">
          <label className="form-label">Full name</label>
          <input
            className="form-input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your full name"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={user.email} disabled />
          <span className="form-hint">Email cannot be changed.</span>
        </div>

        <div className="profile-form__divider">Change password</div>

        <div className="form-field">
          <label className="form-label">Current password</label>
          <input
            className="form-input"
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="Required to set a new password"
            autoComplete="current-password"
          />
        </div>

        <div className="form-field">
          <label className="form-label">New password</label>
          <input
            className="form-input"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Confirm new password</label>
          <input
            className="form-input"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            autoComplete="new-password"
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="account-section__actions">
          <button className="btn btn-primary btn-md" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving…' : 'Save Changes'}
          </button>
          {saved && <span className="save-confirm">Saved ✓</span>}
        </div>
      </form>
    </div>
  );
}

function InterestsSection({ user }) {
  const { updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(user.interestedCourses || []);
  const [saved, setSaved] = useState(false);

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: coursesService.list,
  });

  const mutation = useMutation({
    mutationFn: () => studentService.updateInterests(selected),
    onSuccess: (data) => {
      updateUser({ interestedCourses: data.user.interestedCourses });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const toggle = (slug) => {
    setSelected(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
    setSaved(false);
  };

  return (
    <div className="account-section">
      <h2 className="account-section__title">Course Interests</h2>
      <p className="account-section__sub">Select courses you're interested in. This helps us personalise your experience.</p>
      <div className="interests-grid">
        {courses.map(course => (
          <button
            key={course.slug}
            type="button"
            className={`interest-chip ${selected.includes(course.slug) ? 'active' : ''}`}
            onClick={() => toggle(course.slug)}
          >
            {course.title}
          </button>
        ))}
      </div>
      <div className="account-section__actions">
        <button
          className="btn btn-primary btn-md"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Saving…' : 'Save Interests'}
        </button>
        {saved && <span className="save-confirm">Saved</span>}
      </div>
    </div>
  );
}

function PaymentsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: studentService.getPayments,
  });

  const payments = data?.payments || [];

  const statusClass = {
    initiated: 'badge-neutral',
    pending_review: 'badge-warning',
    confirmed: 'badge-success',
    failed: 'badge-danger',
    refunded: 'badge-neutral',
  };

  return (
    <div className="account-section">
      <h2 className="account-section__title">Payment History</h2>
      {isLoading
        ? <div className="spinner" style={{ margin: '20px auto' }} />
        : payments.length === 0
          ? <p className="account-section__empty">No payment records.</p>
          : (
            <div className="payments-table">
              <div className="payments-table__head">
                <span>Reference</span>
                <span>Type</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Date</span>
              </div>
              {payments.map(p => (
                <div key={p.id} className="payments-table__row">
                  <span className="payments-table__ref">{p.reference}</span>
                  <span style={{ textTransform: 'capitalize' }}>{p.type?.replace('_', ' ')}</span>
                  <span>₦{(p.amount / 100).toLocaleString()}</span>
                  <span><span className={`badge ${statusClass[p.status] || 'badge-neutral'}`}>{p.status?.replace('_', ' ')}</span></span>
                  <span>{new Date(p.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              ))}
            </div>
          )
      }
    </div>
  );
}

export default function AccountPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [verifyStatus, setVerifyStatus] = useState(null);

  // Auto-verify Paystack callback on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get('reference') || params.get('trxref');
    if (!reference) return;

    // Clean the URL immediately
    window.history.replaceState({}, '', window.location.pathname + window.location.hash.split('?')[0]);

    setVerifyStatus('verifying');
    studentService.verifyPayment(reference)
      .then(() => {
        setVerifyStatus('success');
        queryClient.invalidateQueries({ queryKey: ['payments'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      })
      .catch(() => setVerifyStatus('failed'));
  }, []);

  return (
    <div className="account-page">
      <div className="page-header">
        <h1>Account</h1>
        <p>Manage your profile, interests, and payment history.</p>
      </div>

      {verifyStatus === 'verifying' && (
        <div className="alert alert-info" style={{ marginBottom: 'var(--space-4)' }}>
          Verifying your payment…
        </div>
      )}
      {verifyStatus === 'success' && (
        <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)' }}>
          Payment verified successfully.
        </div>
      )}
      {verifyStatus === 'failed' && (
        <div className="alert alert-danger" style={{ marginBottom: 'var(--space-4)' }}>
          Payment verification failed. Please contact support if you were charged.
        </div>
      )}

      <div className="account-sections">
        <ProfileSection user={user} />
        <InterestsSection user={user} />
        <SubmissionsSection />
        <PaymentsSection />
      </div>
    </div>
  );
}
