import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesService, studentService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Breadcrumb, CourseIcon, LevelBadge, Skeleton, Modal, EmptyState } from '../../components/ui';
import CohortApplicationForm from '../../components/course/CohortApplicationForm';
import CourseMaterials from '../../components/lesson/CourseMaterials';
import './CourseOverviewPage.css';

function AccessModelBlock({ access }) {
  return (
    <div className="access-model">
      <h3 className="access-model__title">How access works</h3>
      <div className="access-model__grid">
        <div className="access-model__item">
          <span className="badge badge-neutral">Guest</span>
          <p>Preview the first {access?.previewPercent || 20}% of lessons — no account needed.</p>
        </div>
        <div className="access-model__item">
          <span className="badge badge-success">Registered</span>
          <p>Full self-paced access to all lessons. Free. Register once.</p>
        </div>
        <div className="access-model__item">
          <span className="badge badge-warning">Cohort</span>
          <p>Live instructor-led training with a structured schedule. Paid.</p>
        </div>
        <div className="access-model__item">
          <span className="badge badge-warning">Certificate</span>
          <p>Verified certificate after course completion and assessment. Paid.</p>
        </div>
      </div>
    </div>
  );
}

function ModuleList({ modules, access, courseSlug, enrollments }) {
  const [openModules, setOpenModules] = useState(() => {
    const init = {};
    if (modules.length > 0) init[modules[0].id] = true;
    return init;
  });

  const isEnrolled = enrollments?.some(e => e.course?.slug === courseSlug && e.status === 'active');

  const toggle = (id) => setOpenModules(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="module-list">
      {modules.map((mod, mi) => (
        <div key={mod.id} className="module-item">
          <button className="module-item__header" onClick={() => toggle(mod.id)}>
            <div className="module-item__info">
              <span className="module-item__num">Module {mi + 1}</span>
              <span className="module-item__title">{mod.title}</span>
            </div>
            <div className="module-item__meta">
              <span>{mod.lessonCount} lessons</span>
              {mod.estimatedMinutes > 0 && <span>{mod.estimatedMinutes} min</span>}
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ transform: openModules[mod.id] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </button>

          {openModules[mod.id] && (
            <div className="module-item__lessons">
              {mod.lessons.map((lesson, li) => {
                const locked = lesson.isLocked && !isEnrolled;
                const lessonPath = isEnrolled
                  ? `/my-learning/${courseSlug}/lesson/${lesson.slug}`
                  : `/course/${courseSlug}/lesson/${lesson.slug}`;

                return (
                  <div key={lesson.id} className={`lesson-row ${locked ? 'lesson-row--locked' : ''}`}>
                    <div className="lesson-row__left">
                      <span className="lesson-row__num">{lesson.lessonNumber || li + 1}</span>
                      <div>
                        <span className="lesson-row__title">{lesson.title}</span>
                        {lesson.summary && <span className="lesson-row__summary">{lesson.summary}</span>}
                      </div>
                    </div>
                    <div className="lesson-row__right">
                      {lesson.estimatedDurationMinutes > 0 && (
                        <span className="lesson-row__duration">{lesson.estimatedDurationMinutes} min</span>
                      )}
                      {locked
                        ? (
                          <span className="lesson-row__locked">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            Locked
                          </span>
                        )
                        : (
                          <Link to={lessonPath} className="btn btn-secondary btn-sm">
                            {isEnrolled ? 'Open Lesson' : 'Preview'}
                          </Link>
                        )
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function CourseOverviewPage() {
  const { courseSlug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cohortModal, setCohortModal] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['course-content', courseSlug],
    queryFn: () => coursesService.getContent(courseSlug),
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ['enrollments'],
    queryFn: studentService.getSelfPacedEnrollments,
    enabled: !!user,
  });

  const enrollMutation = useMutation({
    mutationFn: () => studentService.enrollSelfPaced({ courseSlug }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      const firstLesson = data?.modules?.[0]?.lessons?.[0];
      if (firstLesson) navigate(`/my-learning/${courseSlug}/lesson/${firstLesson.slug}`);
    },
  });

  if (isLoading) return (
    <div className="course-overview">
      <div className="course-overview__hero">
        <div className="course-overview__hero-inner">
          <Skeleton height="16px" width="200px" style={{ marginBottom: '16px' }} />
          <Skeleton height="40px" width="60%" style={{ marginBottom: '12px' }} />
          <Skeleton height="20px" width="80%" />
        </div>
      </div>
    </div>
  );

  if (isError || !data) return (
    <div className="course-overview">
      <EmptyState title="Course not found" description="This course doesn't exist or has been removed." action={<Link to="/courses" className="btn btn-primary btn-md">Browse Courses</Link>} />
    </div>
  );

  const { course, modules, access } = data;
  const isEnrolled = enrollments.some(e => e.course?.slug === courseSlug && e.status === 'active');
  const firstLesson = modules?.[0]?.lessons?.[0];

  const handlePrimaryCTA = () => {
    if (!user) { navigate('/signup'); return; }
    if (isEnrolled && firstLesson) { navigate(`/my-learning/${courseSlug}/lesson/${firstLesson.slug}`); return; }
    enrollMutation.mutate();
  };

  const ctaLabel = !user
    ? 'Sign Up to Start Learning'
    : isEnrolled
      ? 'Continue Learning'
      : enrollMutation.isPending ? 'Enrolling…' : 'Start Learning — Free';

  return (
    <div className="course-overview">
      <div className="course-overview__hero" style={{ borderTop: `4px solid ${course.color}` }}>
        <div className="course-overview__hero-inner">
          <Breadcrumb items={[
            { label: 'Courses', href: '#/courses' },
            { label: course.title },
          ]} />

          <div className="course-overview__hero-content">
            <div className="course-overview__hero-main">
              <div className="course-overview__hero-top">
                <CourseIcon iconKey={course.iconKey} color={course.color} size={56} />
                <div>
                  <LevelBadge level={course.level} />
                  <span className="badge badge-neutral" style={{ marginLeft: '8px' }}>{course.category}</span>
                </div>
              </div>
              <h1 className="course-overview__title">{course.title}</h1>
              <p className="course-overview__desc">{course.description}</p>

              <div className="course-overview__stats">
                <div className="course-stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {course.duration}
                </div>
                <div className="course-stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  {course.moduleCount} modules
                </div>
                <div className="course-stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  {course.lessonCount} lessons
                </div>
                <div className="course-stat course-stat--free">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Free self-paced
                </div>
              </div>
            </div>

            <div className="course-overview__hero-cta">
              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                onClick={handlePrimaryCTA}
                disabled={enrollMutation.isPending}
              >
                {ctaLabel}
              </button>
              <button
                className="btn btn-secondary btn-md"
                style={{ width: '100%' }}
                onClick={() => setCohortModal(true)}
              >
                Join Paid Cohort
              </button>
              {!user && (
                <p className="course-overview__hero-note">
                  Already have an account? <Link to="/login">Log in</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="course-overview__body">
        <div className="course-overview__main">
          {course.objectives?.length > 0 && (
            <section className="course-section">
              <h2 className="course-section__title">What you'll learn</h2>
              <ul className="objectives-list">
                {course.objectives.map((obj, i) => (
                  <li key={i}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    {obj}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {course.outline?.length > 0 && (
            <section className="course-section">
              <h2 className="course-section__title">Course outline</h2>
              <ol className="outline-list">
                {course.outline.map((item, i) => <li key={i}>{item}</li>)}
              </ol>
            </section>
          )}

          <section className="course-section">
            <h2 className="course-section__title">Course content</h2>
            <div className="course-content-meta">
              <span>{course.moduleCount} modules</span>
              <span>·</span>
              <span>{course.lessonCount} lessons</span>
              {access && (
                <>
                  <span>·</span>
                  <span>{access.accessibleLessons} of {access.totalLessons} accessible</span>
                </>
              )}
            </div>
            {modules.length > 0
              ? <ModuleList modules={modules} access={access} courseSlug={courseSlug} enrollments={enrollments} />
              : <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Course content is being prepared.</p>
            }
          </section>
        </div>

        <aside className="course-overview__sidebar">
          <AccessModelBlock access={access} />
          <CourseMaterials courseSlug={courseSlug} />
        </aside>
      </div>

      <Modal
        open={cohortModal}
        onClose={() => setCohortModal(false)}
        title={`Join Cohort — ${course.title}`}
        size="md"
      >
        <CohortApplicationForm
          course={course}
          onSuccess={() => setCohortModal(false)}
          onCancel={() => setCohortModal(false)}
        />
      </Modal>
    </div>
  );
}
