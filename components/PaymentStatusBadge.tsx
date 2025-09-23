// components/PaymentStatusBadge.tsx
'use client'
import { cn } from '@/lib/utils'

export function PaymentStatusBadge({ status }: { status?: string }) {
  const s = (status || '').toUpperCase()
  const color =
    s === 'PAID' ? 'bg-emerald-500' :
    s === 'REFUNDED' ? 'bg-slate-500' :
    s === 'FAILED' ? 'bg-red-500' :
    'bg-amber-500' // REQUIRES_PAYMENT / default

  const label = s || 'UNKNOWN'
  return (
    <span className={cn(
      'inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-medium text-white',
      color
    )}>
      <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
      {label}
    </span>
  )
}
