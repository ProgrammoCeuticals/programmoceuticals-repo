import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
  },
  {
    path: '/inventory',
    label: 'Inventory',
    icon: 'M20 6h-2.18c.07-.44.18-.88.18-1.33C18 2.53 15.47 0 12.33 0c-1.7 0-3.21.8-4.19 2.05L12 6.5l3.86-4.45A3.33 3.33 0 0115.67 1c1.84 0 3.33 1.49 3.33 3.33 0 .55-.15 1.07-.42 1.5H9.42C9.15 5.4 9 4.88 9 4.33 9 3.9 9.12 3.49 9.3 3.1L6 .5C4.3 1.57 3 3.36 3 5.5c0 3.87 3.13 7 7 7h.5L4 19h16l-6.5-6.5H14c3.87 0 7-3.13 7-7 0-.44-.04-.87-.1-1.3L20 6z',
  },
  {
    path: '/pos',
    label: 'POS',
    icon: 'M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59L5.25 14c-.16.28-.25.61-.25.96C5 16.1 5.9 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0023.43 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
  },
  {
    path: '/sales',
    label: 'Sales',
    icon: 'M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h12v2H3v-2z',
  },
  {
    path: '/purchasing',
    label: 'Purchasing',
    icon: 'M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z',
  },
  {
    path: '/suppliers',
    label: 'Suppliers',
    icon: 'M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z',
  },
  {
    path: '/customers',
    label: 'Customers',
    icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
  },
  {
    path: '/expenses',
    label: 'Expenses',
    icon: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z',
  },
  {
    path: '/reports',
    label: 'Reports',
    icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
  },
]

export default function Sidebar({ isOpen, onClose }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

  const sidebarClass = [
    'sidebar',
    isMobile ? (isOpen ? 'mobile-open' : 'collapsed') : (!isOpen ? 'collapsed' : ''),
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      {/* Overlay — mobile only */}
      <div
        className={`sidebar-overlay${isMobile && isOpen ? ' visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={sidebarClass} aria-label="Main navigation">
        <nav>
          <ul className="sidebar-nav">
            {NAV_ITEMS.map((item) => (
              <li className="sidebar-nav-item" key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={isMobile ? onClose : undefined}
                  className={({ isActive }) => (isActive ? 'active' : undefined)}
                >
                  <svg
                    className="sidebar-icon"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
