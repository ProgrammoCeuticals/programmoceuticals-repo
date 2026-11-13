"use client";

import { create } from "zustand";
import { useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  variant: ToastVariant;
  message: string;
}

interface ToastStore {
  toasts: Toast[];
  add: (variant: ToastVariant, message: string) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (variant, message) => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { id, variant, message }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 5000);
  },
  remove: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (message: string) => useToastStore.getState().add("success", message),
  error: (message: string) => useToastStore.getState().add("error", message),
  warning: (message: string) => useToastStore.getState().add("warning", message),
  info: (message: string) => useToastStore.getState().add("info", message),
};

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle className="h-4 w-4 text-green-600" aria-hidden="true" />,
  error: <XCircle className="h-4 w-4 text-red-600" aria-hidden="true" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden="true" />,
  info: <Info className="h-4 w-4 text-blue-600" aria-hidden="true" />,
};

const STYLES: Record<ToastVariant, string> = {
  success: "border-green-200 bg-green-50 text-green-900",
  error: "border-red-200 bg-red-50 text-red-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  info: "border-blue-200 bg-blue-50 text-blue-900",
};

function ToastItem({ toast: t }: { toast: Toast }) {
  const remove = useToastStore((s) => s.remove);
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3 shadow-md",
        STYLES[t.variant],
      )}
    >
      {ICONS[t.variant]}
      <p className="flex-1 text-sm">{t.message}</p>
      <button
        onClick={() => remove(t.id)}
        className="rounded p-0.5 opacity-60 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        aria-label="Dismiss notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
