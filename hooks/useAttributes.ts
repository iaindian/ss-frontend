// hooks/useAttributes.ts
'use client'
import * as React from 'react'
import { Api } from '@/lib/api'
import type { Attributes } from '@/lib/types'
import { logger } from '@/lib/logger'
import { useRouter } from 'next/navigation'

export function useAttributes() {
  const [attributes, setAttributes] = React.useState<Attributes | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const refresh = React.useCallback(async () => {
    setError(null); setLoading(true)
    try {
      const res = await Api.getAttributes()
      setAttributes(res?.attributes ?? null)
      logger.info('attributes.loaded', { has: !!res?.attributes })
    } catch (e: any) {
      setError(e?.message || 'Failed to load attributes')
      logger.error('attributes.load.error', { error: e?.message })
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => { refresh() }, [refresh])

  const hasAttributes = !!attributes && Object.keys(attributes).length > 0

  return { attributes, hasAttributes, loading, error, refresh, setAttributes }
}

/** Guard you can call before actions that need attributes */
export function useRequireAttributes() {
  const router = useRouter()
  const { hasAttributes } = useAttributes() // NOTE: if called inside a page, prefer passing hasAttributes down instead of calling hook twice

  return React.useCallback((opts?: { onMissing?: () => void }) => {
    if (!hasAttributes) {
      opts?.onMissing?.()
      router.push('/attributes?required=1')
      return false
    }
    return true
  }, [hasAttributes, router])
}
