import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  parseInput,
  runRegulatoryCheck,
} from "../services/regulatoryEngine.js";
import { getSuggestions } from "../services/autocomplete.js";
import {
  loadAutoTableLibrary,
  loadJSPDFLibrary,
} from "../utils/lazyImports.js";
import sources from "../data/regulatory/sources.json";
import ntiReference from "../data/regulatory/nti-reference.json";
import "./ProductChecker.css";

const SEGMENT_SPLIT_RE = /[,+\/]/;

const LIST_TAG_META = {
  ceiling: { label: "Ceiling", cls: "pc-stag--ceiling" },
  prohibition: { label: "Prohibition", cls: "pc-stag--prohibition" },
  fiveplusfive: { label: "5+5", cls: "pc-stag--fiveplusfive" },
  nti: { label: "NTI", cls: "pc-stag--nti" },
};

const VERDICT_LABELS = {
  clear: "CLEAR",
  review: "REVIEW",
  restricted: "RESTRICTED",
  prohibited: "PROHIBITED",
  verification_required: "VERIFY",
};

function tierBadge(tier, isAuth) {
  if (tier === "source_conflict")
    return { label: "Source Conflict", cls: "pc-tier--conflict" };
  if (tier === "possible_fuzzy_match")
    return { label: "Possible Match", cls: "pc-tier--fuzzy" };
  if (!isAuth) return { label: "Verify", cls: "pc-tier--verify" };
  return { label: "Match", cls: "pc-tier--authoritative" };
}

function listChipLevel(matches) {
  if (!matches.length) return "clear";
  if (matches.some((m) => m.verificationStatus === "source_conflict"))
    return "conflict";
  if (matches.some((m) => m.isAuthoritative)) return "found";
  if (matches.some((m) => m.verificationStatus === "verification_required"))
    return "verify";
  return "review";
}

// ── ResultItem ────────────────────────────────────────────────────────────────
function ResultItem({ match }) {
  const [expanded, setExpanded] = useState(false);
  const { entry, source, tier, matchedBy, isAuthoritative: isAuth, verificationStatus } = match;
  const badge = tierBadge(tier, isAuth);
  const hasDetails = entry.strength || entry.dosageForm || entry.exclusions || entry.hsCode || entry.notes;

  return (
    <li className="pc-result-item">
      <div className="pc-result-top">
        <p className="pc-result-name">{entry.subjectName}</p>
        <div className="pc-result-badges">
          <span className={`pc-tier ${badge.cls}`}>{badge.label}</span>
          {hasDetails && (
            <button type="button" className="pc-expand-btn" onClick={() => setExpanded((v) => !v)}>
              {expanded ? "Less" : "Details"}
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="pc-result-details">
          {entry.strength && <p className="pc-result-row"><strong>Strength:</strong> {entry.strength}</p>}
          {entry.dosageForm && <p className="pc-result-row"><strong>Dosage form:</strong> {entry.dosageForm}</p>}
          {entry.exclusions && <p className="pc-result-row"><strong>Exclusions:</strong> {entry.exclusions}</p>}
          {entry.hsCode && <p className="pc-result-row"><strong>HS Code:</strong> {entry.hsCode}</p>}
          {entry.notes && <p className="pc-result-row"><strong>Notes:</strong> {entry.notes}</p>}
          <p className="pc-result-row">
            <strong>Matched by:</strong>{" "}
            {matchedBy.map((m) => `${m.ingredient} (${m.tier})`).join(", ")}
          </p>
          {verificationStatus === "source_conflict" && (
            <div className="pc-conflict-banner">
              Source conflict — verification required. Do not treat as authoritative.
            </div>
          )}
          {verificationStatus === "verification_required" && (
            <div className="pc-conflict-banner pc-conflict-banner--nti">
              NTI reference — identified by FDA/EMA/WHO/USP. Advisory only: requires close
              therapeutic monitoring. Does not constitute an import prohibition.
            </div>
          )}
          {source && (
            <div className="pc-provenance">
              <strong>Authority:</strong> {source.authority} &nbsp;·&nbsp;
              <strong>Source:</strong> {source.title}
              {source.effectiveDate && <> &nbsp;·&nbsp; <strong>Effective:</strong> {source.effectiveDate}</>}
              {source.url && (
                <> &nbsp;·&nbsp; <a href={source.url} target="_blank" rel="noopener noreferrer">View source ↗</a></>
              )}
            </div>
          )}
        </div>
      )}
    </li>
  );
}

// ── DirectiveItem ─────────────────────────────────────────────────────────────
function DirectiveItem({ match }) {
  const [expanded, setExpanded] = useState(false);
  const { entity, directive, source, tier, matchedBy, isAuthoritative: isAuth, note } = match;
  const badge = tierBadge(tier, isAuth);

  return (
    <li className="pc-result-item">
      <div className="pc-result-top">
        <p className="pc-result-name">{entity.subjectName}</p>
        <div className="pc-result-badges">
          <span className={`pc-tier ${badge.cls}`}>{badge.label}</span>
          <button type="button" className="pc-expand-btn" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Less" : "Details"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="pc-result-details">
          {directive && (
            <>
              <p className="pc-result-row"><strong>Directive:</strong> {directive.title}</p>
              {directive.documentRef && <p className="pc-result-row"><strong>Ref:</strong> {directive.documentRef}</p>}
              <p className="pc-result-row"><strong>Action:</strong> {directive.action}</p>
              {directive.effectiveDate && <p className="pc-result-row"><strong>Effective:</strong> {directive.effectiveDate}</p>}
              {directive.reviewDate && <p className="pc-result-row"><strong>Review due:</strong> {directive.reviewDate}</p>}
            </>
          )}
          {entity.strength && <p className="pc-result-row"><strong>Strength:</strong> {entity.strength}</p>}
          {entity.dosageForm && <p className="pc-result-row"><strong>Dosage form:</strong> {entity.dosageForm}</p>}
          <p className="pc-result-row">
            <strong>Matched by:</strong>{" "}
            {matchedBy.map((m) => `${m.ingredient} (${m.tier})`).join(", ")}
          </p>
          {note && <div className="pc-conflict-banner pc-conflict-banner--nti">{note}</div>}
          {source && (
            <div className="pc-provenance">
              <strong>Authority:</strong> {source.authority}
              {source.url && (
                <> &nbsp;·&nbsp; <a href={source.url} target="_blank" rel="noopener noreferrer">View directive ↗</a></>
              )}
            </div>
          )}
        </div>
      )}
    </li>
  );
}

// ── ExplorerPanel ─────────────────────────────────────────────────────────────
function ExplorerPanel({ activeTab, results, onNtiPdf }) {
  if (!results) return null;

  const tabs = [
    { id: "ceiling", label: "Ceiling List", data: results.restrictions.ceiling, isDirective: false },
    { id: "prohibition", label: "Import Prohibition", data: results.restrictions.importProhibition, isDirective: false },
    { id: "fiveplusfive", label: "5+5 Policy", data: results.restrictions.fivePlusFive, isDirective: false },
    { id: "nti", label: "NTI", data: results.restrictions.nti, isDirective: false },
    { id: "directives", label: "Directives", data: { matches: results.directives }, isDirective: true },
  ];

  const tab = tabs.find((t) => t.id === activeTab) || tabs[0];
  const matches = tab.data?.matches ?? [];
  const source = tab.data?.source;

  return (
    <div className="pc-explorer-panel">
      <div className="pc-panel-head">
        <h4 className="pc-panel-title">{tab.label}</h4>
        {source && <span className="pc-chip pc-chip--verify" style={{ fontSize: 10 }}>{source.authority}</span>}
      </div>

      {matches.length === 0 && <p className="pc-empty">No matching entries found in this list.</p>}

      {matches.length > 0 && (
        <>
          <p className="pc-panel-meta"><strong>{matches.length}</strong> match{matches.length === 1 ? "" : "es"} found</p>
          <ol className="pc-result-list">
            {matches.map((match) =>
              tab.isDirective
                ? <DirectiveItem key={match.entity.id} match={match} />
                : <ResultItem key={match.entry.id} match={match} />
            )}
          </ol>
        </>
      )}

      {tab.id === "nti" ? (
        <div style={{ marginTop: matches.length ? 12 : 0 }}>
          <p style={{ margin: "0 0 8px", fontSize: 12, color: "#4a5568", lineHeight: 1.5 }}>
            NTI drugs are identified by <strong>FDA, EMA, WHO and USP</strong> based on a narrow
            margin between therapeutic and toxic doses — this is <strong>not a NAFDAC list</strong>.
            Advisory only.
          </p>
          <button type="button" onClick={onNtiPdf} className="pc-link-btn">
            Download NTI Reference List (PDF)
          </button>
        </div>
      ) : source?.url ? (
        <a href={source.url} target="_blank" rel="noopener noreferrer" className="pc-link-btn">
          View Official Source ↗
        </a>
      ) : null}
    </div>
  );
}

// ── DataFooter ────────────────────────────────────────────────────────────────
function DataFooter() {
  const activeSources = sources.filter((s) => s.status === "active" && s.url);
  return (
    <footer className="pc-footer">
      <p className="pc-footer-title">Data Sources &amp; Verification Status</p>
      <div className="pc-footer-grid">
        {activeSources.map((s) => (
          <div key={s.id} className="pc-footer-source">
            <strong>{s.authority}</strong> — {s.title}
            {s.verifiedAt && <> · Verified {s.verifiedAt}</>}
            {s.url && <> · <a href={s.url} target="_blank" rel="noopener noreferrer">Source ↗</a></>}
          </div>
        ))}
      </div>
    </footer>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const ProductChecker = () => {
  const [genericInput, setGenericInput] = useState("");
  const [results, setResults] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [activeTab, setActiveTab] = useState("ceiling");
  const [isNtiModalOpen, setIsNtiModalOpen] = useState(false);
  const [ntiPdfUrl, setNtiPdfUrl] = useState("");
  const [isNtiPdfLoading, setIsNtiPdfLoading] = useState(false);
  const [ntiPdfError, setNtiPdfError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const explorerRef = useRef(null);
  const panelRef = useRef(null);
  const debounceRef = useRef(null);
  const inputWrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (inputWrapRef.current && !inputWrapRef.current.contains(e.target))
        setShowSuggestions(false);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, []);

  useEffect(() => {
    if (!isNtiModalOpen) return;
    const handler = (e) => { if (e.key === "Escape") setIsNtiModalOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isNtiModalOpen]);

  useEffect(() => () => { if (ntiPdfUrl) URL.revokeObjectURL(ntiPdfUrl); }, [ntiPdfUrl]);

  const getActiveSegment = (value) => {
    const parts = value.split(SEGMENT_SPLIT_RE);
    return parts[parts.length - 1].trim();
  };

  const replaceActiveSegment = (value, replacement) => {
    const match = value.match(/^([\s\S]*[,+\/]\s*)([^,+\/]*)$/);
    return match ? match[1] + replacement : replacement;
  };

  const onInputChange = (e) => {
    const value = e.target.value;
    setGenericInput(value);
    if (validationError) setValidationError("");
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const seg = getActiveSegment(value);
      const s = await getSuggestions(seg);
      setSuggestions(s);
      setActiveSuggestion(-1);
      setShowSuggestions(s.length > 0);
    }, 300);
  };

  const applySuggestion = (s) => {
    setGenericInput(replaceActiveSegment(genericInput, s.display));
    setShowSuggestions(false);
    setSuggestions([]);
    setActiveSuggestion(-1);
  };

  const checkProduct = useCallback(async () => {
    const parsed = parseInput(genericInput);
    if (!parsed.valid) {
      setValidationError(parsed.error);
      setResults(null);
      return;
    }
    setValidationError("");
    setIsChecking(true);
    try {
      await new Promise((r) => setTimeout(r, 200));
      const assessment = runRegulatoryCheck(parsed.ingredients);
      setResults(assessment);

      const tabOrder = ["ceiling", "prohibition", "fiveplusfive", "directives", "nti"];
      const firstHit = tabOrder.find((id) => {
        if (id === "directives") return assessment.directives.some((m) => m.isAuthoritative);
        const key = id === "prohibition" ? "importProhibition" : id === "fiveplusfive" ? "fivePlusFive" : id;
        return assessment.restrictions[key]?.matches.some((m) => m.isAuthoritative);
      });
      setActiveTab(firstHit || "ceiling");

      requestAnimationFrame(() => {
        explorerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } finally {
      setIsChecking(false);
    }
  }, [genericInput]);

  const handleKeyDown = (e) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveSuggestion((p) => Math.min(p + 1, suggestions.length - 1)); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); setActiveSuggestion((p) => Math.max(p - 1, 0)); return; }
      if (e.key === "Enter" && activeSuggestion >= 0) { e.preventDefault(); applySuggestion(suggestions[activeSuggestion]); return; }
      if (e.key === "Escape") { setShowSuggestions(false); return; }
    }
    if (e.key === "Enter") { e.preventDefault(); checkProduct(); }
  };

  const selectTab = (id) => {
    setActiveTab(id);
    requestAnimationFrame(() => { if (panelRef.current) panelRef.current.scrollTop = 0; });
  };

  const generateNtiPdf = async () => {
    if (ntiPdfUrl || isNtiPdfLoading) return;
    setIsNtiPdfLoading(true);
    setNtiPdfError("");
    try {
      const [{ default: jsPDF }] = await Promise.all([loadJSPDFLibrary(), loadAutoTableLibrary()]);
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text("Narrow Therapeutic Index (NTI) Drug Reference List", 14, 16);
      doc.setFontSize(9);
      doc.setFont(undefined, "normal");
      doc.text("Source: FDA/EMA/WHO/USP — not an official NAFDAC list. Advisory only.", 14, 23);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 29);
      doc.autoTable({
        startY: 35,
        head: [["#", "Drug Name", "Status"]],
        body: ntiReference.map((e, i) => [i + 1, e.subjectName, e.verificationStatus]),
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [25, 52, 65], textColor: [255, 255, 255], fontStyle: "bold" },
        columnStyles: { 0: { cellWidth: 12, halign: "right" }, 2: { cellWidth: 36 } },
        margin: { left: 14, right: 14 },
      });
      const url = URL.createObjectURL(doc.output("blob"));
      setNtiPdfUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return url; });
    } catch {
      setNtiPdfError("Could not generate PDF. Please try again.");
    } finally {
      setIsNtiPdfLoading(false);
    }
  };

  const openNtiModal = async () => {
    setIsNtiModalOpen(true);
    await generateNtiPdf();
  };

  const navTabs = results
    ? [
        { id: "ceiling", label: "Ceiling List", matches: results.restrictions.ceiling.matches },
        { id: "prohibition", label: "Import Prohibition", matches: results.restrictions.importProhibition.matches },
        { id: "fiveplusfive", label: "5+5 Policy", matches: results.restrictions.fivePlusFive.matches },
        { id: "nti", label: "NTI", matches: results.restrictions.nti.matches },
        { id: "directives", label: "Directives", matches: results.directives },
      ]
    : [];

  return (
    <div className="pc-page">
      <div className="pc-shell">
        {/* Hero */}
        <section className="pc-card pc-hero">
          <div className="pc-hero-brand">
            <img src="/nafdac-logo.webp" alt="NAFDAC" className="pc-hero-logo" />
            <div>
              <p className="pc-eyebrow">NAFDAC Regulatory Intelligence</p>
              <h1 className="pc-title">Product Regulatory Checker</h1>
            </div>
          </div>
          <p className="pc-subtitle">
            Screen generic names against official NAFDAC and NCS regulatory lists.
            Results are source-specific and explainable. Always consult official documents for final decisions.
          </p>
        </section>

        {/* Input */}
        <section className="pc-card pc-input-card">
          <label className="pc-label" htmlFor="pc-generic-input">Generic Name(s)</label>
          <div ref={inputWrapRef} className="pc-input-wrap">
            <input
              id="pc-generic-input"
              type="text"
              placeholder="e.g. ciprofloxacin, paracetamol"
              value={genericInput}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className={`pc-input${validationError ? " is-error" : ""}`}
              autoComplete="off"
              aria-label="Generic name input"
              aria-autocomplete="list"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="pc-suggestions" role="listbox">
                {suggestions.map((s, i) => (
                  <li
                    key={`${s.source}-${s.display}`}
                    role="option"
                    aria-selected={i === activeSuggestion}
                    className={`pc-suggestion-item${i === activeSuggestion ? " is-active" : ""}`}
                    onPointerDown={(e) => { e.preventDefault(); applySuggestion(s); }}
                  >
                    <span className="pc-suggestion-name">{s.display}</span>
                    <span className="pc-suggestion-tags">
                      {s.source === "rxnorm" && <span className="pc-stag pc-stag--rxnorm">RxNorm</span>}
                      {s.lists.map((lid) => (
                        <span key={lid} className={`pc-stag ${LIST_TAG_META[lid]?.cls || ""}`}>
                          {LIST_TAG_META[lid]?.label || lid}
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pc-hint-row">
            <span className="pc-pill">comma-separated</span>
            <span className="pc-pill">generic names only</span>
            <span className="pc-pill">supports combinations</span>
          </div>

          {validationError && <p className="pc-error" role="alert">{validationError}</p>}

          <button
            type="button"
            onClick={checkProduct}
            disabled={!genericInput.trim() || isChecking}
            className="pc-primary-btn"
          >
            {isChecking ? "Checking…" : "Run Regulatory Check"}
          </button>
        </section>

        {/* Results */}
        {results && (
          <>
            {/* Overall verdict — includes meta */}
            <div className={`pc-verdict pc-verdict--${results.overall.level}`} role="status">
              <div className="pc-verdict-meta">
                <span className="pc-verdict-level">{VERDICT_LABELS[results.overall.level] || results.overall.level}</span>
                <span className="pc-verdict-query">{results.productQuery.ingredients.join(", ")}</span>
              </div>
              <p className="pc-verdict-headline">{results.overall.headline}</p>
              {results.overall.reasons.length > 0 && (
                <ul className="pc-verdict-reasons">
                  {results.overall.reasons.map((r) => <li key={r}>{r}</li>)}
                </ul>
              )}
            </div>

            {/* Explorer */}
            <section ref={explorerRef} className="pc-card pc-explorer">
              <div className="pc-explorer-body">
                <aside className="pc-explorer-nav" aria-label="List navigation">
                  {navTabs.map((tab) => {
                    const level = listChipLevel(tab.matches);
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => selectTab(tab.id)}
                        className={`pc-nav-btn${activeTab === tab.id ? " is-active" : ""}`}
                        aria-pressed={activeTab === tab.id}
                      >
                        <span className="pc-nav-title">{tab.label}</span>
                        <span className="pc-nav-meta">
                          {tab.matches.length} match{tab.matches.length === 1 ? "" : "es"} &nbsp;
                          <span className={`pc-chip pc-chip--${level}`} style={{ fontSize: 9 }}>
                            {level === "clear" ? "CLEAR" : level === "found" ? "FOUND" : level === "review" ? "REVIEW" : level === "conflict" ? "CONFLICT" : "VERIFY"}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </aside>
                <div ref={panelRef}>
                  <ExplorerPanel activeTab={activeTab} results={results} onNtiPdf={openNtiModal} />
                </div>
              </div>
            </section>

            {/* Related FDC combinations — below explorer */}
            {results.relatedCombinations?.length > 0 && (
              <div className="pc-related-combos">
                <p className="pc-related-combos__title">
                  <strong>{results.productQuery.ingredients[0]}</strong> also appears in these
                  discontinued FDC combinations — click to search:
                </p>
                <ul className="pc-related-combos__list">
                  {results.relatedCombinations.map((combo) => (
                    <li key={combo} className="pc-related-combos__item">
                      <button
                        type="button"
                        className="pc-related-combos__btn"
                        onClick={() => {
                          const parts = combo
                            .split(/[+,/]/)
                            .map((p) => p.replace(/\(.*?\)/g, "").trim().toLowerCase())
                            .filter(Boolean)
                            .join(", ");
                          setGenericInput(parts);
                        }}
                      >
                        {combo}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* NTI Modal */}
        {isNtiModalOpen && (
          <div className="pc-modal-backdrop" onClick={() => setIsNtiModalOpen(false)} role="dialog" aria-modal="true">
            <div className="pc-modal" onClick={(e) => e.stopPropagation()}>
              <header className="pc-modal-head">
                <h4 className="pc-modal-title">NTI Drug Reference List</h4>
                <button type="button" onClick={() => setIsNtiModalOpen(false)} className="pc-close-btn">Close</button>
              </header>
              <div className="pc-modal-body">
                {isNtiPdfLoading && <p className="pc-empty">Generating PDF…</p>}
                {ntiPdfError && <p className="pc-error">{ntiPdfError}</p>}
                {ntiPdfUrl && !isNtiPdfLoading && (
                  <iframe title="NTI Reference List PDF" src={ntiPdfUrl} className="pc-nti-frame" />
                )}
              </div>
            </div>
          </div>
        )}

        <DataFooter />
      </div>
    </div>
  );
};

export default ProductChecker;
