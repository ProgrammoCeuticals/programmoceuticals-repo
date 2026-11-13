import React, { useState, useCallback } from 'react';
import CodeExecutionService from '../../../services/codeExecutionService';
import MermaidDiagram from './MermaidDiagram';
import './LessonArticle.css';

// ─── Inline markdown renderer ─────────────────────────────────────────────────
// Handles: **bold**, *italic*, `code`, [link](url)

function renderInline(text) {
  if (!text) return null;
  const parts = [];
  let remaining = String(text);
  let key = 0;

  const patterns = [
    { re: /\*\*(.+?)\*\*/,  render: (m) => <strong key={key++}>{m[1]}</strong> },
    { re: /\*(.+?)\*/,      render: (m) => <em key={key++}>{m[1]}</em> },
    { re: /`([^`]+)`/,      render: (m) => <code key={key++} className="la-inline-code">{m[1]}</code> },
    { re: /\[(.+?)\]\((.+?)\)/, render: (m) => <a key={key++} href={m[2]} target="_blank" rel="noopener noreferrer">{m[1]}</a> },
  ];

  while (remaining.length > 0) {
    let earliest = null;
    let earliestIndex = Infinity;
    let earliestPattern = null;

    for (const p of patterns) {
      const match = p.re.exec(remaining);
      if (match && match.index < earliestIndex) {
        earliest = match;
        earliestIndex = match.index;
        earliestPattern = p;
      }
    }

    if (!earliest) {
      parts.push(remaining);
      break;
    }

    if (earliestIndex > 0) {
      parts.push(remaining.slice(0, earliestIndex));
    }
    parts.push(earliestPattern.render(earliest));
    remaining = remaining.slice(earliestIndex + earliest[0].length);
  }

  return parts;
}

// ─── Body parser ──────────────────────────────────────────────────────────────
// Converts body string into React elements
// Supports: # ## ### headings, - bullets, 1. numbered, blank line = paragraph break

function parseBody(body) {
  if (!body) return null;
  const lines = body.split('\n');
  const elements = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) { i++; continue; }

    // H3
    if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} className="la-h3">{renderInline(line.slice(4))}</h3>);
      i++; continue;
    }

    // H2
    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className="la-h2">{renderInline(line.slice(3))}</h2>);
      i++; continue;
    }

    // H1
    if (line.startsWith('# ')) {
      elements.push(<h1 key={key++} className="la-h1">{renderInline(line.slice(2))}</h1>);
      i++; continue;
    }

    // Unordered list
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(<li key={i}>{renderInline(lines[i].slice(2))}</li>);
        i++;
      }
      elements.push(<ul key={key++} className="la-ul">{items}</ul>);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(<li key={i}>{renderInline(lines[i].replace(/^\d+\.\s/, ''))}</li>);
        i++;
      }
      elements.push(<ol key={key++} className="la-ol">{items}</ol>);
      continue;
    }

    // Paragraph — collect consecutive non-special lines
    const paraLines = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('- ') &&
      !lines[i].startsWith('* ') &&
      !/^\d+\.\s/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      elements.push(
        <p key={key++} className="la-p">
          {renderInline(paraLines.join(' '))}
        </p>
      );
    }
  }

  return elements;
}

// ─── Callout ──────────────────────────────────────────────────────────────────

const CALLOUT_ICONS = {
  tip:     '💡',
  warning: '⚠️',
  note:    'ℹ️',
  error:   '❌',
  success: '✅',
};

function Callout({ type = 'note', text }) {
  if (!text) return null;
  return (
    <div className={`la-callout la-callout--${type}`}>
      <span className="la-callout__icon">{CALLOUT_ICONS[type] || 'ℹ️'}</span>
      <div className="la-callout__body">{renderInline(text)}</div>
    </div>
  );
}

// ─── Inline code runner ───────────────────────────────────────────────────────

function ArticleCodeBlock({ code, language, runnable = true }) {
  const [userCode, setUserCode] = useState(code || '');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const run = useCallback(async () => {
    if (!userCode.trim() || running) return;
    setRunning(true);
    setOutput('Running…');
    const result = await CodeExecutionService.execute(userCode, language || 'python');
    setOutput(result.output || result.stdout || result.stderr || 'No output.');
    setRunning(false);
    setHasRun(true);
  }, [userCode, language, running]);

  const isPreview = language === 'html' || language === 'css';
  const isError = output.toLowerCase().startsWith('error') || output.includes('Traceback');

  return (
    <div className="la-code-block">
      <div className="la-code-header">
        <div className="la-code-dots">
          <span /><span /><span />
        </div>
        <span className="la-code-lang">{language || 'python'}</span>
        <div className="la-code-actions">
          {runnable && (
            <button
              className="la-code-edit-btn"
              onClick={() => setIsEditing(e => !e)}
              title={isEditing ? 'View mode' : 'Edit code'}
            >
              {isEditing ? 'View' : 'Edit'}
            </button>
          )}
          {runnable && (
            <button
              className="la-code-run-btn"
              onClick={run}
              disabled={running || !userCode.trim()}
            >
              {running
                ? <><span className="la-code-spinner" /> Running…</>
                : <><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg> Run</>
              }
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <textarea
          className="la-code-editor"
          value={userCode}
          onChange={e => setUserCode(e.target.value)}
          spellCheck={false}
          onKeyDown={e => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); run(); }
            if (e.key === 'Tab') {
              e.preventDefault();
              const s = e.target.selectionStart;
              const next = userCode.slice(0, s) + '  ' + userCode.slice(e.target.selectionEnd);
              setUserCode(next);
              requestAnimationFrame(() => { e.target.selectionStart = e.target.selectionEnd = s + 2; });
            }
          }}
        />
      ) : (
        <pre className="la-code-pre"><code>{userCode}</code></pre>
      )}

      {hasRun && (
        isPreview ? (
          <div className="la-code-preview-wrap">
            <div className="la-code-output-label">Preview</div>
            <iframe
              className="la-code-preview"
              title="preview"
              sandbox="allow-scripts"
              srcDoc={language === 'css'
                ? `<style>${output}</style><div style="padding:16px;font-family:sans-serif">CSS applied</div>`
                : output
              }
            />
          </div>
        ) : (
          <div className={`la-code-output ${isError ? 'la-code-output--error' : ''}`}>
            <div className="la-code-output-label">{isError ? 'Error' : 'Output'}</div>
            <pre className="la-code-output-body">{output}</pre>
          </div>
        )
      )}
    </div>
  );
}

// ─── Key points ───────────────────────────────────────────────────────────────

function KeyPoints({ points }) {
  if (!points?.length) return null;
  return (
    <div className="la-keypoints">
      <div className="la-keypoints__header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Key Points
      </div>
      <ul className="la-keypoints__list">
        {points.map((p, i) => (
          <li key={i}>{renderInline(p)}</li>
        ))}
      </ul>
    </div>
  );
}

// ─── Try it prompt ────────────────────────────────────────────────────────────

function TryIt({ prompt }) {
  if (!prompt) return null;
  return (
    <div className="la-tryit">
      <span className="la-tryit__icon">🧪</span>
      <div className="la-tryit__body">
        <strong>Try it yourself</strong>
        <p>{prompt}</p>
      </div>
    </div>
  );
}

// ─── Main LessonArticle component ─────────────────────────────────────────────

export default function LessonArticle({ lesson, courseSlug }) {
  const raw = lesson.content || {};
  const content = raw.content && typeof raw.content === 'object' ? raw.content : raw;

  const {
    body,
    code,
    language,
    runnable,
    callout,
    callouts,
    keyPoints,
    tryIt,
    diagram,
    diagramCaption,
    sections,
  } = content;

  const lang = language || courseSlug || 'python';

  return (
    <article className="la">
      {/* Title */}
      <h1 className="la-title">{lesson.title}</h1>

      {/* Single diagram at top if provided */}
      {diagram && (
        <MermaidDiagram
          chart={diagram}
          caption={diagramCaption}
          theme={courseSlug}
        />
      )}

      {/* Body text */}
      {body && (
        <div className="la-body">
          {parseBody(body)}
        </div>
      )}

      {/* Multiple sections (for complex lessons) */}
      {sections?.map((section, i) => (
        <div key={i} className="la-section">
          {section.heading && <h2 className="la-h2">{section.heading}</h2>}
          {section.body && <div className="la-body">{parseBody(section.body)}</div>}
          {section.diagram && (
            <MermaidDiagram
              chart={section.diagram}
              caption={section.diagramCaption}
              theme={courseSlug}
            />
          )}
          {section.code && (
            <ArticleCodeBlock
              code={section.code}
              language={section.language || lang}
              runnable={section.runnable !== false}
            />
          )}
          {section.callout && (
            <Callout type={section.callout.type} text={section.callout.text} />
          )}
        </div>
      ))}

      {/* Primary code block */}
      {code && (
        <ArticleCodeBlock
          code={code}
          language={lang}
          runnable={runnable !== false}
        />
      )}

      {/* Single callout */}
      {callout && <Callout type={callout.type} text={callout.text} />}

      {/* Multiple callouts */}
      {callouts?.map((c, i) => (
        <Callout key={i} type={c.type} text={c.text} />
      ))}

      {/* Key points */}
      <KeyPoints points={keyPoints} />

      {/* Try it */}
      <TryIt prompt={tryIt} />
    </article>
  );
}
