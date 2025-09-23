// components/JobStatusBadge.tsx
'use client'
import { cn } from '@/lib/utils'

export function JobStatusBadge({ status }: { status?: string }) {
  const s = (status || '').toUpperCase()
  const color = s === 'COMPLETED' ? 'bg-emerald-500'
    : s === 'RUNNING' ? 'bg-blue-500'
    : s === 'FAILED' ? 'bg-red-500'
    : 'bg-amber-500' // QUEUED / default

  const text = s || 'UNKNOWN'
  return (
    <span className={cn(
      'inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-medium text-white',
      color
    )}>
      <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
      {text}
    </span>
  )
}
