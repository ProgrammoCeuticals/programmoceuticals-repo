import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { certificatesService } from '../../services/api';
import './CertificateVerifyPage.css';

function VerifiedResult({ certificate }) {
  return (
    <div className="verify-result verify-result--valid">
      <div className="verify-result__icon verify-result__icon--valid">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h2>Certificate Verified</h2>
      <p>This certificate is valid and was issued by ProgrammoCeuticals.</p>
      <div className="verify-cert-card">
        <div className="verify-cert-row">
          <span className="verify-cert-label">Learner</span>
          <span className="verify-cert-value">{certificate.student?.name}</span>
        </div>
        <div className="verify-cert-row">
          <span className="verify-cert-label">Course</span>
          <span className="verify-cert-value">{certificate.course?.title}</span>
        </div>
        {certificate.cohort?.name && (
          <div className="verify-cert-row">
            <span className="verify-cert-label">Cohort</span>
            <span className="verify-cert-value">{certificate.cohort.name}</span>
          </div>
        )}
        <div className="verify-cert-row">
          <span className="verify-cert-label">Certificate No.</span>
          <span className="verify-cert-value verify-cert-value--mono">{certificate.certificateNumber}</span>
        </div>
        <div className="verify-cert-row">
          <span className="verify-cert-label">Issued</span>
          <span className="verify-cert-value">
            {new Date(certificate.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  );
}

function InvalidResult({ message }) {
  return (
    <div className="verify-result verify-result--invalid">
      <div className="verify-result__icon verify-result__icon--invalid">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </div>
      <h2>Certificate Not Found</h2>
      <p>{message || 'No valid certificate was found for this number.'}</p>
    </div>
  );
}

export default function CertificateVerifyPage() {
  const { certificateNumber: paramNumber } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(paramNumber ? decodeURIComponent(paramNumber) : '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    const num = input.trim();
    if (!num) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await certificatesService.verify(num);
      setResult(data);
      navigate(`/certificate-verify/${encodeURIComponent(num)}`, { replace: true });
    } catch (err) {
      if (err.status === 404) {
        setResult({ verified: false, message: 'Certificate record not found.' });
      } else {
        setError('Verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-page">
      <div className="verify-page__inner">
        <div className="verify-page__header">
          <h1>Certificate Verification</h1>
          <p>Enter a certificate number to verify its authenticity.</p>
        </div>

        <form className="verify-form" onSubmit={handleVerify}>
          <input
            className="form-input verify-form__input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. PC-2026-123456-ABCDEF"
            autoFocus
          />
          <button type="submit" className="btn btn-primary btn-md" disabled={loading || !input.trim()}>
            {loading ? 'Verifying…' : 'Verify'}
          </button>
        </form>

        {error && <div className="alert alert-danger" style={{ maxWidth: 560, margin: '0 auto' }}>{error}</div>}

        {result && (
          result.verified
            ? <VerifiedResult certificate={result.certificate} />
            : <InvalidResult message={result.message} />
        )}
      </div>
    </div>
  );
}
