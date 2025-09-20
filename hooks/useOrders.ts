// hooks/useOrders.ts
'use client'
import * as React from 'react'
import { Api } from '@/lib/api'
import type { Job } from '@/lib/types'
import { logger } from '@/lib/logger'

export function useOrders() {
  const [jobs, setJobs] = React.useState<Job[]>([])
  const [loading, setLoading] = React.useState(true)        // first load only
  const [isFetching, setIsFetching] = React.useState(false) // manual refresh spinner
  const [error, setError] = React.useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null)

  const refresh = React.useCallback(async (showSpinner = false) => {
    if (showSpinner && jobs.length === 0) setLoading(true)
    else setIsFetching(true)

    setError(null)
    try {
      const data = await Api.getOrders()
      setJobs(data)
      setLastUpdated(new Date())
      logger.info('orders.refresh.success', { count: data?.length })
    } catch (e: any) {
      setError(e?.message || 'Failed to load orders')
      logger.error('orders.refresh.error', { error: e?.message })
    } finally {
      setLoading(false)
      setIsFetching(false)
    }
  }, [jobs.length])

  // initial load once
  React.useEffect(() => { refresh(true) }, [refresh])

  return { jobs, loading, isFetching, error, refresh, lastUpdated }
}
