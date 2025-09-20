'use client'
import * as React from 'react'
import { createPortal } from 'react-dom'

export type Toast = { id: number; title: string; description?: string }

export function useToaster() {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const add = React.useCallback((t: Omit<Toast, 'id'>) => {
    setToasts((prev) => [...prev, { id: Date.now(), ...t }])
  }, [])
  const remove = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])
  return { toasts, add, remove }
}

export function Toaster({
  toasts,
  remove,
}: {
  toasts: Toast[]
  remove: (id: number) => void
}) {
  // render only after mount to avoid SSR/CSR mismatch for the portal
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return createPortal(
    <div className="fixed right-4 top-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div key={t.id} className="rounded-xl border border-border bg-card p-3 shadow-neon">
          <div className="font-medium">{t.title}</div>
          {t.description && <div className="text-sm opacity-80">{t.description}</div>}
          <button
            className="mt-1 text-xs opacity-70 hover:opacity-100"
            onClick={() => remove(t.id)}
            aria-label="Dismiss toast"
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>,
    document.body
  )
}
