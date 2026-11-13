import React, { useState, useCallback } from 'react';
import CodeExecutionService from '../../../services/codeExecutionService';
import ChallengeRunner from './ChallengeRunner';
import LessonArticle from './LessonArticle';
import { getCourseTheme, getThemeClass } from './courseTheme';
import './SlideRenderer.css';
import './themes.css';

// ─── Code runner hook ─────────────────────────────────────────────────────────

function useCodeRunner(initialCode, language) {
  const [code, setCode] = useState(initialCode || '');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const run = useCallback(async () => {
    if (!code.trim() || running) return;
    setRunning(true);
    setOutput('Running…');
    const result = await CodeExecutionService.execute(code, language);
    setOutput(result.output || result.stdout || result.stderr || 'No output.');
    setRunning(false);
    setHasRun(true);
  }, [code, language, running]);

  return { code, setCode, output, running, hasRun, run };
}

// ─── Code runner UI ───────────────────────────────────────────────────────────

function CodeRunner({ initialCode, language, theme }) {
  const { code, setCode, output, running, hasRun, run } = useCodeRunner(initialCode, language);
  const isPreview = language === 'html' || language === 'css';
  const isError = output.toLowerCase().startsWith('error') || output.includes('Traceback');

  return (
    <div className="cr">
      <div className="cr__header">
        <span className="cr__lang">{language}</span>
        <button className="cr__run" onClick={run} disabled={running || !code.trim()}>
          {running
            ? <><span className="cr__spin" /> Running…</>
            : <><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg> Run</>
          }
        </button>
      </div>
      <textarea
        className="cr__editor"
        value={code}
        onChange={e => setCode(e.target.value)}
        spellCheck={false}
        onKeyDown={e => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); run(); }
          if (e.key === 'Tab') {
            e.preventDefault();
            const s = e.target.selectionStart;
            const next = code.slice(0, s) + '  ' + code.slice(e.target.selectionEnd);
            setCode(next);
            requestAnimationFrame(() => { e.target.selectionStart = e.target.selectionEnd = s + 2; });
          }
        }}
      />
      {hasRun && (
        isPreview ? (
          <div className="cr__preview-wrap">
            <div className="cr__output-label">Preview</div>
            <iframe className="cr__preview" title="preview" sandbox="allow-scripts"
              srcDoc={language === 'css' ? `<style>${output}</style><div style="padding:16px;font-family:sans-serif">CSS applied</div>` : output}
            />
          </div>
        ) : (
          <div className={`cr__output ${isError ? 'cr__output--error' : ''}`}>
            <div className="cr__output-label">{isError ? 'Error' : 'Output'}</div>
            <pre className="cr__output-body">{output}</pre>
          </div>
        )
      )}
    </div>
  );
}

// ─── PYTHON — Notebook theme ──────────────────────────────────────────────────

function NotebookHero({ slide }) {
  const { content } = slide;
  return (
    <div className="nb-hero">
      <div className="nb-hero__rule" />
      {content.eyebrow && <span className="nb-hero__eyebrow">{content.eyebrow}</span>}
      <p className="nb-hero__subtitle">{content.subtitle}</p>
      {content.bullets?.length > 0 && (
        <ul className="nb-hero__bullets">
          {content.bullets.map((b, i) => <li key={i}><span className="nb-bullet-num">{i + 1}.</span>{b}</li>)}
        </ul>
      )}
      {content.chips?.length > 0 && (
        <div className="nb-chips">
          {content.chips.map((c, i) => <span key={i} className="nb-chip">{c}</span>)}
        </div>
      )}
    </div>
  );
}

function NotebookTwoCol({ slide }) {
  const { content } = slide;
  return (
    <div className="nb-twocol">
      <div className="nb-twocol__col">
        <div className="nb-col-header">{content.left?.title}</div>
        {content.left?.description && <p className="nb-col-desc">{content.left.description}</p>}
        <ul className="nb-col-list">
          {content.left?.items?.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
        {content.left?.code && <CodeRunner initialCode={content.left.code} language="python" />}
      </div>
      <div className="nb-twocol__divider" />
      <div className="nb-twocol__col">
        <div className="nb-col-header">{content.right?.title}</div>
        {content.right?.description && <p className="nb-col-desc">{content.right.description}</p>}
        <ul className="nb-col-list">
          {content.right?.items?.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
        {content.right?.code && <CodeRunner initialCode={content.right.code} language="python" />}
      </div>
    </div>
  );
}

function NotebookInfograhic({ slide }) {
  const { content } = slide;
  return (
    <div className="nb-info">
      {content.intro && <p className="nb-info__intro">{content.intro}</p>}
      <div className="nb-info__cards">
        {content.cards?.map((card, i) => (
          <div key={i} className="nb-card">
            {card.tag && <span className="nb-card__tag">{card.tag}</span>}
            <h4 className="nb-card__title">{card.title}</h4>
            {card.description && <p className="nb-card__desc">{card.description}</p>}
            {card.items?.length > 0 && <ul className="nb-card__list">{card.items.map((it, j) => <li key={j}>{it}</li>)}</ul>}
          </div>
        ))}
      </div>
    </div>
  );
}

function NotebookDiagram({ slide }) {
  const { content } = slide;
  return (
    <div className="nb-diagram">
      {content.intro && <p className="nb-diagram__intro">{content.intro}</p>}
      <div className="nb-diagram__flow">
        {content.nodes?.map((node, i) => (
          <React.Fragment key={i}>
            <div className="nb-node">
              <div className="nb-node__num">{i + 1}</div>
              <div className="nb-node__body">
                <div className="nb-node__title">{node.title}</div>
                {node.description && <div className="nb-node__desc">{node.description}</div>}
              </div>
            </div>
            {i < content.nodes.length - 1 && <div className="nb-node__arrow">↓</div>}
          </React.Fragment>
        ))}
      </div>
      {content.footer && <p className="nb-diagram__footer">{content.footer}</p>}
    </div>
  );
}

function NotebookSteps({ slide }) {
  const { content } = slide;
  return (
    <div className="nb-steps">
      {content.intro && <p className="nb-steps__intro">{content.intro}</p>}
      <ol className="nb-steps__list">
        {content.steps?.map((step, i) => (
          <li key={i} className="nb-step">
            <div className="nb-step__marker">{i + 1}</div>
            <div className="nb-step__body">
              <strong>{step.title}</strong>
              {step.description && <p>{step.description}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function NotebookCodePlus({ slide }) {
  const { content } = slide;
  return (
    <div className="nb-codeplus">
      <div className="nb-codeplus__left">
        {content.title && <h3 className="nb-codeplus__subtitle">{content.title}</h3>}
        {content.points?.length > 0 && (
          <ul className="nb-codeplus__points">
            {content.points.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        )}
        {content.note && <div className="nb-codeplus__note">{content.note}</div>}
      </div>
      <div className="nb-codeplus__right">
        <CodeRunner initialCode={content.code || ''} language="python" />
      </div>
    </div>
  );
}

function NotebookCode({ slide }) {
  const { content } = slide;
  return (
    <div className="nb-code">
      {content.description && <p className="nb-code__desc">{content.description}</p>}
      {content.title && <h3 className="nb-code__subtitle">{content.title}</h3>}
      {content.keyPoints?.length > 0 && (
        <ul className="nb-codeplus__points">
          {content.keyPoints.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      )}
      <CodeRunner initialCode={content.code || ''} language="python" />
      {content.explanation && <p className="nb-codeplus__note">{content.explanation}</p>}
    </div>
  );
}

// ─── JAVASCRIPT — Terminal theme ──────────────────────────────────────────────

function TerminalHero({ slide }) {
  const { content } = slide;
  return (
    <div className="tm-hero">
      <div className="tm-hero__bar"><span /><span /><span /></div>
      {content.eyebrow && <div className="tm-hero__prompt"><span className="tm-prompt">$</span> {content.eyebrow}</div>}
      <p className="tm-hero__subtitle">{content.subtitle}</p>
      {content.bullets?.length > 0 && (
        <div className="tm-hero__bullets">
          {content.bullets.map((b, i) => (
            <div key={i} className="tm-bullet"><span className="tm-prompt">{'>'}</span> {b}</div>
          ))}
        </div>
      )}
      {content.chips?.length > 0 && (
        <div className="tm-chips">
          {content.chips.map((c, i) => <span key={i} className="tm-chip">{c}</span>)}
        </div>
      )}
    </div>
  );
}

function TerminalTwoCol({ slide }) {
  const { content } = slide;
  return (
    <div className="tm-twocol">
      <div className="tm-col">
        <div className="tm-col__header"><span className="tm-prompt">//</span> {content.left?.title}</div>
        {content.left?.description && <p className="tm-col__desc">{content.left.description}</p>}
        <ul className="tm-col__list">
          {content.left?.items?.map((item, i) => <li key={i}><span className="tm-prompt">→</span> {item}</li>)}
        </ul>
        {content.left?.code && <CodeRunner initialCode={content.left.code} language="javascript" />}
      </div>
      <div className="tm-col">
        <div className="tm-col__header"><span className="tm-prompt">//</span> {content.right?.title}</div>
        {content.right?.description && <p className="tm-col__desc">{content.right.description}</p>}
        <ul className="tm-col__list">
          {content.right?.items?.map((item, i) => <li key={i}><span className="tm-prompt">→</span> {item}</li>)}
        </ul>
        {content.right?.code && <CodeRunner initialCode={content.right.code} language="javascript" />}
      </div>
    </div>
  );
}

function TerminalInfographic({ slide }) {
  const { content } = slide;
  return (
    <div className="tm-info">
      {content.intro && <div className="tm-info__intro"><span className="tm-prompt">/*</span> {content.intro} <span className="tm-prompt">*/</span></div>}
      <div className="tm-info__cards">
        {content.cards?.map((card, i) => (
          <div key={i} className="tm-card">
            {card.tag && <span className="tm-card__tag">{card.tag}</span>}
            <div className="tm-card__title">{card.title}</div>
            {card.description && <p className="tm-card__desc">{card.description}</p>}
            {card.items?.length > 0 && <ul className="tm-card__list">{card.items.map((it, j) => <li key={j}><span className="tm-prompt">-</span> {it}</li>)}</ul>}
          </div>
        ))}
      </div>
    </div>
  );
}

function TerminalDiagram({ slide }) {
  const { content } = slide;
  return (
    <div className="tm-diagram">
      {content.intro && <div className="tm-diagram__intro">{content.intro}</div>}
      <div className="tm-diagram__flow">
        {content.nodes?.map((node, i) => (
          <React.Fragment key={i}>
            <div className="tm-node">
              <span className="tm-node__bracket">{'{'}</span>
              <div className="tm-node__body">
                <div className="tm-node__title">{node.title}</div>
                {node.description && <div className="tm-node__desc">{node.description}</div>}
              </div>
              <span className="tm-node__bracket">{'}'}</span>
            </div>
            {i < content.nodes.length - 1 && <div className="tm-node__arrow">→</div>}
          </React.Fragment>
        ))}
      </div>
      {content.footer && <div className="tm-diagram__footer">// {content.footer}</div>}
    </div>
  );
}

function TerminalSteps({ slide }) {
  const { content } = slide;
  return (
    <div className="tm-steps">
      {content.intro && <div className="tm-steps__intro">{content.intro}</div>}
      {content.steps?.map((step, i) => (
        <div key={i} className="tm-step">
          <div className="tm-step__num">step_{i + 1}</div>
          <div className="tm-step__body">
            <div className="tm-step__title">{step.title}</div>
            {step.description && <div className="tm-step__desc">{step.description}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function TerminalCodePlus({ slide }) {
  const { content } = slide;
  return (
    <div className="tm-codeplus">
      <div className="tm-codeplus__left">
        {content.title && <div className="tm-codeplus__title">// {content.title}</div>}
        {content.points?.length > 0 && (
          <ul className="tm-codeplus__points">
            {content.points.map((p, i) => <li key={i}><span className="tm-prompt">✓</span> {p}</li>)}
          </ul>
        )}
        {content.note && <div className="tm-codeplus__note">/* {content.note} */</div>}
      </div>
      <div className="tm-codeplus__right">
        <CodeRunner initialCode={content.code || ''} language="javascript" />
      </div>
    </div>
  );
}

function TerminalCode({ slide }) {
  const { content } = slide;
  return (
    <div className="tm-code">
      {content.description && <div className="tm-code__desc">{content.description}</div>}
      {content.title && <div className="tm-codeplus__title">// {content.title}</div>}
      {content.keyPoints?.length > 0 && (
        <ul className="tm-codeplus__points">
          {content.keyPoints.map((p, i) => <li key={i}><span className="tm-prompt">✓</span> {p}</li>)}
        </ul>
      )}
      <CodeRunner initialCode={content.code || ''} language="javascript" />
      {content.explanation && <div className="tm-codeplus__note">/* {content.explanation} */</div>}
    </div>
  );
}

// ─── Generic themed renderer (used by all other courses) ─────────────────────
// Each gets its own CSS class but shares this structure — unique via themes.css

function GenericTitle({ slide, lang }) {
  const { content } = slide;
  return (
    <div className="gn-title">
      {content.subtitle && <p className="gn-title__sub">{content.subtitle}</p>}
      {content.description && <p className="gn-title__desc">{content.description}</p>}
    </div>
  );
}

function GenericHero({ slide, lang }) {
  const { content } = slide;
  return (
    <div className="gn-hero">
      {content.eyebrow && <span className="gn-hero__eyebrow">{content.eyebrow}</span>}
      {content.subtitle && <p className="gn-hero__subtitle">{content.subtitle}</p>}
      {content.bullets?.length > 0 && (
        <ul className="gn-hero__bullets">
          {content.bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      )}
      {content.chips?.length > 0 && (
        <div className="gn-chips">
          {content.chips.map((c, i) => <span key={i} className="gn-chip">{c}</span>)}
        </div>
      )}
    </div>
  );
}

function GenericTwoCol({ slide, lang }) {
  const { content } = slide;
  return (
    <div className="gn-twocol">
      <div className="gn-col">
        <div className="gn-col__header">{content.left?.title}</div>
        {content.left?.description && <p className="gn-col__desc">{content.left.description}</p>}
        <ul className="gn-col__list">
          {content.left?.items?.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
        {content.left?.code && <CodeRunner initialCode={content.left.code} language={lang} />}
      </div>
      <div className="gn-col">
        <div className="gn-col__header">{content.right?.title}</div>
        {content.right?.description && <p className="gn-col__desc">{content.right.description}</p>}
        <ul className="gn-col__list">
          {content.right?.items?.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
        {content.right?.code && <CodeRunner initialCode={content.right.code} language={lang} />}
      </div>
    </div>
  );
}

function GenericInfographic({ slide, lang }) {
  const { content } = slide;
  return (
    <div className="gn-info">
      {content.intro && <p className="gn-info__intro">{content.intro}</p>}
      <div className="gn-info__cards">
        {content.cards?.map((card, i) => (
          <div key={i} className="gn-card">
            {card.tag && <span className="gn-card__tag">{card.tag}</span>}
            <h4 className="gn-card__title">{card.title}</h4>
            {card.description && <p className="gn-card__desc">{card.description}</p>}
            {card.items?.length > 0 && <ul className="gn-card__list">{card.items.map((it, j) => <li key={j}>{it}</li>)}</ul>}
          </div>
        ))}
      </div>
    </div>
  );
}

function GenericDiagram({ slide, lang }) {
  const { content } = slide;
  return (
    <div className="gn-diagram">
      {content.intro && <p className="gn-diagram__intro">{content.intro}</p>}
      <div className="gn-diagram__flow">
        {content.nodes?.map((node, i) => (
          <React.Fragment key={i}>
            <div className="gn-node">
              <div className="gn-node__title">{node.title}</div>
              {node.description && <div className="gn-node__desc">{node.description}</div>}
            </div>
            {i < content.nodes.length - 1 && <div className="gn-node__arrow">→</div>}
          </React.Fragment>
        ))}
      </div>
      {content.footer && <p className="gn-diagram__footer">{content.footer}</p>}
    </div>
  );
}

function GenericSteps({ slide, lang }) {
  const { content } = slide;
  return (
    <div className="gn-steps">
      {content.intro && <p className="gn-steps__intro">{content.intro}</p>}
      <ol className="gn-steps__list">
        {content.steps?.map((step, i) => (
          <li key={i} className="gn-step">
            <div className="gn-step__num">{i + 1}</div>
            <div className="gn-step__body">
              <strong>{step.title}</strong>
              {step.description && <p>{step.description}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function GenericCodePlus({ slide, lang }) {
  const { content } = slide;
  return (
    <div className="gn-codeplus">
      <div className="gn-codeplus__left">
        {content.title && <h3 className="gn-codeplus__subtitle">{content.title}</h3>}
        {content.points?.length > 0 && (
          <ul className="gn-codeplus__points">
            {content.points.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        )}
        {content.note && <div className="gn-codeplus__note">{content.note}</div>}
      </div>
      <div className="gn-codeplus__right">
        <CodeRunner initialCode={content.code || ''} language={lang} />
      </div>
    </div>
  );
}

function GenericCode({ slide, lang }) {
  const { content } = slide;
  return (
    <div className="gn-code">
      {content.description && <p className="gn-code__desc">{content.description}</p>}
      {content.title && <h3 className="gn-codeplus__subtitle">{content.title}</h3>}
      {content.keyPoints?.length > 0 && (
        <ul className="gn-codeplus__points">
          {content.keyPoints.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      )}
      <CodeRunner initialCode={content.code || ''} language={lang} />
      {content.explanation && <p className="gn-codeplus__note">{content.explanation}</p>}
    </div>
  );
}

// ─── Theme router ─────────────────────────────────────────────────────────────

function renderSlide(type, slide, courseSlug) {
  const lang = courseSlug || 'python';

  // Python — Notebook
  if (courseSlug === 'python') {
    switch (type) {
      case 'hero':        return <NotebookHero slide={slide} />;
      case 'two-column':  return <NotebookTwoCol slide={slide} />;
      case 'infographic': return <NotebookInfograhic slide={slide} />;
      case 'diagram':     return <NotebookDiagram slide={slide} />;
      case 'steps':       return <NotebookSteps slide={slide} />;
      case 'code-plus':   return <NotebookCodePlus slide={slide} />;
      case 'code':        return <NotebookCode slide={slide} />;
      default: break;
    }
  }

  // JavaScript — Terminal
  if (courseSlug === 'javascript' || courseSlug === 'nodejs' || courseSlug === 'angularjs') {
    switch (type) {
      case 'hero':        return <TerminalHero slide={slide} />;
      case 'two-column':  return <TerminalTwoCol slide={slide} />;
      case 'infographic': return <TerminalInfographic slide={slide} />;
      case 'diagram':     return <TerminalDiagram slide={slide} />;
      case 'steps':       return <TerminalSteps slide={slide} />;
      case 'code-plus':   return <TerminalCodePlus slide={slide} />;
      case 'code':        return <TerminalCode slide={slide} />;
      default: break;
    }
  }

  // All other courses — Generic with theme CSS
  switch (type) {
    case 'title':       return <GenericTitle slide={slide} lang={lang} />;
    case 'hero':        return <GenericHero slide={slide} lang={lang} />;
    case 'two-column':  return <GenericTwoCol slide={slide} lang={lang} />;
    case 'infographic': return <GenericInfographic slide={slide} lang={lang} />;
    case 'diagram':     return <GenericDiagram slide={slide} lang={lang} />;
    case 'steps':       return <GenericSteps slide={slide} lang={lang} />;
    case 'code-plus':   return <GenericCodePlus slide={slide} lang={lang} />;
    case 'code':        return <GenericCode slide={slide} lang={lang} />;
    default:
      return (
        <div className="gn-generic">
          {slide.content?.intro && <p>{slide.content.intro}</p>}
          {slide.content?.description && <p>{slide.content.description}</p>}
        </div>
      );
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function SlideRenderer({ lesson, courseSlug }) {
  if (!lesson) return null;

  const raw = lesson.content || {};
  const content = raw.content && typeof raw.content === 'object' ? raw.content : raw;
  const type = lesson.lessonType || lesson.lesson_type || raw.type || lesson.type || 'hero';
  const themeClass = getThemeClass(courseSlug);

  const slideWithContent = { ...lesson, content };

  // lesson type renders as a full article — no slide wrapper
  if (type === 'lesson') {
    return (
      <div className={`slide-renderer ${themeClass}`}>
        <LessonArticle lesson={slideWithContent} courseSlug={courseSlug} />
        {content.challenge && (
          <ChallengeRunner challenge={content.challenge} courseSlug={courseSlug} />
        )}
      </div>
    );
  }

  return (
    <div className={`slide-renderer ${themeClass}`}>
      <h2 className="slide-title">{lesson.title}</h2>
      {renderSlide(type, slideWithContent, courseSlug)}
      {content.challenge && type !== 'challenge' && (
        <ChallengeRunner challenge={content.challenge} courseSlug={courseSlug} />
      )}
    </div>
  );
}
