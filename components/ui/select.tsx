import * as React from 'react'
export function Select({ value, onChange, children }: { value?: string; onChange?: (v: string) => void; children: React.ReactNode }) {
  return (
    <select value={value} onChange={(e) => onChange?.(e.target.value)} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm">
      {children}
    </select>
  )
}
export function Option({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>
}
