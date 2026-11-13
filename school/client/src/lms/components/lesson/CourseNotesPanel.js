import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/api';
import CodeExecutionService from '../../../services/codeExecutionService';
import WhiteboardCanvas from '../../../components/WhiteboardCanvas';
import './CourseNotesPanel.css';

// ─── Debounce hook ────────────────────────────────────────────────────────────

function useDebounce(fn, delay) {
  const timer = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

// ─── Notes Tab ────────────────────────────────────────────────────────────────

function NotesTab({ courseSlug, user }) {
  const [content, setContent] = useState('');
  const [syncStatus, setSyncStatus] = useState('idle'); // idle | saving | saved | error
  const [loaded, setLoaded] = useState(false);
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef(null);

  // Load on mount
  useEffect(() => {
    if (!user || !courseSlug) {
      const local = localStorage.getItem(`notes-${courseSlug}`) || '';
      setContent(local);
      setLoaded(true);
      return;
    }

    studentService.getCourseNote(courseSlug)
      .then(note => {
        const remote = note?.content || '';
        const local = localStorage.getItem(`notes-${courseSlug}`) || '';
        // Prefer remote if it exists, otherwise local
        const resolved = remote || local;
        setContent(resolved);
        localStorage.setItem(`notes-${courseSlug}`, resolved);
      })
      .catch(() => {
        setContent(localStorage.getItem(`notes-${courseSlug}`) || '');
      })
      .finally(() => setLoaded(true));
  }, [courseSlug, user]);

  const saveRemote = useCallback(async (text) => {
    if (!user) return;
    setSyncStatus('saving');
    try {
      await studentService.saveCourseNote(courseSlug, text);
      setSyncStatus('saved');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch {
      setSyncStatus('error');
    }
  }, [courseSlug, user]);

  const debouncedSave = useDebounce(saveRemote, 1200);

  const handleChange = (e) => {
    const text = e.target.value;
    setContent(text);
    localStorage.setItem(`notes-${courseSlug}`, text);
    setSyncStatus('saving');
    debouncedSave(text);
  };

  // Toolbar actions
  const insert = (before, after = '') => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.slice(start, end);
    const next = content.slice(0, start) + before + selected + after + content.slice(end);
    setContent(next);
    localStorage.setItem(`notes-${courseSlug}`, next);
    debouncedSave(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = start + before.length;
      el.selectionEnd = start + before.length + selected.length;
    });
  };

  const insertLine = (prefix) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const lineStart = content.lastIndexOf('\n', start - 1) + 1;
    const next = content.slice(0, lineStart) + prefix + content.slice(lineStart);
    setContent(next);
    localStorage.setItem(`notes-${courseSlug}`, next);
    debouncedSave(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + prefix.length;
    });
  };

  const renderMarkdown = (text) => {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^```[\s\S]*?```$/gm, (m) => {
        const code = m.replace(/^```\w*\n?/, '').replace(/```$/, '');
        return `<pre><code>${code}</code></pre>`;
      })
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[hupola])(.+)$/gm, '<p>$1</p>');
  };

  const syncLabel = {
    idle: user ? '● Synced' : '● Local only',
    saving: '○ Saving…',
    saved: '● Saved',
    error: '⚠ Sync error',
  }[syncStatus];

  const syncClass = {
    idle: 'notes-sync--idle',
    saving: 'notes-sync--saving',
    saved: 'notes-sync--saved',
    error: 'notes-sync--error',
  }[syncStatus];

  if (!loaded) {
    return <div className="notes-loading"><div className="spinner" /></div>;
  }

  return (
    <div className="notes-tab">
      <div className="notes-toolbar">
        <div className="notes-toolbar__fmt">
          <button title="Heading" onClick={() => insertLine('## ')}>H</button>
          <button title="Bold" onClick={() => insert('**', '**')}><strong>B</strong></button>
          <button title="Italic" onClick={() => insert('*', '*')}><em>I</em></button>
          <button title="Inline code" onClick={() => insert('`', '`')}>{'<>'}</button>
          <button title="Code block" onClick={() => insert('```\n', '\n```')}>{'{ }'}</button>
          <button title="Bullet list" onClick={() => insertLine('- ')}>•</button>
          <button title="Numbered list" onClick={() => insertLine('1. ')}>1.</button>
          <button title="Link" onClick={() => insert('[', '](url)')}>🔗</button>
        </div>
        <div className="notes-toolbar__right">
          <span className={`notes-sync ${syncClass}`}>{syncLabel}</span>
          <button
            className={`notes-preview-btn ${preview ? 'active' : ''}`}
            onClick={() => setPreview(p => !p)}
            title={preview ? 'Edit' : 'Preview'}
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {preview ? (
        <div
          className="notes-preview"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) || '<p class="notes-preview__empty">Nothing to preview yet.</p>' }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          className="notes-editor"
          value={content}
          onChange={handleChange}
          placeholder={`Write your notes for this course here.\n\nSupports markdown:\n# Heading\n**bold** *italic* \`code\`\n- bullet list\n\`\`\`\ncode block\n\`\`\``}
          spellCheck={false}
          onKeyDown={(e) => {
            if (e.key === 'Tab') {
              e.preventDefault();
              const s = e.target.selectionStart;
              const next = content.slice(0, s) + '  ' + content.slice(e.target.selectionEnd);
              setContent(next);
              localStorage.setItem(`notes-${courseSlug}`, next);
              debouncedSave(next);
              requestAnimationFrame(() => {
                e.target.selectionStart = e.target.selectionEnd = s + 2;
              });
            }
          }}
        />
      )}
    </div>
  );
}

// ─── Scratchpad Tab ───────────────────────────────────────────────────────────

const ALL_LANGUAGES = [
  'javascript', 'python', 'nodejs', 'sql', 'java', 'cpp', 'php', 'ruby', 'django',
];

function ScratchpadTab({ courseSlug }) {
  const storageKey = `scratch-${courseSlug}`;
  const langKey = `scratch-lang-${courseSlug}`;

  const [code, setCode] = useState(() => localStorage.getItem(storageKey) || '');
  const [language, setLanguage] = useState(() => localStorage.getItem(langKey) || courseSlug || 'javascript');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState([]); // [{code, output, ts}]
  const [showHistory, setShowHistory] = useState(false);
  const editorRef = useRef(null);

  const run = useCallback(async () => {
    if (!code.trim() || running) return;
    setRunning(true);
    setOutput('Running…');
    const result = await CodeExecutionService.execute(code, language);
    const out = result.output || result.stdout || result.stderr || 'No output.';
    setOutput(out);
    setRunning(false);
    setHistory(prev => [
      { code, language, output: out, ts: new Date().toLocaleTimeString() },
      ...prev.slice(0, 9),
    ]);
  }, [code, language, running]);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    localStorage.setItem(storageKey, e.target.value);
  };

  const handleLangChange = (e) => {
    setLanguage(e.target.value);
    localStorage.setItem(langKey, e.target.value);
  };

  const isError = output.toLowerCase().startsWith('error') || output.toLowerCase().includes('traceback');

  return (
    <div className="scratchpad-tab">
      <div className="scratchpad-header">
        <select className="scratchpad-lang" value={language} onChange={handleLangChange}>
          {ALL_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <div className="scratchpad-header__right">
          <button
            className="scratchpad-history-btn"
            onClick={() => setShowHistory(h => !h)}
            title="Run history"
          >
            History ({history.length})
          </button>
          <button
            className="scratchpad-run-btn"
            onClick={run}
            disabled={running || !code.trim()}
          >
            {running
              ? <><span className="scratchpad-spinner" /> Running…</>
              : <><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg> Run</>
            }
          </button>
        </div>
      </div>

      <div className="scratchpad-body">
        <textarea
          ref={editorRef}
          className="scratchpad-editor"
          value={code}
          onChange={handleCodeChange}
          placeholder={`Write ${language} code here…\nCtrl+Enter to run`}
          spellCheck={false}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); run(); }
            if (e.key === 'Tab') {
              e.preventDefault();
              const s = e.target.selectionStart;
              const next = code.slice(0, s) + '  ' + code.slice(e.target.selectionEnd);
              setCode(next);
              localStorage.setItem(storageKey, next);
              requestAnimationFrame(() => { e.target.selectionStart = e.target.selectionEnd = s + 2; });
            }
          }}
        />

        {output && (
          <div className={`scratchpad-output ${isError ? 'scratchpad-output--error' : ''}`}>
            <div className="scratchpad-output__header">
              <span>{isError ? 'Error' : 'Output'}</span>
              <button onClick={() => setOutput('')}>✕</button>
            </div>
            <pre className="scratchpad-output__body">{output}</pre>
          </div>
        )}
      </div>

      {showHistory && history.length > 0 && (
        <div className="scratchpad-history">
          <div className="scratchpad-history__header">
            <span>Run History</span>
            <button onClick={() => setShowHistory(false)}>✕</button>
          </div>
          {history.map((entry, i) => (
            <div key={i} className="scratchpad-history__entry">
              <div className="scratchpad-history__meta">
                <span>{entry.language}</span>
                <span>{entry.ts}</span>
                <button onClick={() => { setCode(entry.code); setLanguage(entry.language); setShowHistory(false); }}>
                  Restore
                </button>
              </div>
              <pre className="scratchpad-history__code">{entry.code.slice(0, 120)}{entry.code.length > 120 ? '…' : ''}</pre>
              <pre className="scratchpad-history__output">{entry.output.slice(0, 80)}{entry.output.length > 80 ? '…' : ''}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Draw Tab ─────────────────────────────────────────────────────────────────

function DrawTab({ courseSlug, user }) {
  // Use a stable course-scoped storage key — never changes between lessons
  const storageKey = `wb-course-${user?.id || 'guest'}-${courseSlug}`;

  return (
    <div className="draw-tab">
      <WhiteboardCanvas
        storageKey={storageKey}
        courseId={courseSlug}
        slideIndex={1}
        lessonId=""
        userId={user?.id || ''}
      />
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'notes', label: 'Notes', icon: '📝' },
  { id: 'scratch', label: 'Scratchpad', icon: '⚡' },
  { id: 'draw', label: 'Draw', icon: '✏️' },
];

export default function CourseNotesPanel({ courseSlug, onClose }) {
  const { user } = useAuth();
  const [tab, setTab] = useState('notes');

  return (
    <div className="notes-panel">
      <div className="notes-panel__header">
        <div className="notes-panel__tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`notes-panel__tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span className="notes-panel__tab-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
        <button className="notes-panel__close" onClick={onClose} aria-label="Close notes">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div className="notes-panel__body">
        {tab === 'notes' && <NotesTab courseSlug={courseSlug} user={user} />}
        {tab === 'scratch' && <ScratchpadTab courseSlug={courseSlug} />}
        {tab === 'draw' && <DrawTab courseSlug={courseSlug} user={user} />}
      </div>
    </div>
  );
}
