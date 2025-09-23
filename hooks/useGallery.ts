// hooks/useGallery.ts
'use client'
import * as React from 'react'
import { Api } from '@/lib/api'
import { logger } from '@/lib/logger'

export interface GalleryImage { url: string; gen_seconds?: number | null }
export interface GalleryResponse { request_id: string; status: string; images: GalleryImage[] }

export function useGallery(requestId?: string, enabled = false) {
  const [data, setData] = React.useState<GalleryResponse | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const refresh = React.useCallback(async () => {
    if (!requestId) return
    try {
      setLoading(true); setError(null)
      const res = await Api.getGallery(requestId) as GalleryResponse
      setData(res)
      logger.info('gallery.loaded', { request_id: requestId, count: res?.images?.length || 0 })
    } catch (e: any) {
      const msg = e?.message || 'Failed to load gallery'
      setError(msg)
      logger.error('gallery.error', { request_id: requestId, error: msg })
    } finally {
      setLoading(false)
    }
  }, [requestId])

  React.useEffect(() => { if (enabled && requestId) { void refresh() } }, [enabled, requestId, refresh])
  return { data, loading, error, refresh }
}
