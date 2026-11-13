import { useEffect, useState } from 'react'
import * as RadixToast from '@radix-ui/react-toast'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '../lib/utils'

// ---------- Global store ----------

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant: ToastVariant
}

type Listener = (toasts: ToastItem[]) => void

let _toasts: ToastItem[] = []
const _listeners: Listener[] = []

function _notify(t: ToastItem) {
  _toasts = [..._toasts, t]
  _listeners.forEach((l) => l(_toasts))
}

function _dismiss(id: string) {
  _toasts = _toasts.filter((t) => t.id !== id)
  _listeners.forEach((l) => l(_toasts))
}

export function toast(params: Omit<ToastItem, 'id'>) {
  _notify({ ...params, id: Math.random().toString(36).slice(2) })
}

export function useToast() {
  return { toast }
}

// ---------- Icons ----------

const icons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  error: <AlertCircle className="h-5 w-5 text-red-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
}

const variantClasses: Record<ToastVariant, string> = {
  success: 'border-green-200 bg-green-50',
  error: 'border-red-200 bg-red-50',
  warning: 'border-amber-200 bg-amber-50',
  info: 'border-blue-200 bg-blue-50',
}

// ---------- Toaster component ----------

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    const listener: Listener = (ts) => setToasts([...ts])
    _listeners.push(listener)
    return () => {
      const idx = _listeners.indexOf(listener)
      if (idx !== -1) _listeners.splice(idx, 1)
    }
  }, [])

  return (
    <RadixToast.Provider swipeDirection="right">
      {toasts.map((t) => (
        <RadixToast.Root
          key={t.id}
          className={cn(
            'flex items-start gap-3 rounded-lg border p-4 shadow-md',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full',
            'data-[state=open]:slide-in-from-top-full',
            variantClasses[t.variant],
          )}
          onOpenChange={(open) => {
            if (!open) _dismiss(t.id)
          }}
          duration={5000}
        >
          <div className="flex-shrink-0 mt-0.5">{icons[t.variant]}</div>
          <div className="flex-1 min-w-0">
            <RadixToast.Title className="text-sm font-semibold text-slate-900">
              {t.title}
            </RadixToast.Title>
            {t.description && (
              <RadixToast.Description className="mt-1 text-xs text-slate-600">
                {t.description}
              </RadixToast.Description>
            )}
          </div>
          <RadixToast.Close asChild>
            <button
              className="flex-shrink-0 rounded p-0.5 text-slate-400 hover:text-slate-600"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </RadixToast.Close>
        </RadixToast.Root>
      ))}
      <RadixToast.Viewport className="fixed bottom-4 right-4 z-[100] flex max-h-screen w-full max-w-sm flex-col gap-2" />
    </RadixToast.Provider>
  )
}
