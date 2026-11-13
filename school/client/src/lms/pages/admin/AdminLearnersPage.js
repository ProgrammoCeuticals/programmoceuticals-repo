import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/api';
import { AdminPageHeader, AdminTable, TableSkeleton } from '../../components/admin';
import './AdminPages.css';

export default function AdminLearnersPage() {
  const [search, setSearch] = useState('');

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['admin-students'],
    queryFn: adminService.getStudents,
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return students;
    const q = search.toLowerCase();
    return students.filter(s =>
      s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q)
    );
  }, [students, search]);

  const columns = [
    { label: 'Name', render: r => (
      <div>
        <div style={{ fontWeight: 'var(--weight-medium)', color: 'var(--color-text)' }}>{r.name}</div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{r.email}</div>
      </div>
    )},
    { label: 'Enrollments', render: r => (
      <div style={{ fontSize: 'var(--text-xs)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span>Total: {r.enrollments?.total ?? 0}</span>
        <span style={{ color: 'var(--color-accent)' }}>Active: {r.enrollments?.active ?? 0}</span>
        <span style={{ color: 'var(--color-text-muted)' }}>Done: {r.enrollments?.completed ?? 0}</span>
      </div>
    )},
    { label: 'Interests', render: r => (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {(r.interestedCourses || []).slice(0, 4).map(slug => (
          <span key={slug} className="badge badge-neutral" style={{ fontSize: '10px' }}>{slug}</span>
        ))}
        {(r.interestedCourses || []).length > 4 && (
          <span className="badge badge-neutral" style={{ fontSize: '10px' }}>+{r.interestedCourses.length - 4}</span>
        )}
      </div>
    )},
    { label: 'Joined', render: r => r.createdAt
      ? new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : '—'
    },
  ];

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Learners"
        description={`${students.length} registered learners`}
      />

      <div className="admin-filter-bar">
        <input
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {isLoading
        ? <TableSkeleton rows={8} cols={4} />
        : <AdminTable columns={columns} rows={filtered} emptyText="No learners found." />
      }
    </div>
  );
}
