'use client'
import * as React from 'react'
import { Api } from '@/lib/api'
import type { Pack } from '@/lib/types'
import { logger } from '@/lib/logger'

export function usePacks(opts?: { tag?: string; sort?: 'latest'|'featured'|'trending'; limit?: number }) {
  const [packs, setPacks] = React.useState<Pack[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const load = React.useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res: any = await (Api as any).getPacks?.(opts)
      const list: Pack[] = Array.isArray(res) ? res : (res?.items ?? [])
      setPacks(list)
      logger.info('packs.loaded', { count: list.length })
    } catch (e: any) {
      setError(e?.message || 'Failed to load packs')
      logger.error('packs.load.error', { error: e?.message })
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(opts)])

  React.useEffect(() => { load() }, [load])

  return { packs, loading, error, reload: load }
}
