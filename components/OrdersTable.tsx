// components/OrdersTable.tsx
'use client'
import * as React from 'react'
import { Table, THead, TH, TRow, TD } from './ui/table'
import { Button } from './ui/button'
import { StatusBadge } from './StatusBadge'
import type { Job } from '@/lib/types'
import { logger } from '@/lib/logger'

export function OrdersTable({ jobs, onRefresh }: { jobs: Job[]; onRefresh: () => void }) {
  React.useEffect(() => { logger.debug('OrdersTable mount', { count: jobs?.length }) }, [jobs])

  return (
    <div className="space-y-3">
      <div className="text-sm opacity-80">{jobs.length} orders</div>

      {/* Mobile: card list */}
      <div className="space-y-3 md:hidden">
        {jobs.map((j) => (
          <div key={j.id} className="rounded-2xl border border-border bg-card p-3">
            <div className="mb-1 flex items-center justify-between gap-2">
              <div className="text-base font-semibold leading-tight break-words">
                {j.pack_title || j.pack_id}
              </div>
              <div className="shrink-0"><StatusBadge status={j.status} /></div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              {j.download_url && (
                <a
                  className="rounded-lg border border-border px-3 py-1 text-sm underline"
                  href={j.download_url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => logger.info('Download click', { job_id: j.id })}
                >
                  Download ZIP
                </a>
              )}
              {j.receipt_url && (
                <a
                  className="rounded-lg border border-border px-3 py-1 text-sm underline"
                  href={j.receipt_url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => logger.info('Receipt click', { job_id: j.id })}
                >
                  Receipt
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block">
        <Table>
          <THead>
            <TRow>
              <TH>Pack</TH>
              <TH>Status</TH>
              <TH>Actions</TH>
            </TRow>
          </THead>
          <tbody>
            {jobs.map((j) => (
              <TRow key={j.id}>
                <TD className="whitespace-pre-wrap">{j.pack_title || j.pack_id}</TD>
                <TD><StatusBadge status={j.status} /></TD>
                <TD>
                  <div className="flex flex-wrap gap-2">
                    {j.download_url && (
                      <a
                        className="rounded-lg border border-border px-3 py-1 text-sm underline"
                        href={j.download_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => logger.info('Download click', { job_id: j.id })}
                      >
                        Download ZIP
                      </a>
                    )}
                    {j.receipt_url && (
                      <a
                        className="rounded-lg border border-border px-3 py-1 text-sm underline"
                        href={j.receipt_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => logger.info('Receipt click', { job_id: j.id })}
                      >
                        Receipt
                      </a>
                    )}
                  </div>
                </TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="pt-2">
        <Button variant="outline" onClick={onRefresh}>Refresh</Button>
      </div>
    </div>
  )
}
