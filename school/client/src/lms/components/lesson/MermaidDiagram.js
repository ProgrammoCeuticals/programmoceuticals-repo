import React, { useEffect, useRef, useState } from 'react';
import './MermaidDiagram.css';

let mermaidInitialized = false;

async function getMermaid() {
  const m = await import('mermaid');
  const mermaid = m.default;
  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        primaryColor: '#3776ab',
        primaryTextColor: '#1a1a2e',
        primaryBorderColor: '#3776ab',
        lineColor: '#3776ab',
        secondaryColor: '#ffd43b22',
        tertiaryColor: '#f8f9fa',
        background: '#ffffff',
        mainBkg: '#ffffff',
        nodeBorder: '#3776ab',
        clusterBkg: '#f0f4f8',
        titleColor: '#1a1a2e',
        edgeLabelBackground: '#ffffff',
        fontFamily: 'Inter, -apple-system, sans-serif',
        fontSize: '14px',
      },
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
        padding: 20,
      },
      sequence: {
        diagramMarginX: 20,
        diagramMarginY: 20,
        actorMargin: 80,
        noteMargin: 10,
        messageMargin: 35,
      },
    });
    mermaidInitialized = true;
  }
  return mermaid;
}

let diagramCounter = 0;

export default function MermaidDiagram({ chart, caption, theme }) {
  const containerRef = useRef(null);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const idRef = useRef(`mermaid-${++diagramCounter}`);

  useEffect(() => {
    if (!chart) return;
    let cancelled = false;

    const render = async () => {
      setLoading(true);
      setError('');
      try {
        const mermaid = await getMermaid();
        const { svg: rendered } = await mermaid.render(idRef.current, chart);
        if (!cancelled) {
          setSvg(rendered);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message || 'Diagram failed to render');
          setLoading(false);
        }
      }
    };

    render();
    return () => { cancelled = true; };
  }, [chart]);

  if (loading) {
    return (
      <div className="mermaid-wrap mermaid-wrap--loading">
        <div className="mermaid-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mermaid-wrap mermaid-wrap--error">
        <span>⚠ Diagram error: {error}</span>
      </div>
    );
  }

  return (
    <figure className={`mermaid-wrap ${theme ? `mermaid-wrap--${theme}` : ''}`}>
      <div
        className="mermaid-svg"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {caption && <figcaption className="mermaid-caption">{caption}</figcaption>}
    </figure>
  );
}
