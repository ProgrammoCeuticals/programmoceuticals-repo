import React, { useEffect, useMemo, useState } from "react";
import "../styles/Homepage.css";
import "../styles/Pages.css";
import { courses as localCourses } from "../data/courses";
import { coursesAPI, studentAPI } from "../services/api";
import CohortTrainingModal from "./CohortTrainingModal";

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
    duration:
      apiCourse?.duration ||
      localCourse?.duration ||
      `${apiCourse?.durationWeeks || 12} weeks`,
    category:
      apiCourse?.category || localCourse?.category || "Programming Languages",
    level: apiCourse?.level || localCourse?.level || "Beginner",
    description:
      apiCourse?.description ||
      localCourse?.description ||
      "Professional learning track with guided lessons and practical exercises.",
    objectives:
      apiCourse?.objectives?.length > 0
        ? apiCourse.objectives
        : localCourse?.objectives || [],
    outline:
      apiCourse?.outline?.length > 0
        ? apiCourse.outline
        : localCourse?.outline || [],
    moduleCount: Number(apiCourse?.moduleCount) || 0,
    lessonCount: Number(apiCourse?.lessonCount) || 0,
    access:
      apiCourse?.access ||
      localCourse?.access || {
        previewPercent: 20,
        fullAccessRequiresAuth: true,
        hasFullAccess: Boolean(localCourse?.access?.hasFullAccess),
      },
    payment:
      apiCourse?.payment ||
      localCourse?.payment || {
        learning: "free",
        certification: "paid",
        cohortTraining: "paid",
      },
  };
};

const flattenLessons = (modules) =>
  (Array.isArray(modules) ? modules : []).flatMap((moduleEntry) =>
    (moduleEntry.lessons || []).map((lesson) => ({ ...lesson, module: moduleEntry }))
  );

const CourseOutlinePage = ({ courseId, courses: providedCourses, user }) => {
  const courses = providedCourses?.length ? providedCourses : localCourses;
  const courseSlug = String(courseId || "").trim();
  const localCourse = useMemo(
    () => findLocalCourse(courses, courseSlug),
    [courses, courseSlug]
  );

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [courseData, setCourseData] = useState(null);
  const [modules, setModules] = useState([]);
  const [access, setAccess] = useState(null);
  const [progressEntries, setProgressEntries] = useState([]);
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [startingCourse, setStartingCourse] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadCourseContent = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await coursesAPI.getContentBySlug(courseSlug);
        if (cancelled) {
          return;
        }

        setCourseData(mergeCourseDetails(localCourse, response.course, courseSlug));
        setModules(Array.isArray(response.modules) ? response.modules : []);
        setAccess(response.access || response.course?.access || null);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setCourseData(mergeCourseDetails(localCourse, null, courseSlug));
        setModules([]);
        setAccess(localCourse?.access || null);
        setErrorMessage(
          error?.response?.data?.message ||
            "Course content is temporarily unavailable."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (!courseSlug) {
      setCourseData(null);
      setModules([]);
      setAccess(null);
      setLoading(false);
      return undefined;
    }

    loadCourseContent();
    return () => {
      cancelled = true;
    };
  }, [courseSlug, localCourse]);

  useEffect(() => {
    let cancelled = false;

    const loadLessonProgress = async () => {
      if (!user?.id || !courseSlug) {
        setProgressEntries([]);
        return;
      }

      try {
        const response = await studentAPI.getCourseLessonProgress(courseSlug);
        if (!cancelled) {
          setProgressEntries(response.progress || []);
        }
      } catch (error) {
        if (!cancelled) {
          setProgressEntries([]);
        }
      }
    };

    loadLessonProgress();
    return () => {
      cancelled = true;
    };
  }, [courseSlug, user]);

  const course = courseData || localCourse;
  const progressByLessonSlug = useMemo(() => {
    const map = new Map();
    (progressEntries || []).forEach((entry) => {
      const slug = entry?.lesson?.slug;
      if (slug) {
        map.set(slug, entry);
      }
    });
    return map;
  }, [progressEntries]);

  const flatLessons = useMemo(() => flattenLessons(modules), [modules]);
  const firstAccessibleLesson = useMemo(
    () => flatLessons.find((lesson) => !lesson.isLocked) || null,
    [flatLessons]
  );
  const mostRecentProgressLesson = useMemo(() => {
    const inProgress = (progressEntries || []).find(
      (entry) => entry?.lesson?.slug && entry.status !== "completed"
    );
    if (inProgress?.lesson?.slug) {
      return inProgress.lesson.slug;
    }

    const lastVisited = (progressEntries || []).find((entry) => entry?.lesson?.slug);
    return lastVisited?.lesson?.slug || null;
  }, [progressEntries]);
  const completedLessons = useMemo(
    () =>
      (progressEntries || []).filter((entry) => entry.status === "completed")
        .length,
    [progressEntries]
  );
  const accessibleLessonCount = Number(access?.accessibleLessons) || 0;
  const totalLessons =
    Number(access?.totalLessons) || Number(course?.lessonCount) || flatLessons.length;
  const targetLessonSlug =
    mostRecentProgressLesson || firstAccessibleLesson?.slug || null;
  const startButtonLabel = user?.id
    ? mostRecentProgressLesson
      ? "Continue learning"
      : "Start free learning"
    : "Preview free lessons";

  const handleStartLearning = async () => {
    if (!targetLessonSlug) {
      return;
    }

    setStartingCourse(true);
    try {
      if (user?.id) {
        await studentAPI.enrollSelfPaced({ courseSlug });
      }
    } catch (error) {
      // Enrollment is non-blocking for lesson access.
    } finally {
      setStartingCourse(false);
    }

    window.location.hash = `#/lesson/${courseSlug}/${targetLessonSlug}`;
  };

  if (!loading && !course) {
    return (
      <div className="homepage course-outline-page">
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
              <a href="#/certificate-verify">Verify Certificate</a>
            </div>
          </div>
        </nav>

        <main className="outline-shell">
          <section className="outline-hero">
            <div className="page-container">
              <div className="outline-breadcrumb">
                <a href="#/">Home</a> <span>/</span> <a href="#/courses">Courses</a>{" "}
                <span>/</span> <span>Not Found</span>
              </div>
              <h1>Course not found</h1>
              <p>The requested course could not be located.</p>
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
      className="homepage course-outline-page"
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
            <a href="#/timetable">Timetable</a>
            <a href="#/certificate-verify">Verify Certificate</a>
          </div>
        </div>
      </nav>

      <main className="outline-shell">
        <section className="outline-hero">
          <div className="page-container">
            <div className="outline-breadcrumb">
              <a href="#/">Home</a> <span>/</span> <a href="#/courses">Courses</a>{" "}
              <span>/</span> <span>{course?.name}</span>
            </div>

            <div className="outline-hero-content">
              <div className="course-icon-large">
                {course?.icon ? (
                  <img src={course.icon} alt={`${course.name} logo`} />
                ) : (
                  <i className="fa-solid fa-code" aria-hidden="true"></i>
                )}
              </div>

              <div className="outline-header">
                <div className="outline-status-row">
                  <span className="page-badge">Free self-paced learning</span>
                  <span className="outline-mini-meta">{course?.level}</span>
                  <span className="outline-mini-meta">{course?.category}</span>
                </div>

                <h1>{course?.name}</h1>
                <p className="outline-description">{course?.description}</p>

                <div className="outline-stats">
                  <div className="stat-item">
                    <i className="fa-solid fa-clock"></i>
                    <div>
                      <span className="stat-label">Duration</span>
                      <span className="stat-value">{course?.duration}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <i className="fa-solid fa-layer-group"></i>
                    <div>
                      <span className="stat-label">Modules</span>
                      <span className="stat-value">
                        {Number(course?.moduleCount) || modules.length || "TBD"}
                      </span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <i className="fa-solid fa-book-open"></i>
                    <div>
                      <span className="stat-label">Lessons</span>
                      <span className="stat-value">{totalLessons || "TBD"}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <i className="fa-solid fa-chart-line"></i>
                    <div>
                      <span className="stat-label">Progress</span>
                      <span className="stat-value">
                        {user?.id
                          ? `${completedLessons}/${totalLessons || 0} completed`
                          : `${accessibleLessonCount || 0} preview lessons`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="outline-actions">
                  {targetLessonSlug ? (
                    <button
                      type="button"
                      className="primary-link"
                      onClick={handleStartLearning}
                      disabled={startingCourse}
                    >
                      {startingCourse ? "Opening..." : startButtonLabel}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="outline-link"
                    onClick={() => setShowCohortModal(true)}
                  >
                    Join paid cohort
                  </button>
                  <a className="outline-link" href="#/courses">
                    Back to courses
                  </a>
                </div>
                <p className="outline-access-note">
                  Learning content is free. Payment only applies to cohort training
                  and certification.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="outline-content">
          <div className="page-container">
            {errorMessage ? (
              <div className="outline-card outline-inline-error">
                <strong>Content notice:</strong> {errorMessage}
              </div>
            ) : null}

            <div className="outline-grid">
              <div className="outline-card">
                <div className="card-header">
                  <i className="fa-solid fa-bullseye"></i>
                  <h2>Learning Objectives</h2>
                </div>
                {course?.objectives?.length ? (
                  <div className="objectives-list">
                    {course.objectives.map((item, index) => (
                      <div key={`${item}-${index}`} className="objective-item">
                        <span className="objective-number">{index + 1}</span>
                        <span className="objective-text">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="outline-empty-copy">
                    Objectives will appear here once this course is fully configured.
                  </p>
                )}
              </div>

              <div className="outline-card">
                <div className="card-header">
                  <i className="fa-solid fa-unlock-keyhole"></i>
                  <h2>Access Model</h2>
                </div>
                <div className="outline-policy-list">
                  <div className="outline-policy-item">
                    <span>Self-paced learning</span>
                    <strong>Free</strong>
                  </div>
                  <div className="outline-policy-item">
                    <span>Guest preview</span>
                    <strong>
                      {Number(access?.previewPercent) || 20}% of the course
                    </strong>
                  </div>
                  <div className="outline-policy-item">
                    <span>Registered learners</span>
                    <strong>Full lesson access</strong>
                  </div>
                  <div className="outline-policy-item">
                    <span>Paid options</span>
                    <strong>Cohort training and certification</strong>
                  </div>
                </div>
              </div>

              <div className="outline-card outline-card-full">
                <div className="card-header">
                  <i className="fa-solid fa-list-ol"></i>
                  <h2>Course Outline</h2>
                </div>

                {modules.length === 0 ? (
                  <p className="outline-empty-copy">
                    Lesson modules will appear here when content is available.
                  </p>
                ) : (
                  <div className="outline-module-list">
                    {modules.map((moduleEntry, moduleIndex) => (
                      <div key={moduleEntry.id || moduleEntry.slug} className="outline-module-card">
                        <div className="outline-module-header">
                          <div>
                            <span className="outline-module-index">
                              Module {moduleIndex + 1}
                            </span>
                            <h3>{moduleEntry.title}</h3>
                            {moduleEntry.description ? (
                              <p>{moduleEntry.description}</p>
                            ) : null}
                          </div>
                          <div className="outline-module-meta">
                            <span>{moduleEntry.lessonCount || moduleEntry.lessons?.length || 0} lessons</span>
                            <span>
                              {moduleEntry.estimatedMinutes || 0} mins
                            </span>
                          </div>
                        </div>

                        <div className="outline-lesson-list">
                          {(moduleEntry.lessons || []).map((lesson) => {
                            const progressEntry = progressByLessonSlug.get(lesson.slug);
                            const isCompleted = progressEntry?.status === "completed";
                            const statusLabel = lesson.isLocked
                              ? "Locked"
                              : isCompleted
                                ? "Completed"
                                : progressEntry
                                  ? "In progress"
                                  : "Available";

                            return (
                              <div
                                key={lesson.id || lesson.slug}
                                className={`outline-lesson-row ${
                                  lesson.isLocked ? "locked" : ""
                                }`}
                              >
                                <div className="outline-lesson-copy">
                                  <div className="outline-lesson-heading">
                                    <span className="outline-lesson-number">
                                      {lesson.lessonNumber}
                                    </span>
                                    <div>
                                      <h4>{lesson.title}</h4>
                                      {lesson.summary ? <p>{lesson.summary}</p> : null}
                                    </div>
                                  </div>
                                  <div className="outline-lesson-meta">
                                    <span>{lesson.lessonType || "lesson"}</span>
                                    <span>
                                      {lesson.estimatedDurationMinutes || 5} mins
                                    </span>
                                  </div>
                                </div>
                                <div className="outline-lesson-actions">
                                  <span
                                    className={`outline-lesson-badge ${
                                      lesson.isLocked
                                        ? "locked"
                                        : isCompleted
                                          ? "completed"
                                          : progressEntry
                                            ? "in-progress"
                                            : "available"
                                    }`}
                                  >
                                    {statusLabel}
                                  </span>
                                  {!lesson.isLocked ? (
                                    <a
                                      className="outline-link"
                                      href={`#/lesson/${courseSlug}/${lesson.slug}`}
                                    >
                                      {user?.id ? "Open lesson" : "Preview lesson"}
                                    </a>
                                  ) : null}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="outline-cta">
              <div className="cta-content">
                <h2>Need guided support for {course?.name}?</h2>
                <p>
                  Join the paid cohort for structured delivery, instructor support,
                  assignments, and certification readiness.
                </p>
                <div className="cta-actions">
                  <button
                    type="button"
                    className="primary-link"
                    onClick={() => setShowCohortModal(true)}
                  >
                    View paid cohort options
                  </button>
                  {targetLessonSlug ? (
                    <button
                      type="button"
                      className="outline-link"
                      onClick={handleStartLearning}
                      disabled={startingCourse}
                    >
                      {startingCourse ? "Opening..." : startButtonLabel}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <CohortTrainingModal
        isOpen={showCohortModal}
        onClose={() => setShowCohortModal(false)}
        onContinue={() => {
          setShowCohortModal(false);
          window.location.hash = user ? "#/my-courses" : "#/";
        }}
        user={user}
        mode="application"
        courseName={course?.name}
        courseSlug={courseSlug}
        courseId={course?._id}
        primaryLabel={user ? "Open My Courses" : "Back to Home"}
      />
    </div>
  );
};

export default CourseOutlinePage;
