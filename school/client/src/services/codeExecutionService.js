const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PREVIEW_LANGUAGES = new Set(['html', 'css']);

const BACKEND_LANGUAGES = new Set([
  'python', 'django', 'dsa',
  'javascript', 'nodejs', 'react', 'angularjs',
  'java', 'sql', 'cpp', 'c', 'php', 'ruby',
]);

// Client-side fallback — JS only via new Function
const runJavaScriptLocally = async (code) => {
  const captured = [];
  const orig = { log: console.log, info: console.info, warn: console.warn, error: console.error };
  const capture = (...args) => captured.push(args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' '));

  try {
    console.log = console.info = console.warn = console.error = capture;
    // eslint-disable-next-line no-new-func
    const runner = new Function(`"use strict"; return (async () => { ${code} })();`);
    const result = await runner();
    if (captured.length > 0) return captured.join('\n');
    if (typeof result !== 'undefined') return JSON.stringify(result, null, 2);
    return 'Code ran with no output.';
  } catch (e) {
    return `Error: ${e.message}`;
  } finally {
    Object.assign(console, orig);
  }
};

// Client-side fallback — Python via Pyodide (lazy loaded)
let pyodideInstance = null;
let pyodideLoading = null;

const getPyodide = async () => {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoading) return pyodideLoading;
  if (typeof window === 'undefined' || typeof window.loadPyodide !== 'function') {
    throw new Error('Python runtime not available offline.');
  }
  pyodideLoading = window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' })
    .then(inst => { pyodideInstance = inst; pyodideLoading = null; return inst; })
    .catch(e => { pyodideLoading = null; throw e; });
  return pyodideLoading;
};

const runPythonLocally = async (code) => {
  try {
    const pyodide = await getPyodide();
    pyodide.globals.set('__code', code);
    await pyodide.runPythonAsync(`
import io, sys, traceback
_out = io.StringIO(); _err = io.StringIO()
sys.stdout = _out; sys.stderr = _err
try:
    exec(__code, {})
except Exception:
    traceback.print_exc()
finally:
    sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__
__stdout = _out.getvalue(); __stderr = _err.getvalue()
    `);
    const stdout = pyodide.globals.get('__stdout') || '';
    const stderr = pyodide.globals.get('__stderr') || '';
    pyodide.globals.delete('__code');
    pyodide.globals.delete('__stdout');
    pyodide.globals.delete('__stderr');
    if (stderr.trim()) return `Error:\n${stderr.trim()}`;
    return stdout.trim() || 'Code ran with no output.';
  } catch (e) {
    return `Error: ${e.message}`;
  }
};

// Try backend, fall back to client-side if network fails
const runWithFallback = async (code, language) => {
  const lang = String(language || '').toLowerCase().trim();

  // Always use iframe for HTML/CSS
  if (PREVIEW_LANGUAGES.has(lang)) {
    return { stdout: code, stderr: '', exitCode: 0, isPreview: true, output: code };
  }

  // Try backend first
  try {
    const token = localStorage.getItem('token');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const res = await fetch(`${API_BASE}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ code, language: lang }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const output = [data.stdout, data.stderr].filter(Boolean).join('\n').trim()
        || 'Code ran with no output.';
      return { stdout: data.stdout || '', stderr: data.stderr || '', exitCode: data.exitCode ?? 0, output, source: 'backend' };
    }

    // Backend returned an error response
    const data = await res.json().catch(() => ({}));
    if (res.status === 429) {
      return { stdout: '', stderr: '', exitCode: 1, output: 'Too many executions. Please wait a moment.' };
    }
    if (res.status === 400 && data.message?.includes('not supported')) {
      return { stdout: '', stderr: '', exitCode: 1, output: data.message };
    }

    throw new Error(data.message || `Server error ${res.status}`);

  } catch (networkError) {
    // Network failed or timed out — try client-side fallback
    const isNetworkFailure =
      networkError.name === 'AbortError' ||
      networkError.name === 'TypeError' ||
      networkError.message?.includes('fetch') ||
      networkError.message?.includes('network') ||
      networkError.message?.includes('Failed to fetch');

    if (isNetworkFailure) {
      // JS fallback
      if (lang === 'javascript' || lang === 'nodejs' || lang === 'react' || lang === 'angularjs') {
        const output = await runJavaScriptLocally(code);
        return { stdout: output, stderr: '', exitCode: 0, output, source: 'local-js' };
      }

      // Python fallback via Pyodide
      if (lang === 'python' || lang === 'django' || lang === 'dsa') {
        try {
          const output = await runPythonLocally(code);
          return { stdout: output, stderr: '', exitCode: 0, output, source: 'local-python' };
        } catch {
          return {
            stdout: '', stderr: '', exitCode: 1,
            output: 'Network unavailable. Python offline runtime failed to load.',
            source: 'local-python-failed',
          };
        }
      }

      // No fallback available for this language
      return {
        stdout: '', stderr: '', exitCode: 1,
        output: `Network unavailable. ${language} requires a connection to run.`,
        source: 'offline-unsupported',
      };
    }

    // Non-network error
    return { stdout: '', stderr: networkError.message, exitCode: 1, output: `Error: ${networkError.message}` };
  }
};

class CodeExecutionService {
  static async execute(code, language, stdin = '') {
    if (!code || !code.trim()) {
      return { stdout: '', stderr: '', exitCode: 0, output: 'No code to execute.' };
    }
    return runWithFallback(code, language);
  }

  // Convenience — returns just the output string
  static async run(code, language) {
    const result = await this.execute(code, language);
    return result.output || result.stdout || result.stderr || 'No output.';
  }
}

export { BACKEND_LANGUAGES, PREVIEW_LANGUAGES };
export default CodeExecutionService;
