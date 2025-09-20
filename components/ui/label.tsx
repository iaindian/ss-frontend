import * as React from 'react'
export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-xs uppercase tracking-wide text-foreground/70">
      {children}
    </label>
  )
}
