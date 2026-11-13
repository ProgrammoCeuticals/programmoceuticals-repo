import React, { useEffect, useMemo, useRef, useState } from "react";
import "./QISReviewWorkspace.css";
import {
  REVIEW_SECTION_SCHEMA,
  buildSectionFindings,
  getSectionById,
  parseRegulatoryDocx,
} from "../services/qisReviewWorkspaceService";

const REVIEW_STORAGE_KEY = "qis_review_workspace_comments_v1";

const REVIEW_STATUSES = [
  { value: "not-reviewed", label: "Not Reviewed" },
  { value: "in-review", label: "In Review" },
  { value: "needs-update", label: "Needs Update" },
  { value: "resolved", label: "Resolved" },
];

const REVIEW_TYPES = [
  { value: "qis-vs-qos", label: "QIS vs QOS" },
  { value: "completeness", label: "Completeness" },
  { value: "appropriateness", label: "Appropriateness" },
  { value: "regulatory-warning", label: "Regulatory Warning" },
];

const REVIEW_SEVERITIES = [
  { value: "critical", label: "Critical" },
  { value: "major", label: "Major" },
  { value: "minor", label: "Minor" },
  { value: "note", label: "Note" },
];

const createEmptyReviewSection = () => ({
  status: "not-reviewed",
  comments: [],
});

const createReviewState = () =>
  REVIEW_SECTION_SCHEMA.reduce((acc, section) => {
    acc[section.id] = createEmptyReviewSection();
    return acc;
  }, {});

const createCommentDraft = () => ({
  type: "qis-vs-qos",
  severity: "major",
  status: "open",
  qosReference: "",
  comment: "",
  suggestedCorrection: "",
});

const createCommentDrafts = () =>
  REVIEW_SECTION_SCHEMA.reduce((acc, section) => {
    acc[section.id] = createCommentDraft();
    return acc;
  }, {});

const loadStoredReviews = () => {
  if (typeof window === "undefined") {
    return createReviewState();
  }

  try {
    const raw = window.localStorage.getItem(REVIEW_STORAGE_KEY);
    if (!raw) {
      return createReviewState();
    }

    const parsed = JSON.parse(raw);
    return REVIEW_SECTION_SCHEMA.reduce((acc, section) => {
      acc[section.id] = {
        ...createEmptyReviewSection(),
        ...(parsed[section.id] || {}),
        comments: Array.isArray(parsed[section.id]?.comments)
          ? parsed[section.id].comments
          : [],
      };
      return acc;
    }, {});
  } catch (error) {
    console.error("Failed to load QIS workspace reviews:", error);
    return createReviewState();
  }
};

const formatFileSize = (size = 0) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

function QISReviewWorkspace() {
  const [documents, setDocuments] = useState({ qos: null, qis: null });
  const [loading, setLoading] = useState({ qos: false, qis: false });
  const [errors, setErrors] = useState({ qos: "", qis: "" });
  const [activeSectionId, setActiveSectionId] = useState(REVIEW_SECTION_SCHEMA[1].id);
  const [sectionReviews, setSectionReviews] = useState(loadStoredReviews);
  const [commentDrafts, setCommentDrafts] = useState(createCommentDrafts);
  const qosInputRef = useRef(null);
  const qisInputRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      REVIEW_STORAGE_KEY,
      JSON.stringify(sectionReviews)
    );
  }, [sectionReviews]);

  useEffect(() => {
    if (!documents.qis) {
      return;
    }

    const currentSection = getSectionById(documents.qis, activeSectionId);
    if (currentSection?.found) {
      return;
    }

    const firstFound = documents.qis.sections.find((section) => section.found);
    if (firstFound) {
      setActiveSectionId(firstFound.id);
    }
  }, [documents.qis, activeSectionId]);

  const uploadDocument = async (docRole, file) => {
    if (!file) {
      return;
    }

    setLoading((prev) => ({ ...prev, [docRole]: true }));
    setErrors((prev) => ({ ...prev, [docRole]: "" }));

    try {
      const parsed = await parseRegulatoryDocx(file, docRole);
      setDocuments((prev) => ({ ...prev, [docRole]: parsed }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [docRole]: error.message || "Failed to process uploaded document.",
      }));
      setDocuments((prev) => ({ ...prev, [docRole]: null }));
    } finally {
      setLoading((prev) => ({ ...prev, [docRole]: false }));
    }
  };

  const selectedQisSection = useMemo(
    () => getSectionById(documents.qis, activeSectionId),
    [documents.qis, activeSectionId]
  );

  const selectedQosSection = useMemo(
    () => getSectionById(documents.qos, activeSectionId),
    [documents.qos, activeSectionId]
  );

  const selectedReview =
    sectionReviews[activeSectionId] || createEmptyReviewSection();
  const selectedDraft = commentDrafts[activeSectionId] || createCommentDraft();

  const selectedFindings = useMemo(
    () =>
      buildSectionFindings({
        qisSection: selectedQisSection,
        qosSection: selectedQosSection,
        hasQosUpload: Boolean(documents.qos),
      }),
    [documents.qos, selectedQisSection, selectedQosSection]
  );

  const summary = useMemo(() => {
    return REVIEW_SECTION_SCHEMA.reduce(
      (acc, section) => {
        const review = sectionReviews[section.id] || createEmptyReviewSection();
        const openCount = review.comments.filter((comment) =>
          ["open", "needs-update"].includes(comment.status)
        ).length;

        acc.totalComments += review.comments.length;
        acc.openIssues += openCount;
        if (review.comments.length > 0) {
          acc.reviewedSections += 1;
        }
        return acc;
      },
      { totalComments: 0, openIssues: 0, reviewedSections: 0 }
    );
  }, [sectionReviews]);

  const updateSectionStatus = (sectionId, status) => {
    setSectionReviews((prev) => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || createEmptyReviewSection()),
        status,
      },
    }));
  };

  const updateDraft = (sectionId, field, value) => {
    setCommentDrafts((prev) => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || createCommentDraft()),
        [field]: value,
      },
    }));
  };

  const saveComment = () => {
    if (!selectedDraft.comment.trim()) {
      return;
    }

    const entry = {
      id: `${activeSectionId}-${Date.now()}`,
      type: selectedDraft.type,
      severity: selectedDraft.severity,
      status: selectedDraft.status,
      qosReference: selectedDraft.qosReference.trim(),
      comment: selectedDraft.comment.trim(),
      suggestedCorrection: selectedDraft.suggestedCorrection.trim(),
      createdAt: new Date().toISOString(),
    };

    setSectionReviews((prev) => {
      const current = prev[activeSectionId] || createEmptyReviewSection();
      return {
        ...prev,
        [activeSectionId]: {
          ...current,
          status: current.status === "not-reviewed" ? "in-review" : current.status,
          comments: [entry, ...current.comments],
        },
      };
    });

    setCommentDrafts((prev) => ({
      ...prev,
      [activeSectionId]: createCommentDraft(),
    }));
  };

  const removeComment = (commentId) => {
    setSectionReviews((prev) => ({
      ...prev,
      [activeSectionId]: {
        ...(prev[activeSectionId] || createEmptyReviewSection()),
        comments: (prev[activeSectionId]?.comments || []).filter(
          (comment) => comment.id !== commentId
        ),
      },
    }));
  };

  const renderUploadCard = (docRole, config) => {
    const documentData = documents[docRole];
    const isLoading = loading[docRole];
    const error = errors[docRole];
    const inputRef = docRole === "qos" ? qosInputRef : qisInputRef;

    return (
      <div className={`qisws-upload-card qisws-upload-card--${docRole}`}>
        <div className="qisws-upload-card__header">
          <div>
            <div className="qisws-upload-card__eyebrow">{config.eyebrow}</div>
            <h2>{config.title}</h2>
          </div>
          <span className="qisws-upload-card__badge">DOCX</span>
        </div>
        <p>{config.description}</p>
        <input
          ref={inputRef}
          type="file"
          accept=".docx"
          hidden
          onChange={(event) => uploadDocument(docRole, event.target.files?.[0])}
        />
        <div className="qisws-upload-card__actions">
          <button type="button" onClick={() => inputRef.current?.click()}>
            {documentData ? "Replace file" : `Upload ${config.shortLabel}`}
          </button>
          {isLoading && <span className="qisws-inline-status">Processing…</span>}
        </div>
        {error && <div className="qisws-error">{error}</div>}
        {documentData && (
          <div className="qisws-upload-card__meta">
            <div><strong>{documentData.meta.fileName}</strong></div>
            <div>{formatFileSize(documentData.meta.fileSize)} · {documentData.meta.foundSections}/{documentData.meta.totalSections} tracked sections found</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="qisws-page">
      <header className="qisws-hero">
        <div className="qisws-hero__copy">
          <div className="qisws-hero__eyebrow">QOS-led validation</div>
          <h1>QIS–QOS Review Workspace</h1>
          <p>
            Upload the QOS as the main working document, then upload the QIS.
            The system extracts both Word files, generates a digital QIS view,
            and keeps section-by-section review comments tied back to the QOS.
          </p>
        </div>
        <div className="qisws-upload-grid">
          {renderUploadCard("qos", {
            eyebrow: "Primary upload",
            title: "Quality Overall Summary (QOS)",
            shortLabel: "QOS",
            description:
              "Main reference document. Its sections are used to anchor review comments and compare the uploaded QIS.",
          })}
          {renderUploadCard("qis", {
            eyebrow: "Summary upload",
            title: "Quality Information Summary (QIS)",
            shortLabel: "QIS",
            description:
              "Condensed summary document. Its extracted sections are rendered in the center panel as the digital review surface.",
          })}
        </div>
      </header>

      <div className="qisws-layout">
        <aside className="qisws-sidebar">
          <div className="qisws-card">
            <div className="qisws-card__eyebrow">Section Navigation</div>
            <div className="qisws-card__title">Tracked QIS sections</div>
            <div className="qisws-summary-grid">
              <div className="qisws-summary-tile">
                <strong>{summary.reviewedSections}</strong>
                <span>Sections with comments</span>
              </div>
              <div className="qisws-summary-tile">
                <strong>{summary.openIssues}</strong>
                <span>Open issues</span>
              </div>
            </div>
            <div className="qisws-section-list">
              {REVIEW_SECTION_SCHEMA.map((section) => {
                const qisSection = getSectionById(documents.qis, section.id);
                const qosSection = getSectionById(documents.qos, section.id);
                const review = sectionReviews[section.id] || createEmptyReviewSection();
                return (
                  <button
                    key={section.id}
                    type="button"
                    className={`qisws-section-item${
                      activeSectionId === section.id ? " qisws-section-item--active" : ""
                    }`}
                    onClick={() => setActiveSectionId(section.id)}
                  >
                    <div className="qisws-section-item__head">
                      <span className="qisws-section-item__number">{section.number}</span>
                      <span className="qisws-section-item__count">{review.comments.length}</span>
                    </div>
                    <div className="qisws-section-item__title">{section.navLabel}</div>
                    <div className="qisws-section-item__signals">
                      <span className={`qisws-doc-chip ${qisSection?.found ? "is-found" : "is-missing"}`}>
                        QIS {qisSection?.found ? "found" : "missing"}
                      </span>
                      <span className={`qisws-doc-chip ${qosSection?.found ? "is-found" : "is-muted"}`}>
                        QOS {documents.qos ? (qosSection?.found ? "found" : "missing") : "pending"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="qisws-viewer-panel">
          <div className="qisws-card qisws-card--viewer">
            <div className="qisws-card__eyebrow">Generated digital QIS</div>
            <div className="qisws-viewer-head">
              <div>
                <div className="qisws-card__title">
                  {REVIEW_SECTION_SCHEMA.find((section) => section.id === activeSectionId)?.number} {" "}
                  {REVIEW_SECTION_SCHEMA.find((section) => section.id === activeSectionId)?.title}
                </div>
                <div className="qisws-viewer-meta">
                  {selectedQisSection?.found ? (
                    <>
                      <span>{selectedQisSection.wordCount} words</span>
                      <span>{selectedQisSection.tableCount} table{selectedQisSection.tableCount === 1 ? "" : "s"}</span>
                    </>
                  ) : (
                    <span>Awaiting extracted QIS content</span>
                  )}
                </div>
              </div>
            </div>

            {!documents.qis ? (
              <div className="qisws-empty-state">
                Upload a QIS `.docx` file to generate its section-by-section digital view.
              </div>
            ) : selectedQisSection?.found ? (
              <div className="qisws-generated-section" dangerouslySetInnerHTML={{ __html: selectedQisSection.html }} />
            ) : (
              <div className="qisws-empty-state">
                This tracked section was not located in the uploaded QIS document.
              </div>
            )}
          </div>
        </main>

        <aside className="qisws-review-panel">
          <div className="qisws-card">
            <div className="qisws-card__eyebrow">Validation and comments</div>
            <div className="qisws-card__title">Section review</div>
            <p className="qisws-card__body">
              Use the QOS reference field to point every finding back to the main uploaded document.
            </p>

            <label className="qisws-field">
              <span>Section review status</span>
              <select
                value={selectedReview.status}
                onChange={(event) => updateSectionStatus(activeSectionId, event.target.value)}
              >
                {REVIEW_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="qisws-divider" />

            <div className="qisws-findings-head">
              <strong>Auto findings</strong>
              <span>{selectedFindings.length}</span>
            </div>
            {selectedFindings.length === 0 ? (
              <div className="qisws-empty-note">No automatic issues detected for this section.</div>
            ) : (
              <div className="qisws-finding-list">
                {selectedFindings.map((finding) => (
                  <div key={finding.code} className={`qisws-finding qisws-finding--${finding.severity}`}>
                    <div className="qisws-finding__severity">{finding.severity}</div>
                    <div className="qisws-finding__message">{finding.message}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="qisws-divider" />

            <div className="qisws-findings-head">
              <strong>QOS reference</strong>
              <span>{selectedQosSection?.found ? "available" : documents.qos ? "missing" : "pending"}</span>
            </div>
            {selectedQosSection?.found ? (
              <div className="qisws-qos-preview">
                <div className="qisws-qos-preview__meta">
                  {selectedQosSection.wordCount} words · {selectedQosSection.tableCount} table{selectedQosSection.tableCount === 1 ? "" : "s"}
                </div>
                <p>{selectedQosSection.preview || "No preview extracted."}</p>
              </div>
            ) : (
              <div className="qisws-empty-note">
                Upload the QOS or switch sections to view corresponding QOS evidence.
              </div>
            )}

            <div className="qisws-divider" />

            <div className="qisws-findings-head">
              <strong>Reviewer comments</strong>
              <span>{selectedReview.comments.length}</span>
            </div>
            {selectedReview.comments.length === 0 ? (
              <div className="qisws-empty-note">No comments added for this section yet.</div>
            ) : (
              <div className="qisws-comment-list">
                {selectedReview.comments.map((comment) => (
                  <article key={comment.id} className="qisws-comment">
                    <div className="qisws-comment__head">
                      <span className={`qisws-severity-badge qisws-severity-badge--${comment.severity}`}>
                        {REVIEW_SEVERITIES.find((item) => item.value === comment.severity)?.label || comment.severity}
                      </span>
                      <span className="qisws-comment__type">
                        {REVIEW_TYPES.find((item) => item.value === comment.type)?.label || comment.type}
                      </span>
                    </div>
                    <div className="qisws-comment__status">Status: {comment.status.replace(/-/g, " ")}</div>
                    {comment.qosReference && (
                      <div className="qisws-comment__ref">QOS ref: {comment.qosReference}</div>
                    )}
                    <p>{comment.comment}</p>
                    {comment.suggestedCorrection && (
                      <div className="qisws-comment__suggestion">
                        Suggested correction: {comment.suggestedCorrection}
                      </div>
                    )}
                    <div className="qisws-comment__foot">
                      <span>{new Date(comment.createdAt).toLocaleString()}</span>
                      <button type="button" onClick={() => removeComment(comment.id)}>
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="qisws-divider" />

            <div className="qisws-form-title">Add section comment</div>
            <label className="qisws-field">
              <span>Review type</span>
              <select
                value={selectedDraft.type}
                onChange={(event) => updateDraft(activeSectionId, "type", event.target.value)}
              >
                {REVIEW_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="qisws-field-row">
              <label className="qisws-field">
                <span>Severity</span>
                <select
                  value={selectedDraft.severity}
                  onChange={(event) => updateDraft(activeSectionId, "severity", event.target.value)}
                >
                  {REVIEW_SEVERITIES.map((severity) => (
                    <option key={severity.value} value={severity.value}>
                      {severity.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="qisws-field">
                <span>Comment status</span>
                <select
                  value={selectedDraft.status}
                  onChange={(event) => updateDraft(activeSectionId, "status", event.target.value)}
                >
                  <option value="open">Open</option>
                  <option value="needs-update">Needs update</option>
                  <option value="accepted">Accepted</option>
                  <option value="resolved">Resolved</option>
                </select>
              </label>
            </div>
            <label className="qisws-field">
              <span>QOS section / evidence reference</span>
              <input
                type="text"
                value={selectedDraft.qosReference}
                onChange={(event) => updateDraft(activeSectionId, "qosReference", event.target.value)}
                placeholder="e.g. QOS 2.3.P.5.1 assay table"
              />
            </label>
            <label className="qisws-field">
              <span>Reviewer comment</span>
              <textarea
                rows={5}
                value={selectedDraft.comment}
                onChange={(event) => updateDraft(activeSectionId, "comment", event.target.value)}
                placeholder="Record the completeness, appropriateness or QIS-vs-QOS issue."
              />
            </label>
            <label className="qisws-field">
              <span>Suggested correction</span>
              <textarea
                rows={3}
                value={selectedDraft.suggestedCorrection}
                onChange={(event) => updateDraft(activeSectionId, "suggestedCorrection", event.target.value)}
                placeholder="Optional correction for the sponsor or reviewer."
              />
            </label>
            <button type="button" className="qisws-primary-button" onClick={saveComment}>
              Save comment
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default QISReviewWorkspace;
