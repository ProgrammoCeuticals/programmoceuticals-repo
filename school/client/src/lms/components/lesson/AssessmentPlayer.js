import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './AssessmentPlayer.css';

function QuizQuestion({ question, index, answer, onChange }) {
  const type = question.type || 'text';
  return (
    <div className="quiz-question">
      <div className="quiz-question__num">Question {index + 1}</div>
      <p className="quiz-question__text">{question.question || question.text || `Question ${index + 1}`}</p>
      {type === 'multiple_choice' && Array.isArray(question.options) ? (
        <div className="quiz-question__options">
          {question.options.map((opt, i) => (
            <label key={i} className={`quiz-option ${answer === opt ? 'selected' : ''}`}>
              <input
                type="radio"
                name={`q-${question.id || index}`}
                value={opt}
                checked={answer === opt}
                onChange={() => onChange(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      ) : (
        <textarea
          className="form-textarea quiz-question__textarea"
          value={answer || ''}
          onChange={e => onChange(e.target.value)}
          placeholder="Your answer…"
          rows={3}
        />
      )}
    </div>
  );
}

function SubmissionResult({ submission, assessment }) {
  const passed = submission.score !== null && submission.score >= (assessment.passScore || 70);
  return (
    <div className={`submission-result ${passed ? 'submission-result--pass' : submission.score !== null ? 'submission-result--fail' : 'submission-result--pending'}`}>
      <div className="submission-result__icon">
        {submission.score !== null
          ? passed
            ? <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        }
      </div>
      <div className="submission-result__body">
        <h4>
          {submission.score !== null
            ? passed ? 'Assessment Passed' : 'Assessment Not Passed'
            : 'Submission Received'
          }
        </h4>
        {submission.score !== null && (
          <p>Your score: <strong>{submission.score}%</strong> (pass mark: {assessment.passScore}%)</p>
        )}
        {submission.score === null && (
          <p>Your submission is being reviewed. You'll be notified when it's graded.</p>
        )}
        {submission.feedback && (
          <div className="submission-result__feedback">
            <span>Feedback:</span> {submission.feedback}
          </div>
        )}
        <p className="submission-result__attempt">Attempt {submission.attemptNumber}</p>
      </div>
    </div>
  );
}

export default function AssessmentPlayer({ courseSlug, lessonId }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['student-assessments', courseSlug],
    queryFn: () => studentService.getCourseAssessments(courseSlug),
    enabled: !!user && !!courseSlug,
  });

  const { data: submissionsData } = useQuery({
    queryKey: ['student-submissions', courseSlug],
    queryFn: () => studentService.getSubmissions(`courseSlug=${courseSlug}`),
    enabled: !!user && !!courseSlug,
  });

  const submitMutation = useMutation({
    mutationFn: () => studentService.submitAssessment(activeAssessment.id, answers),
    onSuccess: (data) => {
      setSubmitted(data.submission);
      queryClient.invalidateQueries({ queryKey: ['student-submissions', courseSlug] });
    },
    onError: (err) => setError(err.message || 'Submission failed.'),
  });

  const assessments = data?.assessments || [];
  const submissions = submissionsData?.submissions || [];

  if (!user || isLoading || assessments.length === 0) return null;

  const getSubmissionForAssessment = (assessmentId) =>
    submissions.filter(s => s.assessmentId === assessmentId)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0] || null;

  const handleOpen = (assessment) => {
    setActiveAssessment(assessment);
    setAnswers({});
    setSubmitted(null);
    setError('');
  };

  const handleClose = () => {
    setActiveAssessment(null);
    setAnswers({});
    setSubmitted(null);
    setError('');
  };

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  return (
    <div className="assessment-player">
      <h3 className="assessment-player__title">Assessments</h3>
      <div className="assessment-player__list">
        {assessments.map(assessment => {
          const lastSub = getSubmissionForAssessment(assessment.id);
          const attemptsLeft = assessment.maxAttempts - (submissions.filter(s => s.assessmentId === assessment.id).length);
          const passed = lastSub?.score !== null && lastSub?.score >= assessment.passScore;

          return (
            <div key={assessment.id} className="assessment-card">
              <div className="assessment-card__info">
                <span className="assessment-card__title">{assessment.title}</span>
                <span className="assessment-card__meta">
                  {assessment.type} · Pass {assessment.passScore}% · {assessment.maxAttempts} attempts
                </span>
                {lastSub && (
                  <span className={`assessment-card__result ${passed ? 'pass' : lastSub.score !== null ? 'fail' : 'pending'}`}>
                    {lastSub.score !== null ? `Last score: ${lastSub.score}%` : 'Pending review'}
                  </span>
                )}
              </div>
              <div className="assessment-card__actions">
                {passed
                  ? <span className="badge badge-success">Passed</span>
                  : attemptsLeft > 0
                    ? <button className="btn btn-primary btn-sm" onClick={() => handleOpen(assessment)}>
                        {lastSub ? `Retry (${attemptsLeft} left)` : 'Start'}
                      </button>
                    : <span className="badge badge-danger">No attempts left</span>
                }
              </div>
            </div>
          );
        })}
      </div>

      {activeAssessment && (
        <div className="assessment-modal-overlay" onClick={handleClose}>
          <div className="assessment-modal" onClick={e => e.stopPropagation()}>
            <div className="assessment-modal__header">
              <h3>{activeAssessment.title}</h3>
              <button className="modal__close" onClick={handleClose} aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="assessment-modal__body">
              {submitted ? (
                <SubmissionResult submission={submitted} assessment={activeAssessment} />
              ) : (
                <>
                  {activeAssessment.instructions && (
                    <p className="assessment-modal__instructions">{activeAssessment.instructions}</p>
                  )}
                  {error && <div className="alert alert-danger">{error}</div>}
                  {activeAssessment.questions?.length > 0
                    ? (
                      <>
                        {activeAssessment.questions.map((q, i) => (
                          <QuizQuestion
                            key={q.id || i}
                            question={q}
                            index={i}
                            answer={answers[q.id || i]}
                            onChange={(val) => handleAnswer(q.id || i, val)}
                          />
                        ))}
                        <div className="assessment-modal__footer">
                          <button className="btn btn-secondary btn-md" onClick={handleClose}>Cancel</button>
                          <button
                            className="btn btn-primary btn-md"
                            onClick={() => submitMutation.mutate()}
                            disabled={submitMutation.isPending}
                          >
                            {submitMutation.isPending ? 'Submitting…' : 'Submit Assessment'}
                          </button>
                        </div>
                      </>
                    )
                    : (
                      <div>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
                          This is an open-ended assignment. Submit when ready.
                        </p>
                        <div className="assessment-modal__footer">
                          <button className="btn btn-secondary btn-md" onClick={handleClose}>Cancel</button>
                          <button
                            className="btn btn-primary btn-md"
                            onClick={() => submitMutation.mutate()}
                            disabled={submitMutation.isPending}
                          >
                            {submitMutation.isPending ? 'Submitting…' : 'Submit'}
                          </button>
                        </div>
                      </div>
                    )
                  }
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
