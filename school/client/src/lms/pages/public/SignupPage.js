import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { coursesService } from '../../services/api';
import './AuthPages.css';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', interestedCourses: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: coursesService.list,
  });

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const toggleCourse = (slug) => {
    setForm(f => ({
      ...f,
      interestedCourses: f.interestedCourses.includes(slug)
        ? f.interestedCourses.filter(s => s !== slug)
        : [...f.interestedCourses, slug],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await signup(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <div className="auth-card__header">
          <img src="/logo.png" alt="ProgrammoCeuticals" className="auth-card__logo" />
          <h1 className="auth-card__title">Create your account</h1>
          <p className="auth-card__sub">Free access to all self-paced courses</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input className="form-input" value={form.name} onChange={set('name')} placeholder="Ada Lovelace" required autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="form-input" type="email" value={form.email} onChange={set('email')} placeholder="ada@example.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={form.password} onChange={set('password')} placeholder="At least 6 characters" required />
          </div>

          {courses.length > 0 && (
            <div className="form-group">
              <label className="form-label">Courses you're interested in <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(optional)</span></label>
              <div className="course-interests">
                {courses.map(course => (
                  <button
                    key={course.slug}
                    type="button"
                    className={`interest-chip ${form.interestedCourses.includes(course.slug) ? 'active' : ''}`}
                    onClick={() => toggleCourse(course.slug)}
                  >
                    {course.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-md auth-submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Free Account'}
          </button>
        </form>

        <p className="auth-card__switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
