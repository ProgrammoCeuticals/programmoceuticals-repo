import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { coursesService, cohortsService } from '../../services/api';
import { CourseIcon, LevelBadge } from '../../components/ui';
import './TimetablePage.css';

function CohortCard({ cohort, course }) {
  const color = course?.color || '#0b5ed7';
  const startDate = cohort.start_date || cohort.startDate;
  const endDate = cohort.end_date || cohort.endDate;
  const schedule = cohort.schedule || {};
  const timeSlot = schedule.time_slot || schedule.timeSlot;
  const daysPerWeek = schedule.days_per_week || schedule.daysPerWeek;
  const hoursPerSession = schedule.hours_per_session || schedule.hoursPerSession;
  const slotsAvailable = cohort.available_slots ?? cohort.availableSlots;

  return (
    <div className="timetable-card" style={{ borderTop: `3px solid ${color}` }}>
      <div className="timetable-card__header">
        <CourseIcon iconKey={course?.iconKey || course?.slug || ''} color={color} size={40} />
        <div>
          <h3 className="timetable-card__title">{cohort.name}</h3>
          <span className="timetable-card__category">{course?.title}</span>
        </div>
      </div>

      <div className="timetable-card__details">
        {startDate && (
          <div className="timetable-detail-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>
              {new Date(startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              {endDate && ` — ${new Date(endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`}
            </span>
          </div>
        )}

        {timeSlot && (
          <div className="timetable-detail-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>
              {daysPerWeek && `${daysPerWeek}x/week · `}
              {hoursPerSession && `${hoursPerSession}h/session · `}
              {timeSlot}
            </span>
          </div>
        )}

        {cohort.instructor && (
          <div className="timetable-detail-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span>{cohort.instructor}</span>
          </div>
        )}

        <div className="timetable-card__footer">
          <div className="timetable-card__meta">
            {course && <LevelBadge level={course.level} />}
            {slotsAvailable !== undefined && (
              <span className={`badge ${slotsAvailable > 0 ? 'badge-success' : 'badge-danger'}`}>
                {slotsAvailable > 0 ? `${slotsAvailable} seats left` : 'Full'}
              </span>
            )}
          </div>
          <Link to={`/course/${course?.slug || ''}`} className="btn btn-primary btn-sm">
            Apply for Cohort
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TimetablePage() {
  const { data: courses = [], isLoading: loadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: coursesService.list,
  });

  // Fetch upcoming cohorts per course that has a nextCohortStartDate
  const coursesWithCohorts = courses.filter(c => c.nextCohortStartDate);

  const { data: cohortsData = [], isLoading: loadingCohorts } = useQuery({
    queryKey: ['public-cohorts'],
    queryFn: async () => {
      const results = await Promise.allSettled(
        coursesWithCohorts.map(c =>
          c.mongoId
            ? cohortsService.getByCourse(c.mongoId).then(d => (d.cohorts || []).map(cohort => ({ cohort, course: c })))
            : Promise.resolve([])
        )
      );
      return results.flatMap(r => r.status === 'fulfilled' ? r.value : []);
    },
    enabled: coursesWithCohorts.length > 0,
  });

  const isLoading = loadingCourses || loadingCohorts;

  // Filter to upcoming/active cohorts, sort by start date
  const upcomingCohorts = cohortsData
    .filter(({ cohort }) => ['upcoming', 'active'].includes(cohort.status))
    .sort((a, b) => {
      const dateA = new Date(a.cohort.start_date || a.cohort.startDate || 0);
      const dateB = new Date(b.cohort.start_date || b.cohort.startDate || 0);
      return dateA - dateB;
    });

  // Fallback: if no cohort detail data, show course-level cards
  const fallbackCards = coursesWithCohorts.filter(
    c => !upcomingCohorts.some(({ course }) => course.id === c.id)
  );

  return (
    <div className="timetable-page">
      <div className="timetable-page__header">
        <div className="timetable-page__header-inner">
          <h1>Cohort Schedule</h1>
          <p>Upcoming instructor-led cohort training. Self-paced learning is always available — no schedule required.</p>
        </div>
      </div>

      <div className="timetable-page__body">
        {isLoading ? (
          <div className="page-loading" style={{ minHeight: 300 }}><div className="spinner" /></div>
        ) : upcomingCohorts.length === 0 && fallbackCards.length === 0 ? (
          <div className="empty-state">
            <h3>No upcoming cohorts</h3>
            <p>Check back soon or browse courses to start self-paced learning now.</p>
            <Link to="/courses" className="btn btn-secondary btn-md" style={{ marginTop: '16px' }}>Browse Courses</Link>
          </div>
        ) : (
          <div className="timetable-grid">
            {upcomingCohorts.map(({ cohort, course }, i) => (
              <CohortCard key={cohort._id || cohort.id || i} cohort={cohort} course={course} />
            ))}
            {fallbackCards.map(course => (
              <div key={course.id} className="timetable-card" style={{ borderTop: `3px solid ${course.color}` }}>
                <div className="timetable-card__header">
                  <CourseIcon iconKey={course.iconKey} color={course.color} size={40} />
                  <div>
                    <h3 className="timetable-card__title">{course.title}</h3>
                    <span className="timetable-card__category">{course.category}</span>
                  </div>
                </div>
                <div className="timetable-card__date">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Next cohort starts{' '}
                  <strong>
                    {new Date(course.nextCohortStartDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </strong>
                </div>
                <div className="timetable-card__meta">
                  <LevelBadge level={course.level} />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{course.duration}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
