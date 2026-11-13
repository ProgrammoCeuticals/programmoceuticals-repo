import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesService, studentService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import SlideRenderer from '../../components/lesson/SlideRenderer';
import AssessmentPlayer from '../../components/lesson/AssessmentPlayer';
import CourseMaterials from '../../components/lesson/CourseMaterials';
import CourseNotesPanel from '../../components/lesson/CourseNotesPanel';
import { enqueueProgressUpdate, flushProgressQueue } from '../../services/offlineQueue';
import './LessonPlayerPage.css';

const SLIDE_DATA_MAP = {};
try {
  const modules = require.context('../../../data', false, /SlidesData\.js$/);
  modules.keys().forEach(key => {
    const mod = modules(key);
    const exported = Object.values(mod)[0];
    if (Array.isArray(exported) && exported.length > 0) {
      const courseKey = key.replace('./', '').replace('SlidesData.js', '').toLowerCase();
      SLIDE_DATA_MAP[courseKey] = exported;
    }
  });
  const { slidesData } = require('../../../data/slidesData');
  if (Array.isArray(slidesData)) SLIDE_DATA_MAP[''] = slidesData;
} catch (_) {}

function getLocalSlides(courseSlug) {
  return SLIDE_DATA_MAP[courseSlug] || SLIDE_DATA_MAP[''] || [];
}

function LessonSidebar({ modules, courseSlug, currentLessonSlug, isLearner, onClose }) {
  const [openModules, setOpenModules] = useState(() => {
    const init = {};
    modules.forEach((m, i) => {
      const hasCurrentLesson = m.lessons?.some(l => l.slug === currentLessonSlug);
      if (hasCurrentLesson || i === 0) init[m.id] = true;
    });
    return init;
  });

  const toggle = id => setOpenModules(p => ({ ...p, [id]: !p[id] }));
  const basePath = isLearner ? `/my-learning/${courseSlug}/lesson` : `/course/${courseSlug}/lesson`;

  return (
    <aside className="lesson-sidebar">
      <div className="lesson-sidebar__header">
        <Link to={isLearner ? `/my-learning/${courseSlug}` : `/course/${courseSlug}`} className="lesson-sidebar__back">
          ← Course Overview
        </Link>
        {onClose && (
          <button className="lesson-sidebar__close" onClick={onClose} aria-label="Close sidebar">✕</button>
        )}
      </div>
      <div className="lesson-sidebar__modules">
        {modules.map((mod, mi) => (
          <div key={mod.id} className="lesson-sidebar__module">
            <button className="lesson-sidebar__module-btn" onClick={() => toggle(mod.id)}>
              <span className="lesson-sidebar__module-num">Module {mi + 1}</span>
              <span className="lesson-sidebar__module-title">{mod.title}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ transform: openModules[mod.id] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {openModules[mod.id] && (
              <div className="lesson-sidebar__lessons">
                {mod.lessons?.map((lesson, li) => {
                  const isActive = lesson.slug === currentLessonSlug;
                  const locked = lesson.isLocked && !isLearner;
                  return (
                    <Link
                      key={lesson.id}
                      to={locked ? '#' : `${basePath}/${lesson.slug}`}
                      className={`lesson-sidebar__lesson ${isActive ? 'active' : ''} ${locked ? 'locked' : ''}`}
                      onClick={onClose}
                    >
                      <span className="lesson-sidebar__lesson-num">{lesson.lessonNumber || li + 1}</span>
                      <span className="lesson-sidebar__lesson-title">{lesson.title}</span>
                      {locked && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function LessonPlayerPage() {
  const { courseSlug, lessonSlug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isLearner = !!user;

  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  const { data: lessonData, isLoading, isError } = useQuery({
    queryKey: ['lesson', courseSlug, lessonSlug],
    queryFn: () => coursesService.getLesson(courseSlug, lessonSlug),
  });

  const { data: contentData } = useQuery({
    queryKey: ['course-content', courseSlug],
    queryFn: () => coursesService.getContent(courseSlug),
  });

  const { data: progressData } = useQuery({
    queryKey: ['lesson-progress', lessonData?.lesson?.id],
    queryFn: () => studentService.getLessonProgress(lessonData.lesson.id),
    enabled: !!user && !!lessonData?.lesson?.id,
  });

  const progressMutation = useMutation({
    mutationFn: ({ lessonId, payload }) => studentService.updateLessonProgress(lessonId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-progress'] });
      queryClient.invalidateQueries({ queryKey: ['all-progress'] });
    },
    onError: (_, { lessonId, payload }) => {
      // Queue for later if network failed
      if (!navigator.onLine) enqueueProgressUpdate(lessonId, payload);
    },
  });

  // Flush queued progress updates when back online
  useEffect(() => {
    const flush = () => flushProgressQueue((lessonId, payload) =>
      studentService.updateLessonProgress(lessonId, payload)
    ).then(() => {
      queryClient.invalidateQueries({ queryKey: ['lesson-progress'] });
      queryClient.invalidateQueries({ queryKey: ['all-progress'] });
    });
    window.addEventListener('pc:online', flush);
    return () => window.removeEventListener('pc:online', flush);
  }, []);

  // Mark in_progress on load
  useEffect(() => {
    if (!user || !lessonData?.lesson?.id) return;
    if (progressData?.status === 'completed') { setCompleted(true); return; }
    if (progressData?.status === 'in_progress') return;
    progressMutation.mutate({
      lessonId: lessonData.lesson.id,
      payload: { status: 'in_progress', percentComplete: 10, lastPosition: { openedAt: new Date().toISOString(), viewed: true } },
    });
  }, [lessonData?.lesson?.id, user, progressData?.status]);

  const handleMarkComplete = useCallback(() => {
    if (!user || !lessonData?.lesson?.id) return;
    progressMutation.mutate({
      lessonId: lessonData.lesson.id,
      payload: { status: 'completed', percentComplete: 100, lastPosition: { viewed: true, completedAt: new Date().toISOString() } },
    });
    setCompleted(true);
  }, [user, lessonData?.lesson?.id]);

  const { course, lesson, module: lessonModule, navigation, access } = lessonData || {};
  const modules = contentData?.modules || [];
  const totalLessons = access?.totalLessons || contentData?.course?.lessonCount || 0;
  const currentLesson = lesson?.lessonNumber || 0;
  const progressPct = totalLessons > 0 ? Math.round((currentLesson / totalLessons) * 100) : 0;

  const resolvedLesson = (() => {
    if (!lesson) return null;
    if (lesson.content && Object.keys(lesson.content).length > 0) return lesson;
    const localSlides = getLocalSlides(courseSlug);
    const localSlide = localSlides.find(s => s.id === lesson.sourceSlideId || s.title === lesson.title);
    if (localSlide) return { ...lesson, content: localSlide.content, lessonType: localSlide.type };
    return lesson;
  })();

  const isPreview = access?.isPreviewMode && !access?.hasFullAccess;

  const prevPath = navigation?.previousLessonSlug
    ? (isLearner ? `/my-learning/${courseSlug}/lesson/${navigation.previousLessonSlug}` : `/course/${courseSlug}/lesson/${navigation.previousLessonSlug}`)
    : null;
  const nextPath = navigation?.nextLessonSlug
    ? (isLearner ? `/my-learning/${courseSlug}/lesson/${navigation.nextLessonSlug}` : `/course/${courseSlug}/lesson/${navigation.nextLessonSlug}`)
    : null;

  return (
    <div className="lesson-player">
      {/* Top bar */}
      <header className="lesson-topbar">
        <div className="lesson-topbar__left">
          <button className="lesson-topbar__menu-btn" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle outline">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="lesson-topbar__breadcrumb">
            {course
              ? <><Link to={`/course/${courseSlug}`}>{course.title}</Link><span>/</span><span>{lessonModule?.title}</span></>
              : <span className="lesson-topbar__breadcrumb-skeleton" />
            }
          </div>
        </div>
        <div className="lesson-topbar__right">
          {totalLessons > 0 && (
            <span className="lesson-topbar__counter">
              {currentLesson} / {totalLessons}
            </span>
          )}
          {isPreview && <span className="badge badge-warning">Preview Mode</span>}
          <button
            className={`btn btn-sm ${showWhiteboard ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowWhiteboard(w => !w)}
          >
            {showWhiteboard ? 'Hide Notes' : '📝 Notes'}
          </button>
          {user && !completed && (
            <button className="btn btn-accent btn-sm" onClick={handleMarkComplete} disabled={!lesson}>
              Mark Complete
            </button>
          )}
          {completed && <span className="badge badge-success">Completed</span>}
        </div>
      </header>

      {/* Progress bar */}
      {totalLessons > 0 && (
        <div className="lesson-progress-bar" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
          <div className="lesson-progress-bar__fill" style={{ width: `${progressPct}%` }} />
        </div>
      )}

      <div className="lesson-body">
        {/* Sidebar */}
        {modules.length > 0 && (
          <>
            <div className={`lesson-sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
              <LessonSidebar
                modules={modules}
                courseSlug={courseSlug}
                currentLessonSlug={lessonSlug}
                isLearner={isLearner}
                onClose={() => setSidebarOpen(false)}
              />
            </div>
            {sidebarOpen && <div className="lesson-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
          </>
        )}

        {/* Main content */}
        <div className="lesson-content">
          {isError ? (
            <div className="lesson-content__error">
              <div className="empty-state">
                <h3>Lesson not found</h3>
                <p>This lesson doesn't exist or you don't have access.</p>
                <Link to={`/course/${courseSlug}`} className="btn btn-primary btn-md">Back to Course</Link>
              </div>
            </div>
          ) : (
            <>
              {/* Lesson header */}
              <div className="lesson-content__header">
                <div className="lesson-content__meta">
                  {isLoading
                    ? <span className="lesson-content__meta-skeleton" />
                    : (
                      <>
                        <span className="badge badge-neutral">{lessonModule?.title}</span>
                        {lesson.estimatedDurationMinutes > 0 && (
                          <span className="lesson-content__duration">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                            </svg>
                            {lesson.estimatedDurationMinutes} min
                          </span>
                        )}
                      </>
                    )
                  }
                </div>
              </div>

              {/* Preview banner */}
              {!isLoading && isPreview && access?.accessibleLessons !== undefined && (
                <div className="lesson-preview-banner">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Preview mode — {access.accessibleLessons} of {access.totalLessons} lessons accessible.{' '}
                  <Link to="/signup">Sign up free</Link> for full access.
                </div>
              )}

              {/* Slide content */}
              <div className="lesson-slide-area">
                {isLoading
                  ? (
                    <div className="lesson-slide-skeleton">
                      <div className="lesson-slide-skeleton__title" />
                      <div className="lesson-slide-skeleton__line" />
                      <div className="lesson-slide-skeleton__line lesson-slide-skeleton__line--short" />
                      <div className="lesson-slide-skeleton__block" />
                    </div>
                  )
                  : <SlideRenderer lesson={resolvedLesson} courseSlug={courseSlug} />
                }
              </div>

              {/* Assessments */}
              {!isLoading && user && (
                <AssessmentPlayer courseSlug={courseSlug} lessonId={lesson.id} />
              )}

              {/* Course materials */}
              {!isLoading && <CourseMaterials courseSlug={courseSlug} />}

              {/* Navigation */}
              <div className="lesson-nav">
                {prevPath
                  ? <Link to={prevPath} className="btn btn-secondary btn-md lesson-nav__btn">← Previous</Link>
                  : <span />
                }
                {nextPath
                  ? <Link to={nextPath} className="btn btn-primary btn-md lesson-nav__btn" onClick={!completed ? handleMarkComplete : undefined}>Next →</Link>
                  : !isLoading && (
                    <Link to={isLearner ? `/my-learning/${courseSlug}` : `/course/${courseSlug}`} className="btn btn-accent btn-md">
                      Finish Course
                    </Link>
                  )
                }
              </div>
            </>
          )}
        </div>

        {/* Notes panel */}
        {showWhiteboard && (
          <div className="lesson-whiteboard-panel">
            <CourseNotesPanel
              courseSlug={courseSlug}
              onClose={() => setShowWhiteboard(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
