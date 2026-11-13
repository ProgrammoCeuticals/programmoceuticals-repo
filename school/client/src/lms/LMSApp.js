import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { RequireAuth, RequireAdmin, RedirectIfAuth } from './context/Guards';
import { PublicLayout, LearnerLayout, AdminLayout } from './layouts';
import ErrorBoundary from './components/ui/ErrorBoundary';
import './lms.css';

// Public pages
import HomePage from './pages/public/HomePage';
import CoursesPage from './pages/public/CoursesPage';
import CourseOverviewPage from './pages/public/CourseOverviewPage';
import LessonPlayerPage from './pages/public/LessonPlayerPage';
import LoginPage from './pages/public/LoginPage';
import SignupPage from './pages/public/SignupPage';
import TimetablePage from './pages/public/TimetablePage';
import CertificateVerifyPage from './pages/public/CertificateVerifyPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Learner pages
import DashboardPage from './pages/learner/DashboardPage';
import MyLearningPage from './pages/learner/MyLearningPage';
import CohortsPage from './pages/learner/CohortsPage';
import NotificationsPage from './pages/learner/NotificationsPage';
import CertificatesPage from './pages/learner/CertificatesPage';
import AccountPage from './pages/learner/AccountPage';

import AdminCourseDetailPage from './pages/admin/AdminCourseDetailPage';
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import AdminLearnersPage from './pages/admin/AdminLearnersPage';
import AdminCohortsPage from './pages/admin/AdminCohortsPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminCertificatesPage from './pages/admin/AdminCertificatesPage';
import AdminAnnouncementsPage from './pages/admin/AdminAnnouncementsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 2, retry: 1 },
  },
});

const TITLES = {
  '/': 'ProgrammoCeuticals — Learn Programming Free',
  '/courses': 'All Courses — ProgrammoCeuticals',
  '/login': 'Login — ProgrammoCeuticals',
  '/signup': 'Sign Up — ProgrammoCeuticals',
  '/timetable': 'Cohort Schedule — ProgrammoCeuticals',
  '/certificate-verify': 'Verify Certificate — ProgrammoCeuticals',
  '/dashboard': 'Dashboard — ProgrammoCeuticals',
  '/my-learning': 'My Learning — ProgrammoCeuticals',
  '/cohorts': 'Cohorts — ProgrammoCeuticals',
  '/notifications': 'Notifications — ProgrammoCeuticals',
  '/certificates': 'Certificates — ProgrammoCeuticals',
  '/account': 'Account — ProgrammoCeuticals',
  '/admin': 'Admin Overview — ProgrammoCeuticals',
  '/admin/courses': 'Admin Courses — ProgrammoCeuticals',
  '/admin/learners': 'Admin Learners — ProgrammoCeuticals',
  '/admin/cohorts': 'Admin Cohorts — ProgrammoCeuticals',
  '/admin/payments': 'Admin Payments — ProgrammoCeuticals',
  '/admin/certificates': 'Admin Certificates — ProgrammoCeuticals',
  '/admin/announcements': 'Admin Announcements — ProgrammoCeuticals',
};

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    const path = hash.replace('#', '') || '/';
    const base = '/' + path.split('/').slice(1, 3).join('/');
    const title = TITLES[path] || TITLES[base] || 'ProgrammoCeuticals';
    document.title = title;
  }, [hash]);

  return null;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/courses" element={<PublicLayout><CoursesPage /></PublicLayout>} />
        <Route path="/course/:courseSlug" element={<PublicLayout><CourseOverviewPage /></PublicLayout>} />
        <Route path="/course/:courseSlug/lesson/:lessonSlug" element={<LessonPlayerPage />} />
        <Route path="/timetable" element={<PublicLayout><TimetablePage /></PublicLayout>} />
        <Route path="/certificate-verify" element={<PublicLayout><CertificateVerifyPage /></PublicLayout>} />
        <Route path="/certificate-verify/:certificateNumber" element={<PublicLayout><CertificateVerifyPage /></PublicLayout>} />

        {/* Auth */}
        <Route path="/login" element={<RedirectIfAuth><PublicLayout><LoginPage /></PublicLayout></RedirectIfAuth>} />
        <Route path="/signup" element={<RedirectIfAuth><PublicLayout><SignupPage /></PublicLayout></RedirectIfAuth>} />

        {/* Learner */}
        <Route path="/dashboard" element={<RequireAuth><LearnerLayout><DashboardPage /></LearnerLayout></RequireAuth>} />
        <Route path="/my-learning" element={<RequireAuth><LearnerLayout><MyLearningPage /></LearnerLayout></RequireAuth>} />
        <Route path="/my-learning/:courseSlug" element={<RequireAuth><LearnerLayout><MyLearningPage /></LearnerLayout></RequireAuth>} />
        <Route path="/my-learning/:courseSlug/lesson/:lessonSlug" element={<RequireAuth><LessonPlayerPage /></RequireAuth>} />
        <Route path="/cohorts" element={<RequireAuth><LearnerLayout><CohortsPage /></LearnerLayout></RequireAuth>} />
        <Route path="/notifications" element={<RequireAuth><LearnerLayout><NotificationsPage /></LearnerLayout></RequireAuth>} />
        <Route path="/certificates" element={<RequireAuth><LearnerLayout><CertificatesPage /></LearnerLayout></RequireAuth>} />
        <Route path="/account" element={<RequireAuth><LearnerLayout><AccountPage /></LearnerLayout></RequireAuth>} />

        {/* Admin */}
        <Route path="/admin" element={<RequireAdmin><AdminLayout><AdminOverviewPage /></AdminLayout></RequireAdmin>} />
        <Route path="/admin/courses" element={<RequireAdmin><AdminLayout><AdminCoursesPage /></AdminLayout></RequireAdmin>} />
        <Route path="/admin/courses/:courseId" element={<RequireAdmin><AdminLayout><AdminCourseDetailPage /></AdminLayout></RequireAdmin>} />
        <Route path="/admin/learners" element={<RequireAdmin><AdminLayout><AdminLearnersPage /></AdminLayout></RequireAdmin>} />
        <Route path="/admin/cohorts" element={<RequireAdmin><AdminLayout><AdminCohortsPage /></AdminLayout></RequireAdmin>} />
        <Route path="/admin/payments" element={<RequireAdmin><AdminLayout><AdminPaymentsPage /></AdminLayout></RequireAdmin>} />
        <Route path="/admin/certificates" element={<RequireAdmin><AdminLayout><AdminCertificatesPage /></AdminLayout></RequireAdmin>} />
        <Route path="/admin/announcements" element={<RequireAdmin><AdminLayout><AdminAnnouncementsPage /></AdminLayout></RequireAdmin>} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default function LMSApp() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <HashRouter>
            <AppRoutes />
          </HashRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
