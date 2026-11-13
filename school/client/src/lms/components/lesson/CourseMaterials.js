import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { studentService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import '../../components/admin/MaterialsManager.css';

function PdfIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );
}

export default function CourseMaterials({ courseSlug }) {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['course-materials', courseSlug],
    queryFn: () => studentService.getCourseMaterials(courseSlug),
    enabled: !!user && !!courseSlug,
  });

  const materials = data?.materials || [];

  if (!user || isLoading || materials.length === 0) return null;

  return (
    <div className="materials-panel">
      <h3 className="materials-panel__title">Course Resources</h3>
      <div className="materials-panel__list">
        {materials.map(m => (
          <a
            key={m.id}
            href={m.url}
            target="_blank"
            rel="noopener noreferrer"
            className="material-link"
          >
            <div className="material-link__icon">
              {m.type === 'pdf' ? <PdfIcon /> : <LinkIcon />}
            </div>
            <span className="material-link__title">{m.title}</span>
            <span className="material-link__type">{m.type}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
