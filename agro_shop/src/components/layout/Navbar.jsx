import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function Navbar({ onToggleSidebar }) {
  const { profile, role, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="nav" style={{ height: '52px', padding: '0 1.25rem' }}>
      <div className="nav-container">
        {/* Brand */}
        <div className="nav-brand">
          {/* Mobile hamburger */}
          <button
            className="mobile-menu-toggle"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            style={{ display: 'flex', marginRight: '0.5rem' }}
          >
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
              <rect y="0"  width="22" height="2" fill="white" />
              <rect y="7"  width="22" height="2" fill="white" />
              <rect y="14" width="22" height="2" fill="white" />
            </svg>
          </button>
          {/* Leaf SVG logo */}
          <svg
            className="nav-logo"
            viewBox="0 0 36 36"
            fill="none"
            aria-hidden="true"
          >
            <rect width="36" height="36" fill="rgba(255,255,255,0.1)" />
            <path
              d="M18 6 C10 6 6 14 8 22 C12 18 16 16 22 16 C18 20 14 24 10 30 C14 30 20 28 24 22 C28 16 26 6 18 6Z"
              fill="#c17f24"
            />
            <line x1="18" y1="22" x2="18" y2="30" stroke="white" strokeWidth="1.5" />
          </svg>
          <h1 className="nav-title">AgroVet POS</h1>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {profile && (
            <>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.85)' }}>
                {profile.full_name}
              </span>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  padding: '2px 6px',
                }}
              >
                {role}
              </span>
            </>
          )}
          <button
            className="btn btn-ghost"
            onClick={handleLogout}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', minHeight: 'unset', color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.4)' }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
