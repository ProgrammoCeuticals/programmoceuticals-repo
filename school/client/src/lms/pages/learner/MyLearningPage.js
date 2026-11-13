import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { studentService, coursesService } from '../../services/api';
import { CourseIcon, SkeletonCard, EmptyState, LevelBadge } from '../../components/ui';
import './MyLearningPage.css';

function CourseProgressCard({ enrollment, progressData }) {
  const course = enrollment.course;
  if (!course) return null;

  const progress = progressData?.progress || [];
  const completed = progress.filter(p => p.status === 'completed').length;
  const total = progress.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const lastLesson = progress
    .filter(p => p.status === 'in_progress' || p.status === 'completed')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];

  const resumeSlug = lastLesson?.lesson?.slug;
  const resumePath = resumeSlug
    ? `/my-learning/${course.slug}/lesson/${resumeSlug}`
    : `/course/${course.slug}`;

  return (
    <div className="course-progress-card">
      <div className="course-progress-card__header">
        <CourseIcon iconKey={course.slug} color={null} size={44} />
        <div className="course-progress-card__info">
          <h3 className="course-progress-card__title">{course.title}</h3>
          <div className="course-progress-card__meta">
            <LevelBadge level={course.level} />
            <span className="course-progress-card__category">{course.category}</span>
          </div>
        </div>
        <span className={`badge ${enrollment.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
          {enrollment.status}
        </span>
      </div>

      {total > 0 && (
        <div className="course-progress-card__progress">
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-bar__label">{completed}/{total} lessons · {pct}%</span>
        </div>
      )}

      <div className="course-progress-card__actions">
        <Link to={`/course/${course.slug}`} className="btn btn-secondary btn-sm">Course Overview</Link>
        <Link to={resumePath} className="btn btn-primary btn-sm">
          {pct > 0 ? 'Continue Learning' : 'Start Learning'}
        </Link>
      </div>
    </div>
  );
}

function EnrolledCourseDetail({ courseSlug }) {
  const { data: progressData, isLoading } = useQuery({
    queryKey: ['lesson-progress', courseSlug],
    queryFn: () => studentService.getCourseLessonProgress(courseSlug),
  });

  const { data: contentData, isLoading: loadingContent } = useQuery({
    queryKey: ['course-content', courseSlug],
    queryFn: () => coursesService.getContent(courseSlug),
  });

  if (isLoading || loadingContent) return <div className="page-loading" style={{ minHeight: 200 }}><div className="spinner" /></div>;

  const progress = progressData?.progress || [];
  const modules = contentData?.modules || [];
  const progressMap = Object.fromEntries(progress.map(p => [p.lesson?.id, p]));

  return (
    <div className="course-detail-view">
      <Link to="/my-learning" className="btn btn-ghost btn-sm" style={{ marginBottom: '16px' }}>
        ← Back to My Learning
      </Link>
      <h2 style={{ marginBottom: '20px', fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-semibold)' }}>
        {contentData?.course?.title}
      </h2>
      {modules.map((mod, mi) => (
        <div key={mod.id} className="module-progress-block">
          <div className="module-progress-block__header">
            <span className="module-progress-block__num">Module {mi + 1}</span>
            <span className="module-progress-block__title">{mod.title}</span>
          </div>
          <div className="module-progress-block__lessons">
            {mod.lessons.map(lesson => {
              const lp = progressMap[lesson.id];
              const status = lp?.status || 'not_started';
              return (
                <Link
                  key={lesson.id}
                  to={`/my-learning/${courseSlug}/lesson/${lesson.slug}`}
                  className={`lesson-progress-row lesson-progress-row--${status}`}
                >
                  <div className="lesson-progress-row__status">
                    {status === 'completed'
                      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      : status === 'in_progress'
                        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
                    }
                  </div>
                  <span className="lesson-progress-row__title">{lesson.title}</span>
                  <span className="lesson-progress-row__duration">{lesson.estimatedDurationMinutes} min</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MyLearningPage() {
  const { courseSlug } = useParams();
  const [tab, setTab] = useState('self-paced');

  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['enrollments'],
    queryFn: studentService.getSelfPacedEnrollments,
  });

  const { data: progressMap = {} } = useQuery({
    queryKey: ['all-progress'],
    queryFn: async () => {
      const results = {};
      await Promise.allSettled(
        enrollments.map(async e => {
          if (e.course?.slug) {
            const data = await studentService.getCourseLessonProgress(e.course.slug);
            results[e.course.slug] = data;
          }
        })
      );
      return results;
    },
    enabled: enrollments.length > 0,
  });

  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: studentService.getDashboardSummary,
  });

  const cohortEnrollments = dashboardData?.enrollments?.cohorts || [];

  if (courseSlug) return (
    <div className="my-learning-page">
      <EnrolledCourseDetail courseSlug={courseSlug} />
    </div>
  );

  return (
    <div className="my-learning-page">
      <div className="page-header">
        <h1>My Learning</h1>
        <p>Your enrolled courses and cohort activity.</p>
      </div>

      <div className="tab-bar">
        <button className={`tab-btn ${tab === 'self-paced' ? 'active' : ''}`} onClick={() => setTab('self-paced')}>
          Self-Paced ({enrollments.length})
        </button>
        <button className={`tab-btn ${tab === 'cohorts' ? 'active' : ''}`} onClick={() => setTab('cohorts')}>
          Cohorts ({cohortEnrollments.length})
        </button>
      </div>

      {tab === 'self-paced' && (
        <div className="my-learning-grid">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : enrollments.length === 0
              ? (
                <EmptyState
                  title="No courses enrolled"
                  description="Browse courses and start learning for free."
                  action={<Link to="/courses" className="btn btn-primary btn-md">Browse Courses</Link>}
                />
              )
              : enrollments.map(e => (
                <CourseProgressCard
                  key={e.id}
                  enrollment={e}
                  progressData={progressMap[e.course?.slug]}
                />
              ))
          }
        </div>
      )}

      {tab === 'cohorts' && (
        <div className="my-learning-cohorts">
          {cohortEnrollments.length === 0
            ? (
              <EmptyState
                title="No cohort enrollments"
                description="Apply for a cohort from any course page."
                action={<Link to="/courses" className="btn btn-secondary btn-md">Browse Courses</Link>}
              />
            )
            : (
              <div className="my-learning-grid">
                {cohortEnrollments.map(e => (
                  <div key={e.id} className="course-progress-card">
                    <div className="course-progress-card__header">
                      <CourseIcon iconKey={e.course?.slug || ''} color={null} size={44} />
                      <div className="course-progress-card__info">
                        <h3 className="course-progress-card__title">{e.cohort?.name || e.course?.title}</h3>
                        <div className="course-progress-card__meta">
                          {e.course?.title && <span className="course-progress-card__category">{e.course.title}</span>}
                        </div>
                      </div>
                      <span className={`badge ${e.cohort?.status === 'active' ? 'badge-success' : 'badge-primary'}`}>
                        {e.cohort?.status || 'enrolled'}
                      </span>
                    </div>
                    <div className="cohort-enrollment-details">
                      {e.cohort?.instructor && (
                        <div className="cohort-detail-row">
                          <span>Instructor</span>
                          <span>{e.cohort.instructor}</span>
                        </div>
                      )}
                      {e.cohort?.startDate && (
                        <div className="cohort-detail-row">
                          <span>Start date</span>
                          <span>{new Date(e.cohort.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                      )}
                      {e.cohort?.schedule?.timeSlot && (
                        <div className="cohort-detail-row">
                          <span>Schedule</span>
                          <span>{e.cohort.schedule.daysPerWeek}x/week · {e.cohort.schedule.hoursPerSession}h · {e.cohort.schedule.timeSlot}</span>
                        </div>
                      )}
                      {e.cohort?.durationWeeks && (
                        <div className="cohort-detail-row">
                          <span>Duration</span>
                          <span>{e.cohort.durationWeeks} weeks</span>
                        </div>
                      )}
                    </div>
                    {e.course?.slug && (
                      <div className="course-progress-card__actions">
                        <Link to={`/course/${e.course.slug}`} className="btn btn-primary btn-sm">View Course</Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          }
        </div>
      )}
    </div>
  );
}
