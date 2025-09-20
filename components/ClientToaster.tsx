'use client'
import ClientOnly from '@/components/ClientOnly'
import { Toaster, useToaster } from '@/components/ui/toaster'
import { bindToast } from '@/lib/logger'
import * as React from 'react'

export default function ClientToaster() {
  const t = useToaster()

  // connect logger -> toast (so logger.error/info can pop UI toasts if enabled)
  React.useEffect(() => {
    bindToast(({ title, description }) => t.add({ title, description }))
  }, [t])

  return (
    <ClientOnly>
      <Toaster toasts={t.toasts} remove={t.remove} />
    </ClientOnly>
  )
}
