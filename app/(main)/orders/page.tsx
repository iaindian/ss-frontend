// app/(main)/orders/page.tsx
'use client'
import { useOrders } from '@/hooks/useOrders'
import { OrderRow } from '@/components/OrderRow'

export default function OrdersPage() {
  const { orders, loading, error, refresh } = useOrders()

  if (loading) return <div className="p-4">Loading orders…</div>
  if (error) return (
    <div className="p-4">
      <div className="mb-2 text-red-500">{error}</div>
      <button className="text-sm underline" onClick={refresh}>Try again</button>
    </div>
  )
  if (!orders.length) return (
    <div className="p-4 opacity-70">
      No orders yet.
      <button className="ml-2 text-sm underline" onClick={refresh}>Refresh</button>
    </div>
  )

  return (
    <div className="space-y-3">
      {orders.map((o) => <OrderRow key={o.id} order={o} />)}
    </div>
  )
}
