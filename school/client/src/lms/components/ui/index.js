import React from 'react';
import './ui.css';

export function Skeleton({ width, height, className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width: width || '100%', height: height || '16px' }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Skeleton height="48px" width="48px" className="skeleton-circle" />
      <Skeleton height="20px" width="70%" />
      <Skeleton height="14px" />
      <Skeleton height="14px" width="85%" />
      <Skeleton height="14px" width="60%" />
    </div>
  );
}

export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal modal--${size}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal__header">
          <h3 id="modal-title" className="modal__title">{title}</h3>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}

export function CourseIcon({ iconKey, color, size = 40 }) {
  const src = `/logos/${iconKey}.svg`;
  return (
    <div
      className="course-icon"
      style={{
        width: size,
        height: size,
        background: color ? `${color}18` : 'var(--color-surface-2)',
        borderRadius: 'var(--radius-md)',
        flexShrink: 0,
      }}
    >
      <img
        src={src}
        alt={iconKey}
        style={{ width: size * 0.6, height: size * 0.6 }}
        onError={e => { e.target.style.display = 'none'; }}
      />
    </div>
  );
}

export function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="breadcrumb__sep">/</span>}
          {item.href
            ? <a href={item.href} className="breadcrumb__link">{item.label}</a>
            : <span className="breadcrumb__current">{item.label}</span>
          }
        </React.Fragment>
      ))}
    </nav>
  );
}

export function LevelBadge({ level }) {
  const map = { Beginner: 'success', Intermediate: 'warning', Advanced: 'danger' };
  return <span className={`badge badge-${map[level] || 'neutral'}`}>{level}</span>;
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state__icon">{icon}</div>}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
