'use client'
import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Button } from './button'

export function Dialog({ trigger, title, children }: { trigger: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Content className="fixed inset-0 z-50 grid place-items-center bg-black/50">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-4">
          <div className="mb-2 text-lg font-semibold">{title}</div>
          <div>{children}</div>
          <div className="mt-4 flex justify-end"><Button variant="ghost">Close</Button></div>
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Root>
  )
}
