// hooks/useJobStatus.ts
'use client'
import * as React from 'react'
import { Api } from '@/lib/api'
import { logger } from '@/lib/logger'

export type JobStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED'
export interface JobInfo {
  request_id: string
  status: JobStatus
  error_msg?: string | null
  created_at?: string | null
  completed_at?: string | null
}

export function useJobStatus(requestId?: string) {
  const [job, setJob] = React.useState<JobInfo | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = React.useState<number | null>(null)

  const refresh = React.useCallback(async () => {
    if (!requestId) return
    try {
      setLoading(true); setError(null)
      const data = await Api.getJobStatus(requestId) as JobInfo
      setJob(data)
      setLastUpdated(Date.now())
      logger.info('job.status.refresh', { request_id: requestId, status: data?.status })
    } catch (e: any) {
      const msg = e?.message || 'Failed to load job status'
      setError(msg)
      logger.error('job.status.error', { request_id: requestId, error: msg })
    } finally {
      setLoading(false)
    }
  }, [requestId])

  React.useEffect(() => { if (requestId) { void refresh() } }, [requestId, refresh])
  return { job, loading, error, lastUpdated, refresh }
}
