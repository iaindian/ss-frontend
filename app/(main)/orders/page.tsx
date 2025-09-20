// app/(main)/orders/page.tsx
'use client'
import { useOrders } from '@/hooks/useOrders'
import { OrdersTable } from '@/components/OrdersTable'
import { ErrorView } from '@/components/ErrorView'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'

export default function OrdersPage() {
  const { jobs, loading, isFetching, error, refresh, lastUpdated } = useOrders()

  if (loading) return <div>Loading orders…</div>
  if (error) return <ErrorView description={error} />

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your Orders</h1>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <div className="text-xs opacity-60">
              Updated {lastUpdated.toLocaleTimeString()}
            </div>
          )}
          <Button
            variant="outline"
            loading={isFetching}
            onClick={() => refresh(true)}
            aria-label="Refresh orders"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <OrdersTable jobs={jobs} onRefresh={() => refresh(true)} />
    </div>
  )
}
