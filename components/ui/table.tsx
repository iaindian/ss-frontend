// components/ui/table.tsx (small enhancement)
import * as React from 'react'
export function Table({ children }: { children: React.ReactNode }) {
  return <table className="w-full table-auto border-separate border-spacing-y-2">{children}</table>
}
export function THead({ children }: { children: React.ReactNode }) {
  return <thead className="text-left text-xs uppercase text-foreground/60">{children}</thead>
}
export function TRow({ children }: { children: React.ReactNode }) {
  return <tr>{children}</tr>
}
export function TH({ children }: { children: React.ReactNode }) {
  return <th className="border-b border-border pb-2 font-medium">{children}</th>
}
export function TD({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`rounded-xl bg-card p-3 align-top ${className || ''}`}>{children}</td>
}
