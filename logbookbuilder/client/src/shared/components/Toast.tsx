import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastKind = 'success' | 'error' | 'warn'

interface ToastItem {
  id: number
  kind: ToastKind
  message: string
}

interface ToastContextValue {
  toast: (message: string, kind?: ToastKind) => void
  success: (message: string) => void
  error: (message: string) => void
  warn: (message: string) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null)

let _nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = ++_nextId
    setToasts((prev) => [...prev, { id, kind, message }])
    setTimeout(() => dismiss(id), 4000)
  }, [dismiss])

  const success = useCallback((msg: string) => toast(msg, 'success'), [toast])
  const error   = useCallback((msg: string) => toast(msg, 'error'),   [toast])
  const warn    = useCallback((msg: string) => toast(msg, 'warn'),    [toast])

  return (
    <ToastContext.Provider value={{ toast, success, error, warn }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

// ─── Visual container ─────────────────────────────────────────────────────────

const STYLES: Record<ToastKind, { bg: string; border: string; color: string }> = {
  success: { bg: '#dcfce7', border: '#bbf7d0', color: '#166534' },
  error:   { bg: '#fee2e2', border: '#fecaca', color: '#b91c1c' },
  warn:    { bg: '#fef3c7', border: '#fde68a', color: '#92400e' },
}

const ICONS: Record<ToastKind, React.ElementType> = {
  success: CheckCircle,
  error:   XCircle,
  warn:    AlertTriangle,
}

function ToastContainer({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: number) => void }) {
  if (toasts.length === 0) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'grid',
      gap: '0.5rem',
      maxWidth: 380,
      width: 'calc(100vw - 3rem)',
    }}>
      {toasts.map((t) => {
        const s = STYLES[t.kind]
        const Icon = ICONS[t.kind]
        return (
          <div
            key={t.id}
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              background: s.bg,
              border: `1px solid ${s.border}`,
              color: s.color,
              borderRadius: 10,
              padding: '0.75rem 0.9rem',
              boxShadow: '0 4px 16px rgba(15,23,42,0.12)',
              fontSize: '0.875rem',
              fontWeight: 500,
              lineHeight: 1.45,
              animation: 'toast-in 0.2s ease',
            }}
          >
            <Icon size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              onClick={() => onDismiss(t.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: s.color,
                opacity: 0.6,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
              }}
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
