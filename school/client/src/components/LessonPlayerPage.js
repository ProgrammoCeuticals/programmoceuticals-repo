import React, { useEffect, useMemo, useState } from "react";
import "../styles/Homepage.css";
import "../styles/Pages.css";
import { courses as localCourses } from "../data/courses";
import { coursesAPI, studentAPI } from "../services/api";
import Slide from "./slides/Slide";
import WhiteboardCanvas from "./WhiteboardCanvas";

const findLocalCourse = (courses, slug) =>
  (courses || []).find((item) => item.id === slug || item.slug === slug) || null;

const mergeCourseDetails = (localCourse, apiCourse, courseSlug) => {
  if (!localCourse && !apiCourse) {
    return null;
  }

  const name =
    apiCourse?.title || apiCourse?.name || localCourse?.name || courseSlug;

  return {
    ...localCourse,
    ...apiCourse,
    id: apiCourse?.id || apiCourse?.slug || localCourse?.id || courseSlug,
    slug: apiCourse?.slug || localCourse?.id || courseSlug,
    name,
    title: name,
    icon: localCourse?.icon || apiCourse?.icon || "",
    color: apiCourse?.color || localCourse?.color || "#0b5ed7",
  };
};

const LessonPlayerPage = ({
  courseSlug,
  lessonSlug,
  user,
  courses: providedCourses,
}) => {
  const courses = providedCourses?.length ? providedCourses : localCourses;
  const localCourse = useMemo(
    () => findLocalCourse(courses, courseSlug),
    [courses, courseSlug]
  );

  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState({ message: "", locked: false });
  const [lessonPayload, setLessonPayload] = useState(null);
  const [progress, setProgress] = useState(null);
  const [markingComplete, setMarkingComplete] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadLesson = async () => {
      setLoading(true);
      setErrorState({ message: "", locked: false });

      try {
        const response = await coursesAPI.getLessonBySlug(courseSlug, lessonSlug);
        if (cancelled) {
          return;
        }

        const mergedCourse = mergeCourseDetails(
          localCourse,
          response.course,
          courseSlug
        );
        let lessonProgress = null;

        if (user?.id && response.lesson?.id) {
          try {
            const progressResponse = await studentAPI.getLessonProgress(
              response.lesson.id
            );
            lessonProgress = progressResponse.progress || null;

            if (lessonProgress?.status !== "completed") {
              const updatedProgress = await studentAPI.updateLessonProgress(
                response.lesson.id,
                {
                  status: "in_progress",
                  percentComplete: Math.max(
                    Number(lessonProgress?.percentComplete) || 0,
                    10
                  ),
                  lastPosition: {
                    openedAt: new Date().toISOString(),
                    viewed: true,
                  },
                }
              );
              lessonProgress = updatedProgress.progress || lessonProgress;
            }
          } catch (error) {
            lessonProgress = null;
          }
        }

        if (!cancelled) {
          setLessonPayload({
            ...response,
            course: mergedCourse,
          });
          setProgress(lessonProgress);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        setLessonPayload(null);
        setProgress(null);
        setErrorState({
          message:
            error?.response?.data?.message ||
            "This lesson could not be loaded.",
          locked: error?.response?.status === 403,
        });
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (!courseSlug || !lessonSlug) {
      setLessonPayload(null);
      setProgress(null);
      setLoading(false);
      setErrorState({
        message: "Invalid lesson route.",
        locked: false,
      });
      return undefined;
    }

    loadLesson();
    return () => {
      cancelled = true;
    };
  }, [courseSlug, lessonSlug, localCourse, user]);

  const course = lessonPayload?.course || localCourse;
  const moduleEntry = lessonPayload?.module || null;
  const lesson = lessonPayload?.lesson || null;
  const access = lessonPayload?.access || null;
  const slideData = lesson?.content || null;
  const previousLessonSlug = lessonPayload?.navigation?.previousLessonSlug || null;
  const nextLessonSlug = lessonPayload?.navigation?.nextLessonSlug || null;
  const isGuestPreview = Boolean(access?.isPreviewMode && !access?.hasFullAccess);
  const userId = user?.id || user?._id || "";
  const lessonStatusLabel = progress?.status
    ? progress.status.replace(/_/g, " ")
    : isGuestPreview
      ? "Preview"
      : "Not started";

  const handleMarkComplete = async () => {
    if (!user?.id || !lesson?.id) {
      return;
    }

    setMarkingComplete(true);
    try {
      const response = await studentAPI.updateLessonProgress(lesson.id, {
        status: "completed",
        percentComplete: 100,
        lastPosition: {
          viewed: true,
          completedAt: new Date().toISOString(),
        },
      });
      setProgress(response.progress || null);
    } catch (error) {
      // Keep current state if completion update fails.
    } finally {
      setMarkingComplete(false);
    }
  };

  const whiteboardStorageKey = lesson
    ? `lesson-whiteboard:${courseSlug}:${lesson.slug}`
    : `lesson-whiteboard:${courseSlug}:${lessonSlug}`;

  if (!loading && !course && !lessonPayload) {
    return (
      <div className="homepage lesson-player-page">
        <nav className="navbar scrolled">
          <div className="nav-container">
            <div className="nav-brand">
              <a className="nav-title" href="#/">
                ProgrammoCeuticals
              </a>
            </div>
            <div className="nav-menu">
              <a href="#/">Home</a>
              <a href="#/courses">Courses</a>
              <a href="#/my-courses">My Courses</a>
              <a href="#/timetable">Timetable</a>
            </div>
          </div>
        </nav>

        <main className="lesson-shell">
          <section className="lesson-empty">
            <div className="page-container">
              <h1>Lesson not found</h1>
              <p>The lesson you requested is not available.</p>
              <a className="primary-link" href="#/courses">
                Back to courses
              </a>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div
      className="homepage lesson-player-page"
      style={{ "--course-color": course?.color || "#0b5ed7" }}
    >
      <nav className="navbar scrolled">
        <div className="nav-container">
          <div className="nav-brand">
            <a className="nav-title" href="#/">
              ProgrammoCeuticals
            </a>
          </div>
          <div className="nav-menu">
            <a href="#/">Home</a>
            <a href="#/courses">Courses</a>
            <a href="#/my-courses">My Courses</a>
            <a href={`#/course-outline/${courseSlug}`}>Course Overview</a>
          </div>
        </div>
      </nav>

      <main className="lesson-shell">
        <section className="lesson-header">
          <div className="page-container">
            <div className="lesson-breadcrumb">
              <a href="#/">Home</a> <span>/</span> <a href="#/courses">Courses</a>{" "}
              <span>/</span> <a href={`#/course-outline/${courseSlug}`}>{course?.name}</a>{" "}
              <span>/</span> <span>{lesson?.title || lessonSlug}</span>
            </div>

            {loading ? (
              <div className="lesson-header-copy">
                <h1>Loading lesson...</h1>
              </div>
            ) : errorState.message ? (
              <div className="lesson-header-copy">
                <div className="outline-status-row">
                  <span className="page-badge">
                    {errorState.locked ? "Preview limit reached" : "Lesson error"}
                  </span>
                </div>
                <h1>{lesson?.title || "Lesson unavailable"}</h1>
                <p className="outline-description">{errorState.message}</p>
                <div className="outline-actions">
                  <a className="primary-link" href={`#/course-outline/${courseSlug}`}>
                    Back to course overview
                  </a>
                  <a className="outline-link" href="#/courses">
                    Browse courses
                  </a>
                </div>
              </div>
            ) : (
              <div className="lesson-header-grid">
                <div className="lesson-header-copy">
                  <div className="outline-status-row">
                    <span className="page-badge">
                      {isGuestPreview ? "Guest preview" : "Lesson workspace"}
                    </span>
                    <span className="outline-mini-meta">{moduleEntry?.title}</span>
                    <span className="outline-mini-meta">
                      Lesson {lesson?.lessonNumber}
                    </span>
                  </div>
                  <h1>{lesson?.title}</h1>
                  <p className="outline-description">
                    {lesson?.summary ||
                      "Lesson content, code examples, and notes live in one workspace."}
                  </p>
                  <div className="outline-actions">
                    <a className="outline-link" href={`#/course-outline/${courseSlug}`}>
                      Back to course overview
                    </a>
                    {!user?.id ? (
                      <a className="outline-link" href="#/">
                        Sign in for full access
                      </a>
                    ) : null}
                  </div>
                </div>

                <div className="lesson-meta-card">
                  <div className="lesson-meta-item">
                    <span className="stat-label">Duration</span>
                    <strong>{lesson?.estimatedDurationMinutes || 5} mins</strong>
                  </div>
                  <div className="lesson-meta-item">
                    <span className="stat-label">Status</span>
                    <strong>{lessonStatusLabel}</strong>
                  </div>
                  <div className="lesson-meta-item">
                    <span className="stat-label">Progress</span>
                    <strong>{Number(progress?.percentComplete) || 0}%</strong>
                  </div>
                  <div className="lesson-meta-item">
                    <span className="stat-label">Access</span>
                    <strong>
                      {isGuestPreview ? "Preview mode" : "Full lesson access"}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {!loading && !errorState.message && lesson && slideData ? (
          <section className="lesson-stage">
            <div className="page-container">
              <div className="lesson-stage-card">
                <div className="lesson-stage-toolbar">
                  <div className="lesson-stage-toolbar-copy">
                    <h2>{lesson.title}</h2>
                    <p>
                      {moduleEntry?.title} · {lesson.estimatedDurationMinutes || 5} mins
                    </p>
                  </div>
                  <div className="lesson-stage-actions">
                    <button
                      type="button"
                      className="outline-link"
                      onClick={() => {
                        if (previousLessonSlug) {
                          window.location.hash = `#/lesson/${courseSlug}/${previousLessonSlug}`;
                        }
                      }}
                      disabled={!previousLessonSlug}
                    >
                      Previous lesson
                    </button>
                    <button
                      type="button"
                      className="primary-link"
                      onClick={() => {
                        if (nextLessonSlug) {
                          window.location.hash = `#/lesson/${courseSlug}/${nextLessonSlug}`;
                        }
                      }}
                      disabled={!nextLessonSlug}
                    >
                      Next lesson
                    </button>
                  </div>
                </div>

                <div className="lesson-slide-surface">
                  <Slide slideData={slideData} language={courseSlug} />
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {!loading && !errorState.message && lesson ? (
          <section className="lesson-workspace">
            <div className="page-container lesson-workspace-grid">
              <aside className="lesson-sidebar">
                <div className="outline-card lesson-sidebar-card">
                  <div className="card-header">
                    <i className="fa-solid fa-circle-info"></i>
                    <h2>Lesson Details</h2>
                  </div>
                  <div className="lesson-sidebar-meta">
                    <div className="lesson-sidebar-row">
                      <span>Course</span>
                      <strong>{course?.name}</strong>
                    </div>
                    <div className="lesson-sidebar-row">
                      <span>Module</span>
                      <strong>{moduleEntry?.title || "Module"}</strong>
                    </div>
                    <div className="lesson-sidebar-row">
                      <span>Type</span>
                      <strong>{lesson.lessonType || "slide"}</strong>
                    </div>
                    <div className="lesson-sidebar-row">
                      <span>Status</span>
                      <strong>{lessonStatusLabel}</strong>
                    </div>
                  </div>
                  {lesson.summary ? (
                    <p className="lesson-sidebar-summary">{lesson.summary}</p>
                  ) : null}
                  <div className="page-actions">
                    <button
                      type="button"
                      className="primary-link"
                      onClick={handleMarkComplete}
                      disabled={!user?.id || markingComplete}
                    >
                      {markingComplete ? "Saving..." : "Mark complete"}
                    </button>
                    {nextLessonSlug ? (
                      <button
                        type="button"
                        className="outline-link"
                        onClick={() => {
                          window.location.hash = `#/lesson/${courseSlug}/${nextLessonSlug}`;
                        }}
                      >
                        Continue to next
                      </button>
                    ) : null}
                  </div>
                  {!user?.id ? (
                    <p className="outline-access-note">
                      Progress tracking is available for registered learners.
                    </p>
                  ) : null}
                </div>
              </aside>

              <div className="outline-card lesson-whiteboard-card">
                <div className="card-header">
                  <i className="fa-solid fa-pen-ruler"></i>
                  <h2>Lesson Whiteboard</h2>
                </div>
                <p className="lesson-whiteboard-copy">
                  Draft notes, sketch ideas, add code blocks, and save lesson-specific
                  working notes.
                </p>
                <div className="lesson-whiteboard-frame">
                  <WhiteboardCanvas
                    storageKey={whiteboardStorageKey}
                    lessonId={lesson.id}
                    userId={userId}
                  />
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
};

export default LessonPlayerPage;
