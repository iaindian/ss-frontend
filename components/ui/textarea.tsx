import * as React from 'react'
import { clsx } from '@/lib/utils'
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={clsx('w-full rounded-xl border border-border bg-card px-3 py-2 text-sm', className)} {...props} />
  )
)
Textarea.displayName = 'Textarea'
