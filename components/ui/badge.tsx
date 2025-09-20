import * as React from 'react'
export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-muted px-3 py-1 text-xs text-foreground/80">{children}</span>
}
