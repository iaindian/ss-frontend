// app/(main)/attributes/page.tsx
'use client'
import * as React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useAttributes } from '@/hooks/useAttributes'
import { Api } from '@/lib/api'
import { ErrorView } from '@/components/ErrorView'
import { useSearchParams } from 'next/navigation'
import { AttributesForm } from '@/components/AttributesForm'
import { logger } from '@/lib/logger'

export default function AttributesPage() {
  const { me, loading: authLoading } = useAuth()
  const { attributes, loading, error, refresh } = useAttributes()
  const qp = useSearchParams()
  const required = qp.get('required') === '1'

  if (authLoading) return <div className="p-6">Loading…</div>
  if (!me) return <div className="p-6">Please sign in.</div>
  if (error) return <ErrorView description={error} />

  async function onSave(form: any) {
    try {
      await Api.updateAttributes(form)
      logger.info('attributes.save.success')
      await refresh()
      alert('Saved!')
    } catch (e: any) {
      logger.error('attributes.save.error', { error: e?.message })
      alert(e?.message || 'Failed to save')
    }
  }

  const showFirstTimeBanner = required || !attributes

  return (
    <div className="max-w-2xl space-y-4">
      {showFirstTimeBanner && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-sm">
          <div className="font-medium">Complete your attributes</div>
          <div className="opacity-80">
            These attributes will be used in prompts to match your likeness and style.
            Please fill them accurately before generating any pack.
          </div>
        </div>
      )}

      {loading ? (
        <div>Loading attributes…</div>
      ) : (
        <>
          <h1 className="text-xl font-semibold">Your Attributes</h1>
          <AttributesForm initial={attributes ?? undefined} onSave={onSave} />
        </>
      )}
    </div>
  )
}
