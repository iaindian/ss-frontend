'use client'
import * as React from 'react'
import { Api } from '@/lib/api'
import type { Pack } from '@/lib/types'
import { logger } from '@/lib/logger'

export function useSectionPacks(slug: string, limit = 40) {
  const [items, setItems] = React.useState<Pack[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const load = React.useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await Api.getSectionPacks(slug, limit)
      setItems(res.items)
      logger.info('section.packs.loaded', { slug, count: res.items.length })
    } catch (e: any) {
      setError(e?.message || 'Failed to load section')
      logger.error('section.packs.error', { slug, error: e?.message })
    } finally {
      setLoading(false)
    }
  }, [slug, limit])

  React.useEffect(() => { load() }, [load])
  return { items, loading, error, reload: load }
}
