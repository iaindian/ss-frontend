// hooks/useOrders.ts
'use client'
import * as React from 'react'
import { Api } from '@/lib/api'
import { logger } from '@/lib/logger'

export type OrderListItem = {
  id: string
  created_at?: string
  pack_title?: string
  amount_cents?: number
  currency?: string
  status?: string                // PAID | REQUIRES_PAYMENT | FAILED | REFUNDED
  job_request_id?: string | null
  checkout_url?: string | null   // hosted checkout link if available
}

export function useOrders() {
  const [orders, setOrders] = React.useState<OrderListItem[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)

  const refresh = React.useCallback(async () => {
    try {
      setError(null); setLoading(true)
      const res = await Api.getOrders()
      const items: OrderListItem[] = (res?.items || res || []).map((o: any) => ({
        id: o.id,
        created_at: o.created_at,
        pack_title: o.pack_title || o.pack?.title,
        amount_cents: o.amount_cents,
        currency: o.currency,
        status: o.status,
        job_request_id: o.job_request_id,
        // if you also return client_secret sometimes, hide checkout_url in that case
        checkout_url: o.client_secret ? null : o.checkout_url ?? null,
      }))
      setOrders(items)
      logger.info('orders.loaded', { count: items.length })
    } catch (e: any) {
      const msg = e?.message || 'Failed to load orders'
      setError(msg)
      logger.error('orders.load.failed', { error: msg })
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => { void refresh() }, [refresh])

  return { orders, loading, error, refresh }
}
