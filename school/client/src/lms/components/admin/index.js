import React from 'react';
import './admin.css';

export function AdminPageHeader({ title, description, action }) {
  return (
    <div className="admin-page-header">
      <div>
        <h1 className="admin-page-header__title">{title}</h1>
        {description && <p className="admin-page-header__desc">{description}</p>}
      </div>
      {action && <div className="admin-page-header__action">{action}</div>}
    </div>
  );
}

export function AdminTable({ columns, rows, emptyText = 'No records found.' }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i} style={{ width: col.width }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={columns.length} className="admin-table__empty">{emptyText}</td></tr>
            : rows.map((row, i) => (
              <tr key={i}>
                {columns.map((col, j) => (
                  <td key={j}>{col.render ? col.render(row) : row[col.key]}</td>
                ))}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

export function AdminStatCard({ label, value, sub, color }) {
  return (
    <div className="admin-stat-card" style={{ borderTop: `3px solid ${color || 'var(--color-primary)'}` }}>
      <span className="admin-stat-card__value">{value}</span>
      <span className="admin-stat-card__label">{label}</span>
      {sub && <span className="admin-stat-card__sub">{sub}</span>}
    </div>
  );
}

export function AdminModal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal modal--${size}`} onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">{title}</h3>
          <button className="modal__close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    active: 'badge-success', completed: 'badge-success', confirmed: 'badge-success',
    issued: 'badge-success', admitted: 'badge-success', published: 'badge-success',
    upcoming: 'badge-primary', new: 'badge-primary', initiated: 'badge-neutral',
    pending: 'badge-warning', pending_review: 'badge-warning', contacted: 'badge-warning',
    in_progress: 'badge-warning', waived: 'badge-neutral',
    failed: 'badge-danger', closed: 'badge-danger', revoked: 'badge-danger',
    refunded: 'badge-neutral', archived: 'badge-neutral', dropped: 'badge-neutral',
  };
  return (
    <span className={`badge ${map[status] || 'badge-neutral'}`}>
      {String(status || '').replace(/_/g, ' ')}
    </span>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i}><div className="skeleton" style={{ height: '12px', width: '80px' }} /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: cols }).map((_, j) => (
                <td key={j}><div className="skeleton" style={{ height: '14px', width: j === 0 ? '140px' : '80px' }} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
