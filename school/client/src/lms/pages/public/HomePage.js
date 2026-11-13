import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { coursesService } from '../../services/api';
import { CourseIcon, LevelBadge, SkeletonCard, Modal } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import CohortApplicationForm from '../../components/course/CohortApplicationForm';
import './HomePage.css';

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero__inner">
        <div className="hero__content">
          <span className="hero__eyebrow">Professional Programming Academy</span>
          <h1 className="hero__headline">
            Learn to build real software.<br />
            <span className="hero__headline--accent">Free. Self-paced. Practical.</span>
          </h1>
          <p className="hero__sub">
            Access full programming courses at no cost. Upgrade to cohort training or certification when you're ready to go further.
          </p>
          <div className="hero__actions">
            <Link to="/courses" className="btn btn-primary btn-lg">Browse Courses</Link>
            <Link to="/signup" className="btn btn-secondary btn-lg">Create Free Account</Link>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__code-card">
            <div className="hero__code-dots">
              <span /><span /><span />
            </div>
            <pre className="hero__code">{`def greet(name):
    return f"Hello, {name}!"

# Start your journey
print(greet("World"))`}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  const stats = [
    { value: '15+', label: 'Courses' },
    { value: '100%', label: 'Free Learning' },
    { value: 'Self-paced', label: 'Learn Anytime' },
    { value: 'Certified', label: 'Industry Recognition' },
  ];
  return (
    <section className="trust">
      <div className="trust__inner">
        {stats.map(s => (
          <div key={s.label} className="trust__stat">
            <span className="trust__value">{s.value}</span>
            <span className="trust__label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function LearningModelSection() {
  const tiers = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      ),
      tag: 'Free',
      tagClass: 'badge-success',
      title: 'Self-Paced Learning',
      description: 'Access all course content at your own pace. No payment required. Register once and learn everything.',
      items: ['Full course access', 'Lesson progress tracking', 'Whiteboard notes', 'Resume anytime'],
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      tag: 'Paid',
      tagClass: 'badge-warning',
      title: 'Cohort Training',
      description: 'Join a structured cohort with live sessions, instructor support, and a defined schedule.',
      items: ['Live instructor sessions', 'Cohort schedule', 'Peer learning', 'Priority support'],
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="8" r="6"/>
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
        </svg>
      ),
      tag: 'Paid',
      tagClass: 'badge-warning',
      title: 'Certification',
      description: 'Earn a verified certificate upon completing a course and passing the required assessments.',
      items: ['Verified certificate', 'Public verification link', 'Completion assessment', 'Shareable credential'],
    },
  ];

  return (
    <section className="learning-model">
      <div className="section-inner">
        <div className="section-header">
          <h2 className="section-title">How learning works</h2>
          <p className="section-sub">Three distinct tiers. One clear path from learning to certification.</p>
        </div>
        <div className="learning-model__grid">
          {tiers.map(t => (
            <div key={t.title} className="learning-model__card">
              <div className="learning-model__icon">{t.icon}</div>
              <div className="learning-model__meta">
                <span className={`badge ${t.tagClass}`}>{t.tag}</span>
                <h3>{t.title}</h3>
                <p>{t.description}</p>
              </div>
              <ul className="learning-model__list">
                {t.items.map(item => (
                  <li key={item}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCoursesSection({ courses, loading, onCohortCTA }) {
  const featured = courses.slice(0, 6);
  return (
    <section className="featured-courses">
      <div className="section-inner">
        <div className="section-header">
          <h2 className="section-title">Featured courses</h2>
          <p className="section-sub">Practical programming education across web, data, and systems.</p>
        </div>
        <div className="courses-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : featured.map(course => (
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
                    <button className="btn btn-secondary btn-sm" onClick={() => onCohortCTA(course)}>Join Cohort</button>
                  </div>
                </div>
              ))
          }
        </div>
        <div className="featured-courses__cta">
          <Link to="/courses" className="btn btn-secondary btn-md">View all courses</Link>
        </div>
      </div>
    </section>
  );
}

function CertificationSection() {
  return (
    <section className="cert-section">
      <div className="section-inner">
        <div className="cert-section__inner">
          <div className="cert-section__content">
            <span className="badge badge-warning" style={{ marginBottom: '16px' }}>Certification</span>
            <h2>Earn a verified certificate</h2>
            <p>
              After completing a course and passing the required assessments, you can apply for a ProgrammoCeuticals certificate.
              Certificates are verified and publicly accessible via a unique certificate number.
            </p>
            <ul className="cert-section__list">
              <li>Complete the full course curriculum</li>
              <li>Pass the required assessments</li>
              <li>Submit certification payment</li>
              <li>Receive your verified certificate</li>
            </ul>
            <Link to="/certificate-verify" className="btn btn-secondary btn-md" style={{ marginTop: '24px' }}>
              Verify a certificate
            </Link>
          </div>
          <div className="cert-section__visual">
            <div className="cert-card">
              <div className="cert-card__header">
                <img src="/logo.png" alt="ProgrammoCeuticals" style={{ width: 36, height: 36, objectFit: 'contain' }} />
                <span>ProgrammoCeuticals</span>
              </div>
              <div className="cert-card__body">
                <p className="cert-card__label">Certificate of Completion</p>
                <p className="cert-card__name">Ada Lovelace</p>
                <p className="cert-card__course">Python Programming</p>
                <p className="cert-card__number">PC-2026-123456-ABCDEF</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { user } = useAuth();
  return (
    <section className="cta-section">
      <div className="section-inner">
        <div className="cta-section__inner">
          <h2>Start learning today. It's free.</h2>
          <p>Create an account to unlock full course access, track your progress, and save your notes.</p>
          <div className="cta-section__actions">
            {user
              ? <Link to="/my-learning" className="btn btn-primary btn-lg">Go to My Learning</Link>
              : <>
                  <Link to="/signup" className="btn btn-primary btn-lg">Create Free Account</Link>
                  <Link to="/courses" className="btn btn-secondary btn-lg">Browse Courses</Link>
                </>
            }
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [cohortModal, setCohortModal] = useState(null);
  const navigate = useNavigate();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: coursesService.list,
  });

  return (
    <div className="home-page">
      <HeroSection />
      <TrustSection />
      <LearningModelSection />
      <FeaturedCoursesSection
        courses={courses}
        loading={isLoading}
        onCohortCTA={course => setCohortModal(course)}
      />
      <CertificationSection />
      <CTASection />

      <Modal
        open={!!cohortModal}
        onClose={() => setCohortModal(null)}
        title={`Join Cohort — ${cohortModal?.title || ''}`}
        size="md"
      >
        {cohortModal && (
          <CohortApplicationForm
            course={cohortModal}
            onSuccess={() => { setCohortModal(null); navigate('/dashboard'); }}
            onCancel={() => setCohortModal(null)}
          />
        )}
      </Modal>
    </div>
  );
}
