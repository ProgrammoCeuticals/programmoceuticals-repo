import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../../services/api';
import { EmptyState, Modal } from '../../components/ui';
import './CohortsPage.css';

const STATUS_LABELS = {
  new: 'Application Received',
  contacted: 'Contacted',
  admitted: 'Admitted',
  closed: 'Closed',
};

const PAYMENT_LABELS = {
  pending: 'Payment Pending',
  confirmed: 'Payment Confirmed',
  waived: 'Waived',
};

function ApplicationCard({ application, onPayment }) {
  const statusClass = {
    new: 'badge-neutral',
    contacted: 'badge-warning',
    admitted: 'badge-success',
    closed: 'badge-danger',
  }[application.status] || 'badge-neutral';

  const paymentClass = {
    pending: 'badge-warning',
    confirmed: 'badge-success',
    waived: 'badge-neutral',
  }[application.paymentStatus] || 'badge-neutral';

  return (
    <div className="application-card">
      <div className="application-card__header">
        <div className="application-card__info">
          <h3 className="application-card__course">{application.course?.title || 'Course'}</h3>
          {application.cohort?.name && (
            <span className="application-card__cohort">{application.cohort.name}</span>
          )}
        </div>
        <div className="application-card__badges">
          <span className={`badge ${statusClass}`}>{STATUS_LABELS[application.status] || application.status}</span>
          <span className={`badge ${paymentClass}`}>{PAYMENT_LABELS[application.paymentStatus] || application.paymentStatus}</span>
        </div>
      </div>
      <div className="application-card__meta">
        <span>Applied {new Date(application.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        {application.preferredStartDate && (
          <span>Preferred start: {new Date(application.preferredStartDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        )}
      </div>
      {application.status === 'admitted' && application.paymentStatus === 'pending' && (
        <button className="btn btn-primary btn-sm" onClick={() => onPayment(application)}>
          Initiate Payment
        </button>
      )}
    </div>
  );
}

function PaymentModal({ application, onClose }) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState('initiate');
  const [payment, setPayment] = useState(null);
  const [proof, setProof] = useState({ transactionReference: '', note: '' });
  const [error, setError] = useState('');

  const initiateMutation = useMutation({
    mutationFn: () => studentService.initiatePayment({
      type: 'cohort_training',
      method: 'bank_transfer',
      provider: 'manual',
      applicationId: application.id,
    }),
    onSuccess: (data) => { setPayment(data.payment); setStep('proof'); },
    onError: (err) => setError(err.message || 'Failed to initiate payment.'),
  });

  const proofMutation = useMutation({
    mutationFn: () => studentService.submitPaymentProof(payment.id, {
      method: 'bank_transfer',
      transactionReference: proof.transactionReference,
      note: proof.note,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cohort-applications'] });
      setStep('done');
    },
    onError: (err) => setError(err.message || 'Failed to submit proof.'),
  });

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}

      {step === 'initiate' && (
        <div>
          <p style={{ marginBottom: '20px', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            You've been admitted to <strong>{application.cohort?.name || application.course?.title}</strong>.
            Initiate your payment to confirm your seat.
          </p>
          <button className="btn btn-primary btn-md" onClick={() => initiateMutation.mutate()} disabled={initiateMutation.isPending}>
            {initiateMutation.isPending ? 'Processing…' : 'Initiate Bank Transfer'}
          </button>
        </div>
      )}

      {step === 'proof' && payment && (
        <div>
          <div className="payment-instructions">
            <h4>Transfer Details</h4>
            <p>Reference: <strong style={{ fontFamily: 'var(--font-mono)' }}>{payment.reference}</strong></p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Use this reference as your transfer narration.
            </p>
          </div>
          <div className="form-group" style={{ marginTop: '20px' }}>
            <label className="form-label">Transaction reference from your bank</label>
            <input className="form-input" value={proof.transactionReference} onChange={e => setProof(p => ({ ...p, transactionReference: e.target.value }))} placeholder="e.g. TRX123456789" />
          </div>
          <div className="form-group">
            <label className="form-label">Note (optional)</label>
            <textarea className="form-textarea" value={proof.note} onChange={e => setProof(p => ({ ...p, note: e.target.value }))} placeholder="e.g. Paid from GTBank mobile app" rows={2} />
          </div>
          <button className="btn btn-primary btn-md" onClick={() => proofMutation.mutate()} disabled={proofMutation.isPending || !proof.transactionReference}>
            {proofMutation.isPending ? 'Submitting…' : 'Submit Payment Proof'}
          </button>
        </div>
      )}

      {step === 'done' && (
        <div className="alert alert-success">
          Payment proof submitted. Our team will confirm your payment shortly.
          <button className="btn btn-secondary btn-sm" style={{ marginTop: '12px' }} onClick={onClose}>Close</button>
        </div>
      )}
    </div>
  );
}

export default function CohortsPage() {
  const [paymentModal, setPaymentModal] = useState(null);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['cohort-applications'],
    queryFn: studentService.getMyApplications,
  });

  return (
    <div className="cohorts-page">
      <div className="page-header">
        <h1>Cohorts</h1>
        <p>Your cohort applications and enrollment status.</p>
      </div>

      {isLoading
        ? <div className="page-loading" style={{ minHeight: 200 }}><div className="spinner" /></div>
        : applications.length === 0
          ? (
            <EmptyState
              title="No cohort applications"
              description="Apply for a cohort from any course page to get started with instructor-led training."
              action={<Link to="/courses" className="btn btn-primary btn-md">Browse Courses</Link>}
            />
          )
          : (
            <div className="cohorts-list">
              {applications.map(app => (
                <ApplicationCard key={app.id} application={app} onPayment={setPaymentModal} />
              ))}
            </div>
          )
      }

      <Modal
        open={!!paymentModal}
        onClose={() => setPaymentModal(null)}
        title="Complete Payment"
        size="md"
      >
        {paymentModal && (
          <PaymentModal application={paymentModal} onClose={() => setPaymentModal(null)} />
        )}
      </Modal>
    </div>
  );
}
