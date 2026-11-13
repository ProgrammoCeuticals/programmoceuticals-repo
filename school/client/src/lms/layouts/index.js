import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './layouts.css';

export function PublicLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="layout-public">
      <header className="pub-nav">
        <div className="pub-nav__inner">
          <Link to="/" className="pub-nav__brand">
            <img src="/logo.png" alt="ProgrammoCeuticals" className="pub-nav__logo" />
            <span className="pub-nav__name">ProgrammoCeuticals</span>
          </Link>

          <nav className={`pub-nav__links ${menuOpen ? 'open' : ''}`}>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Home</NavLink>
            <NavLink to="/courses" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Courses</NavLink>
            <NavLink to="/timetable" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Timetable</NavLink>
            <NavLink to="/certificate-verify" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Verify Certificate</NavLink>
          </nav>

          <div className="pub-nav__actions">
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn btn-primary btn-sm">
                  Dashboard
                </Link>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            )}
          </div>

          <button className="pub-nav__burger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </header>

      <main className="layout-public__main">{children}</main>

      <footer className="pub-footer">
        <div className="pub-footer__inner">
          <div className="pub-footer__brand">
            <img src="/logo.png" alt="ProgrammoCeuticals" className="pub-footer__logo" />
            <p>A professional programming academy. Learn free. Train with cohorts. Get certified.</p>
          </div>
          <div className="pub-footer__links">
            <div>
              <h4>Learn</h4>
              <Link to="/courses">All Courses</Link>
              <Link to="/timetable">Timetable</Link>
            </div>
            <div>
              <h4>Account</h4>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </div>
            <div>
              <h4>Verify</h4>
              <Link to="/certificate-verify">Certificate Lookup</Link>
            </div>
          </div>
        </div>
        <div className="pub-footer__bottom">
          <p>© {new Date().getFullYear()} ProgrammoCeuticals. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export function LearnerLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="layout-learner">
      <header className="learner-topbar">
        <div className="learner-topbar__inner">
          <button className="learner-topbar__burger" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle sidebar">
            <span /><span /><span />
          </button>
          <Link to="/" className="learner-topbar__brand">ProgrammoCeuticals</Link>
          <div className="learner-topbar__actions">
            <NavLink to="/notifications" className="learner-topbar__icon-btn" title="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </NavLink>
            <span className="learner-topbar__user">{user?.name?.split(' ')[0]}</span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="learner-body">
        <aside className={`learner-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="learner-sidebar__nav">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setSidebarOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Dashboard
            </NavLink>
            <NavLink to="/my-learning" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setSidebarOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              My Learning
            </NavLink>
            <NavLink to="/cohorts" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setSidebarOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Cohorts
            </NavLink>
            <NavLink to="/notifications" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setSidebarOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              Notifications
            </NavLink>
            <NavLink to="/certificates" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setSidebarOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
              Certificates
            </NavLink>
            <NavLink to="/account" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setSidebarOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Account
            </NavLink>
          </nav>
        </aside>

        {sidebarOpen && <div className="learner-sidebar__overlay" onClick={() => setSidebarOpen(false)} />}

        <main className="learner-main">{children}</main>
      </div>
    </div>
  );
}

export function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="layout-admin">
      <header className="admin-topbar">
        <div className="admin-topbar__inner">
          <button className="admin-topbar__burger" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle sidebar">
            <span /><span /><span />
          </button>
          <Link to="/admin" className="admin-topbar__brand">ProgrammoCeuticals Admin</Link>
          <div className="admin-topbar__actions">
            <span className="admin-topbar__user">{user?.name}</span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="admin-body">
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="admin-sidebar__nav">
            <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setSidebarOpen(false)}>Overview</NavLink>
            <NavLink to="/admin/courses" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setSidebarOpen(false)}>Courses</NavLink>
            <NavLink to="/admin/learners" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setSidebarOpen(false)}>Learners</NavLink>
            <NavLink to="/admin/cohorts" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setSidebarOpen(false)}>Cohorts</NavLink>
            <NavLink to="/admin/payments" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setSidebarOpen(false)}>Payments</NavLink>
            <NavLink to="/admin/certificates" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setSidebarOpen(false)}>Certificates</NavLink>
            <NavLink to="/admin/announcements" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setSidebarOpen(false)}>Announcements</NavLink>
          </nav>
        </aside>

        {sidebarOpen && <div className="admin-sidebar__overlay" onClick={() => setSidebarOpen(false)} />}

        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
