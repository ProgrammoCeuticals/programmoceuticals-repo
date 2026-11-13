import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '16px', padding: '40px', textAlign: 'center',
        fontFamily: 'var(--font-sans, sans-serif)',
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#212529' }}>Something went wrong</h2>
        <p style={{ fontSize: '14px', color: '#6c757d', maxWidth: '360px' }}>
          An unexpected error occurred. Refresh the page or go back to continue.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', background: '#0b5ed7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
          >
            Refresh Page
          </button>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.hash = '/'; }}
            style={{ padding: '10px 20px', background: '#f1f3f5', color: '#212529', border: '1px solid #dee2e6', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
          >
            Go Home
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && this.state.error && (
          <pre style={{ fontSize: '11px', color: '#dc3545', background: '#f8d7da', padding: '12px', borderRadius: '6px', maxWidth: '600px', overflow: 'auto', textAlign: 'left', marginTop: '8px' }}>
            {this.state.error.toString()}
          </pre>
        )}
      </div>
    );
  }
}
