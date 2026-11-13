import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { coursesService } from '../../services/api';
import { CourseIcon, LevelBadge, SkeletonCard, Modal, EmptyState } from '../../components/ui';
import CohortApplicationForm from '../../components/course/CohortApplicationForm';
import './CoursesPage.css';

const ALL = 'All';

export default function CoursesPage() {
  const [category, setCategory] = useState(ALL);
  const [level, setLevel] = useState(ALL);
  const [cohortModal, setCohortModal] = useState(null);

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: coursesService.list,
  });

  const categories = useMemo(() => [ALL, ...new Set(courses.map(c => c.category).filter(Boolean))], [courses]);
  const levels = useMemo(() => [ALL, ...new Set(courses.map(c => c.level).filter(Boolean))], [courses]);

  const filtered = useMemo(() => courses.filter(c => {
    if (category !== ALL && c.category !== category) return false;
    if (level !== ALL && c.level !== level) return false;
    return true;
  }), [courses, category, level]);

  return (
    <div className="courses-page">
      <div className="courses-page__header">
        <div className="courses-page__header-inner">
          <h1>All Courses</h1>
          <p>Free self-paced learning across web development, data, and systems programming.</p>
        </div>
      </div>

      <div className="courses-page__body">
        <aside className="courses-page__filters">
          <div className="filter-group">
            <h4 className="filter-group__label">Category</h4>
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="filter-group">
            <h4 className="filter-group__label">Level</h4>
            {levels.map(lv => (
              <button
                key={lv}
                className={`filter-btn ${level === lv ? 'active' : ''}`}
                onClick={() => setLevel(lv)}
              >
                {lv}
              </button>
            ))}
          </div>
        </aside>

        <div className="courses-page__results">
          {!isLoading && (
            <p className="courses-page__count">
              {filtered.length} course{filtered.length !== 1 ? 's' : ''}
              {(category !== ALL || level !== ALL) && ' matching filters'}
            </p>
          )}

          <div className="courses-grid-full">
            {isLoading
              ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
              : filtered.length === 0
                ? (
                  <EmptyState
                    title="No courses found"
                    description="Try adjusting your filters."
                    action={
                      <button className="btn btn-secondary btn-md" onClick={() => { setCategory(ALL); setLevel(ALL); }}>
                        Clear filters
                      </button>
                    }
                  />
                )
                : filtered.map(course => (
                  <div key={course.id} className="course-card">
                    <div className="course-card__header">
                      <CourseIcon iconKey={course.iconKey} color={course.color} size={44} />
                      <LevelBadge level={course.level} />
                    </div>
                    <h3 className="course-card__title">{course.title}</h3>
                    <p className="course-card__desc">{course.description}</p>
                    <div className="course-card__meta">
                      <span>{course.duration}</span>
                      <span>{course.category}</span>
                    </div>
                    <div className="course-card__free">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Free self-paced learning
                    </div>
                    <div className="course-card__actions">
                      <Link to={`/course/${course.slug}`} className="btn btn-primary btn-sm">View Course</Link>
                      <button className="btn btn-secondary btn-sm" onClick={() => setCohortModal(course)}>Join Cohort</button>
                    </div>
                  </div>
                ))
            }
          </div>
        </div>
      </div>

      <Modal
        open={!!cohortModal}
        onClose={() => setCohortModal(null)}
        title={`Join Cohort — ${cohortModal?.title || ''}`}
        size="md"
      >
        {cohortModal && (
          <CohortApplicationForm
            course={cohortModal}
            onSuccess={() => setCohortModal(null)}
            onCancel={() => setCohortModal(null)}
          />
        )}
      </Modal>
    </div>
  );
}
