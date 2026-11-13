import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { studentService } from '../../services/api';
import { EmptyState } from '../../components/ui';
import './CertificatesPage.css';

function CertificateCard({ certificate }) {
  return (
    <div className="certificate-card">
      <div className="certificate-card__top">
        <div className="certificate-card__seal">
          <img src="/logo.png" alt="ProgrammoCeuticals" />
        </div>
        <div className="certificate-card__label">Certificate of Completion</div>
      </div>
      <div className="certificate-card__body">
        <div className="certificate-card__course">{certificate.course?.title}</div>
        {certificate.cohort?.name && (
          <div className="certificate-card__cohort">{certificate.cohort.name}</div>
        )}
        <div className="certificate-card__date">
          Issued {new Date(certificate.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <div className="certificate-card__number">{certificate.certificateNumber}</div>
      </div>
      <div className="certificate-card__actions">
        <Link
          to={`/certificate-verify/${encodeURIComponent(certificate.certificateNumber)}`}
          className="btn btn-secondary btn-sm"
        >
          Verify
        </Link>
      </div>
    </div>
  );
}

export default function CertificatesPage() {
  const { data: certificates = [], isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: studentService.getCertificates,
  });

  return (
    <div className="certificates-page">
      <div className="page-header">
        <h1>Certificates</h1>
        <p>Your earned certificates from ProgrammoCeuticals.</p>
      </div>

      {isLoading
        ? <div className="page-loading" style={{ minHeight: 200 }}><div className="spinner" /></div>
        : certificates.length === 0
          ? (
            <EmptyState
              title="No certificates yet"
              description="Complete a course and pass the required assessments to earn a certificate."
              action={<Link to="/my-learning" className="btn btn-primary btn-md">Go to My Learning</Link>}
            />
          )
          : (
            <div className="certificates-grid">
              {certificates.map(cert => (
                <CertificateCard key={cert.id || cert.certificateNumber} certificate={cert} />
              ))}
            </div>
          )
      }
    </div>
  );
}
