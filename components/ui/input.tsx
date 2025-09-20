import * as React from 'react'
import { clsx } from '@/lib/utils'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={clsx('w-full rounded-xl border border-border bg-card px-3 py-2 text-sm', className)} {...props} />
  )
)
Input.displayName = 'Input'
