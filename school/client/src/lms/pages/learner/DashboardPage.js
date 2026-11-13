import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { studentService, cohortsService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { CourseIcon, SkeletonCard, EmptyState } from '../../components/ui';
import './DashboardPage.css';

function StatCard({ label, value, to }) {
  const inner = (
    <div className="stat-card">
      <span className="stat-card__value">{value ?? '—'}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  );
  return to ? <Link to={to} className="stat-card-link">{inner}</Link> : inner;
}

function ContinueLearningCard({ continueLearning }) {
  if (!continueLearning?.lesson || !continueLearning?.course) return null;
  const { course, lesson, module: mod } = continueLearning;
  return (
    <div className="continue-card">
      <div className="continue-card__label">Continue where you left off</div>
      <div className="continue-card__course">{course.title}</div>
      {mod && <div className="continue-card__module">{mod.title}</div>}
      <div className="continue-card__lesson">{lesson.title}</div>
      <Link
        to={`/my-learning/${course.slug}/lesson/${lesson.slug}`}
        className="btn btn-primary btn-sm"
        style={{ marginTop: 'var(--space-3)', alignSelf: 'flex-start' }}
      >
        Continue Learning →
      </Link>
    </div>
  );
}

function EnrollmentRow({ enrollment }) {
  const course = enrollment.course;
  if (!course) return null;
  return (
    <div className="enrollment-row">
      <CourseIcon iconKey={course.slug} color={null} size={36} />
      <div className="enrollment-row__info">
        <span className="enrollment-row__title">{course.title}</span>
        <span className="enrollment-row__meta">{course.level} · {course.category}</span>
      </div>
      <div className="enrollment-row__actions">
        <span className={`badge ${enrollment.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
          {enrollment.status}
        </span>
        <Link to={`/my-learning/${course.slug}`} className="btn btn-primary btn-sm">Continue</Link>
      </div>
    </div>
  );
}

function CohortRow({ enrollment }) {
  const cohort = enrollment.cohort;
  const course = enrollment.course;
  if (!cohort) return null;
  return (
    <div className="enrollment-row">
      <div className="enrollment-row__info">
        <span className="enrollment-row__title">{cohort.name}</span>
        <span className="enrollment-row__meta">
          {course?.title} · {cohort.instructor || 'ProgrammoCeuticals Faculty'}
        </span>
        {cohort.startDate && (
          <span className="enrollment-row__meta">
            Starts {new Date(cohort.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        )}
      </div>
      <span className={`badge ${cohort.status === 'active' ? 'badge-success' : 'badge-primary'}`}>
        {cohort.status}
      </span>
    </div>
  );
}

function NotificationRow({ notification }) {
  return (
    <div className={`notif-row ${!notification.isRead ? 'notif-row--unread' : ''}`}>
      <div className="notif-row__dot" />
      <div className="notif-row__body">
        <span className="notif-row__title">{notification.title}</span>
        <span className="notif-row__msg">{notification.message}</span>
      </div>
      <span className="notif-row__time">
        {new Date(notification.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: studentService.getDashboardSummary,
  });

  const summary = data?.summary || {};
  const selfPaced = data?.enrollments?.selfPaced || [];
  const cohorts = data?.enrollments?.cohorts || [];
  const certificates = data?.certificates || [];
  const notifications = data?.notifications || [];
  const continueLearning = data?.continueLearning || null;

  // Fetch announcements for enrolled cohorts
  const cohortIds = cohorts.map(e => e.cohort?.id).filter(Boolean);
  const { data: announcementsData } = useQuery({
    queryKey: ['learner-announcements', cohortIds.join(',')],
    queryFn: async () => {
      if (cohortIds.length === 0) return [];
      const results = await Promise.allSettled(
        cohortIds.map(id =>
          fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/admin/announcements?cohortId=${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }).then(r => r.json()).then(d => d.announcements || [])
        )
      );
      return results.flatMap(r => r.status === 'fulfilled' ? r.value : []);
    },
    enabled: cohortIds.length > 0,
  });
  const announcements = announcementsData || [];

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p>Here's what's happening with your learning.</p>
      </div>

      {isLoading ? (
        <div className="dashboard-loading">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          <div className="dashboard-stats">
            <StatCard label="Active Courses" value={summary.selfPacedEnrollments} to="/my-learning" />
            <StatCard label="Lessons Completed" value={summary.completedLessons} />
            <StatCard label="Unread Notifications" value={summary.unreadNotifications} to="/notifications" />
            <StatCard label="Certificates" value={summary.certificates} to="/certificates" />
          </div>

          {continueLearning && <ContinueLearningCard continueLearning={continueLearning} />}

          <div className="dashboard-grid">
            {/* Self-paced */}
            <section className="dashboard-section">
              <div className="dashboard-section__header">
                <h2>My Learning</h2>
                <Link to="/my-learning" className="dashboard-section__link">View all</Link>
              </div>
              {selfPaced.length === 0
                ? <EmptyState title="No active courses" description="Browse courses and start learning for free." action={<Link to="/courses" className="btn btn-primary btn-sm">Browse Courses</Link>} />
                : selfPaced.slice(0, 4).map(e => <EnrollmentRow key={e.id} enrollment={e} />)
              }
            </section>

            {/* Cohorts */}
            <section className="dashboard-section">
              <div className="dashboard-section__header">
                <h2>My Cohorts</h2>
                <Link to="/cohorts" className="dashboard-section__link">View all</Link>
              </div>
              {cohorts.length === 0
                ? <EmptyState title="No cohort enrollments" description="Apply for a cohort from any course page." />
                : cohorts.slice(0, 3).map(e => <CohortRow key={e.id} enrollment={e} />)
              }
            </section>

            {/* Notifications */}
            <section className="dashboard-section">
              <div className="dashboard-section__header">
                <h2>
                  Notifications
                  {summary.unreadNotifications > 0 && <span className="notif-badge">{summary.unreadNotifications}</span>}
                </h2>
                <Link to="/notifications" className="dashboard-section__link">View all</Link>
              </div>
              {notifications.length === 0
                ? <EmptyState title="No notifications" description="You're all caught up." />
                : notifications.map(n => <NotificationRow key={n.id} notification={n} />)
              }
            </section>

            {/* Certificates */}
            <section className="dashboard-section">
              <div className="dashboard-section__header">
                <h2>Certificates</h2>
                <Link to="/certificates" className="dashboard-section__link">View all</Link>
              </div>
              {certificates.length === 0
                ? <EmptyState title="No certificates yet" description="Complete a course and apply for certification." />
                : certificates.slice(0, 3).map(cert => (
                  <div key={cert.id || cert.certificateNumber} className="cert-row">
                    <div className="cert-row__info">
                      <span className="cert-row__course">{cert.course?.title}</span>
                      <span className="cert-row__number">{cert.certificateNumber}</span>
                    </div>
                    <span className="badge badge-success">Issued</span>
                  </div>
                ))
              }
            </section>

            {/* Announcements */}
            {announcements.length > 0 && (
              <section className="dashboard-section">
                <div className="dashboard-section__header">
                  <h2>Announcements</h2>
                </div>
                {announcements.slice(0, 3).map((a, i) => (
                  <div key={a.id || i} className="announcement-row">
                    <div className="announcement-row__cohort">{a.cohort?.name || 'General'}</div>
                    <p className="announcement-row__message">{a.message}</p>
                    {a.createdAt && (
                      <span className="announcement-row__date">
                        {new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                ))}
              </section>
            )}
          </div>
        </>
      )}
    </div>
  );
}
