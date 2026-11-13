import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PublicLayout } from '../../layouts';

export default function NotFoundPage() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  const isLearner = ['/dashboard', '/my-learning', '/cohorts', '/notifications', '/certificates', '/account'].some(p => pathname.startsWith(p));

  return (
    <PublicLayout>
      <div style={{
        minHeight: 'calc(100vh - var(--nav-height))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '16px', padding: '40px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '80px', fontWeight: 800, color: 'var(--color-border)', lineHeight: 1 }}>404</div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text)' }}>
          Page not found
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', maxWidth: '360px' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary btn-md">Go Home</Link>
          <Link to="/courses" className="btn btn-secondary btn-md">Browse Courses</Link>
          {isLearner && <Link to="/dashboard" className="btn btn-secondary btn-md">Dashboard</Link>}
          {isAdmin && <Link to="/admin" className="btn btn-secondary btn-md">Admin Overview</Link>}
        </div>
      </div>
    </PublicLayout>
  );
}
