import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/api';
import { AdminPageHeader, AdminStatCard } from '../../components/admin';
import './AdminPages.css';

export default function AdminOverviewPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: adminService.getOverview,
  });

  const ov = data?.overview || {};

  if (isLoading) return <div className="page-loading"><div className="spinner" /></div>;

  return (
    <div className="admin-page">
      <AdminPageHeader title="Overview" description="Platform summary at a glance." />

      <div className="admin-stats-grid">
        <AdminStatCard label="Total Learners" value={ov.totalStudents ?? '—'} color="var(--color-primary)" />
        <AdminStatCard label="Published Courses" value={ov.publishedCourses ?? '—'} color="var(--color-accent)" />
        <AdminStatCard label="Total Enrollments" value={ov.totalEnrollments ?? '—'} color="#8b5cf6" />
        <AdminStatCard label="Active Cohorts" value={ov.cohorts?.active ?? '—'} color="#f59e0b" />
        <AdminStatCard label="Upcoming Cohorts" value={ov.cohorts?.upcoming ?? '—'} color="var(--color-primary)" />
        <AdminStatCard label="Open Applications" value={ov.cohortApplications?.open ?? '—'} color="#ec4899" />
        <AdminStatCard label="Payments Pending Review" value={ov.payments?.pendingReview ?? '—'} color="var(--color-danger)" />
        <AdminStatCard label="Completed Cohorts" value={ov.cohorts?.completed ?? '—'} color="var(--color-accent)" />
      </div>

      <div className="admin-overview-links">
        <h2 className="admin-overview-links__title">Quick Actions</h2>
        <div className="admin-overview-links__grid">
          {[
            { to: '/admin/courses', label: 'Manage Courses', desc: 'Create, edit, publish courses' },
            { to: '/admin/learners', label: 'Manage Learners', desc: 'View and manage student accounts' },
            { to: '/admin/cohorts', label: 'Manage Cohorts', desc: 'Create cohorts and enroll students' },
            { to: '/admin/payments', label: 'Review Payments', desc: 'Confirm or reject payment proofs' },
            { to: '/admin/certificates', label: 'Issue Certificates', desc: 'Issue certificates to graduates' },
            { to: '/admin/announcements', label: 'Announcements', desc: 'Send messages to cohorts' },
          ].map(item => (
            <Link key={item.to} to={item.to} className="admin-quick-link">
              <span className="admin-quick-link__label">{item.label}</span>
              <span className="admin-quick-link__desc">{item.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
