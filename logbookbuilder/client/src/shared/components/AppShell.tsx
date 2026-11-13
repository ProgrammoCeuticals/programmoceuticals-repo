import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  List,
  GitBranch,
  Users,
  UserCheck,
  ClipboardList,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/logs", label: "Logs", icon: List },
  { to: "/relationships", label: "Relationships", icon: GitBranch },
  { to: "/personnel", label: "Personnel", icon: UserCheck },
  { to: "/users", label: "Users", icon: Users },
  { to: "/audit", label: "Audit Trail", icon: ClipboardList },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    setMobileOpen(false);
    await logout();
    navigate("/login");
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "var(--bg)",
      }}
    >
      {/* Mobile overlay — closes nav on outside click */}
      <div
        className={`mobile-nav-overlay${mobileOpen ? " open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Top nav ─────────────────────────────────────── */}
      <nav className="nav">
        <div className="nav-container">
          {/* Brand */}
          <div className="nav-brand">
            <div className="nav-brand-icon">
              <BookOpen size={14} color="#ffffff" />
            </div>
            <span className="wordmark">
              Logbook<span>Builder</span>
            </span>
          </div>

          <div className="nav-divider" />

          {/* Nav links */}
          <div className={`nav-links${mobileOpen ? " mobile-open" : ""}`}>
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                <Icon size={13} />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right — user + logout */}
          <div className="nav-right">
            <span className="nav-user-chip">{user?.email}</span>
            <button className="nav-logout" onClick={handleLogout}>
              <LogOut size={12} />
              Sign out
            </button>
            {/* Hamburger — mobile only */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle navigation"
            >
              <span className={`hamburger${mobileOpen ? " open" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Main content ─────────────────────────────────── */}
      <main className="main-content">{children}</main>
    </div>
  );
}
