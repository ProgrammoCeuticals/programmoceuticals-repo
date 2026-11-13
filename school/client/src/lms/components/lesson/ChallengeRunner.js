import React, { useState, useCallback } from 'react';
import CodeExecutionService from '../../../services/codeExecutionService';
import './ChallengeRunner.css';

const DEFAULT_STARTERS = {
  python: '# Write your solution here\ndef solution():\n    pass\n',
  javascript: '// Write your solution here\nfunction solution() {\n\n}\n',
  sql: '-- Write your SQL query here\nSELECT ',
};

function buildTestRunner(userCode, testCase, language) {
  const { input, expected } = testCase;
  const args = Array.isArray(input) ? input : [input];
  const argsJson = args.map(a => JSON.stringify(a)).join(', ');
  const expectedJson = JSON.stringify(expected);

  if (language === 'python') {
    return `${userCode}

_args = [${argsJson}]
_result = solution(*_args)
_expected = ${expectedJson}
if _result == _expected:
    print("PASS")
else:
    print(f"FAIL: expected {_expected!r}, got {_result!r}")
`;
  }

  if (language === 'javascript' || language === 'nodejs') {
    return `${userCode}

const _args = [${argsJson}];
const _result = solution(..._args);
const _expected = ${expectedJson};
const _eq = JSON.stringify(_result) === JSON.stringify(_expected);
console.log(_eq ? "PASS" : \`FAIL: expected \${JSON.stringify(_expected)}, got \${JSON.stringify(_result)}\`);
`;
  }

  // For SQL and other languages — just run the code and compare stdout
  return userCode;
}

export default function ChallengeRunner({ challenge, courseSlug }) {
  const language = courseSlug || 'javascript';
  const starter = challenge?.starterCode || DEFAULT_STARTERS[language] || '// Write your solution here\n';

  const [code, setCode] = useState(starter);
  const [results, setResults] = useState([]);
  const [running, setRunning] = useState(false);
  const [freeOutput, setFreeOutput] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);

  const testCases = challenge?.testCases || [];
  const hints = challenge?.hints || [];
  const hasTests = testCases.length > 0;

  const runTests = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setResults([]);
    setFreeOutput('');

    if (!hasTests) {
      // No test cases — just run and show output
      const result = await CodeExecutionService.execute(code, language);
      setFreeOutput(result.output || result.stdout || result.stderr || 'No output.');
      setRunning(false);
      return;
    }

    const newResults = [];
    for (const tc of testCases) {
      const runCode = buildTestRunner(code, tc, language);
      const result = await CodeExecutionService.execute(runCode, language);
      const out = (result.stdout || result.output || '').trim();
      const passed = out.startsWith('PASS');
      newResults.push({
        input: tc.input,
        expected: tc.expected,
        output: out,
        passed,
        error: result.stderr || '',
      });
    }

    setResults(newResults);
    setRunning(false);
  }, [code, language, running, testCases, hasTests]);

  const passCount = results.filter(r => r.passed).length;
  const allPassed = results.length > 0 && passCount === results.length;

  return (
    <div className="challenge-runner">
      {/* Problem */}
      {challenge?.problem && (
        <div className="challenge-runner__problem">
          <h3 className="challenge-runner__problem-title">
            {challenge.title || 'Challenge'}
          </h3>
          <p className="challenge-runner__problem-desc">{challenge.problem}</p>
          {challenge.constraints?.length > 0 && (
            <ul className="challenge-runner__constraints">
              {challenge.constraints.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          )}
          {challenge.examples?.length > 0 && (
            <div className="challenge-runner__examples">
              {challenge.examples.map((ex, i) => (
                <div key={i} className="challenge-runner__example">
                  <span className="challenge-runner__example-label">Example {i + 1}</span>
                  <code>Input: {JSON.stringify(ex.input)}</code>
                  <code>Output: {JSON.stringify(ex.output)}</code>
                  {ex.explanation && <span>{ex.explanation}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Editor */}
      <div className="challenge-runner__editor-wrap">
        <div className="challenge-runner__editor-header">
          <span className="challenge-runner__lang">{language}</span>
          <div className="challenge-runner__editor-actions">
            {hints.length > 0 && (
              <button
                className="challenge-runner__hint-btn"
                onClick={() => {
                  setShowHints(true);
                  setHintIndex(i => Math.min(i + 1, hints.length));
                }}
                disabled={hintIndex >= hints.length}
              >
                💡 Hint {hintIndex}/{hints.length}
              </button>
            )}
            <button
              className="challenge-runner__run-btn"
              onClick={runTests}
              disabled={running || !code.trim()}
            >
              {running ? (
                <><span className="challenge-runner__spinner" /> Running…</>
              ) : (
                <><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                  {hasTests ? 'Run Tests' : 'Run Code'}</>
              )}
            </button>
          </div>
        </div>
        <textarea
          className="challenge-runner__editor"
          value={code}
          onChange={e => setCode(e.target.value)}
          spellCheck={false}
          onKeyDown={e => {
            if (e.key === 'Tab') {
              e.preventDefault();
              const s = e.target.selectionStart;
              const next = code.slice(0, s) + '  ' + code.slice(e.target.selectionEnd);
              setCode(next);
              requestAnimationFrame(() => { e.target.selectionStart = e.target.selectionEnd = s + 2; });
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') runTests();
          }}
        />
      </div>

      {/* Hints */}
      {showHints && hintIndex > 0 && (
        <div className="challenge-runner__hints">
          {hints.slice(0, hintIndex).map((hint, i) => (
            <div key={i} className="challenge-runner__hint">
              <span className="challenge-runner__hint-num">Hint {i + 1}</span>
              <span>{typeof hint === 'string' ? hint : hint.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Free output (no test cases) */}
      {freeOutput && (
        <div className="challenge-runner__free-output">
          <div className="challenge-runner__output-label">Output</div>
          <pre>{freeOutput}</pre>
        </div>
      )}

      {/* Test results */}
      {results.length > 0 && (
        <div className="challenge-runner__results">
          <div className={`challenge-runner__results-summary ${allPassed ? 'pass' : 'fail'}`}>
            {allPassed
              ? `✅ All ${results.length} tests passed!`
              : `${passCount} / ${results.length} tests passed`
            }
          </div>
          {results.map((r, i) => (
            <div key={i} className={`challenge-runner__test ${r.passed ? 'pass' : 'fail'}`}>
              <div className="challenge-runner__test-header">
                <span>{r.passed ? '✅' : '❌'} Test {i + 1}</span>
              </div>
              <div className="challenge-runner__test-body">
                <div><span>Input:</span> <code>{JSON.stringify(r.input)}</code></div>
                <div><span>Expected:</span> <code>{JSON.stringify(r.expected)}</code></div>
                <div><span>Output:</span> <code>{r.output || r.error || '(no output)'}</code></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
