// // components/OrderRow.tsx
// 'use client'
// import * as React from 'react'
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import { PaymentStatusBadge } from './PaymentStatusBadge'
// import { JobStatusBadge } from './JobStatusBadge'
// import { useJobStatus } from '@/hooks/useJobStatus'
// import { useGallery } from '@/hooks/useGallery'
// import { RefreshCw, ExternalLink, Download, Images } from 'lucide-react'
// import { logger } from '@/lib/logger'

// type Order = {
//   id: string
//   created_at?: string
//   pack_title?: string
//   amount_cents?: number
//   currency?: string
//   status?: string                         // PAID | REQUIRES_PAYMENT | FAILED | REFUNDED
//   job_request_id?: string | null
//   checkout_url?: string | null
// }

// function cents(amount?: number, currency = 'USD') {
//   if (amount == null) return '—'
//   return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format((amount || 0) / 100)
// }

// export function OrderRow({ order }: { order: Order }) {
//     // console.log(order)
//   const payState = (order.status || '').toUpperCase()
//   const canPayNow = (payState === 'REQUIRES_PAYMENT' || payState === 'FAILED') && !!order.checkout_url
// //   console.log(order.status,"canPayNow is: ",canPayNow," for order id: ",order.id, "checkout irl is:",order.checkout_url)

//   const { job, loading: jobLoading, error: jobError, lastUpdated, refresh: refreshJob } =
//     useJobStatus(order.job_request_id || undefined)

//   // Load gallery lazily when user clicks “Preview”
//   const [showGallery, setShowGallery] = React.useState(false)
//   const { data: gallery, loading: galLoading, error: galError, refresh: refreshGallery } =
//     useGallery(order.job_request_id || undefined, showGallery)

//   React.useEffect(() => {
//     if (showGallery && order.job_request_id) {
//       void refreshGallery()
//     }
//   }, [showGallery, order.job_request_id, refreshGallery])

//   const onPayNow = () => {
//     if (order.checkout_url) {
//       logger.info('orders.pay_now', { order_id: order.id })
//       window.location.href = order.checkout_url
//     }
//   }

//   const onDownloadImage = (url: string) => {
//     try {
//       const a = document.createElement('a')
//       a.href = url
//       a.download = '' // let browser infer filename
//       document.body.appendChild(a)
//       a.click()
//       a.remove()
//       logger.info('orders.download.single', { order_id: order.id, url })
//     } catch (e: any) {
//       logger.error('orders.download.single.error', { error: e?.message })
//       alert('Failed to trigger download')
//     }
//   }

//   const onCopyAll = async () => {
//     const urls = gallery?.images?.map(i => i.url).filter(Boolean) || []
//     if (!urls.length) return
//     try {
//       await navigator.clipboard.writeText(urls.join('\n'))
//       logger.info('orders.copy.links', { order_id: order.id, count: urls.length })
//       alert('Copied all image links to clipboard.')
//     } catch (e: any) {
//       logger.error('orders.copy.links.error', { error: e?.message })
//       alert('Failed to copy links.')
//     }
//   }

//   return (
//     <div className="rounded-xl border border-border bg-card p-4">
//       {/* Top row */}
//       <div className="flex items-center justify-between gap-3">
//         <div className="min-w-0">
//           <div className="font-medium truncate">
//             Order #{order.id.slice(0, 8)} — {order.pack_title || 'Pack'}
//           </div>
//           <div className="text-xs text-foreground/60">
//             {order.created_at ? new Date(order.created_at).toLocaleString() : '—'} • {cents(order.amount_cents, order.currency)}
//           </div>
//           {jobError ? <div className="mt-1 text-xs text-red-500">{jobError}</div> : null}
//         </div>

//         <div className="flex items-center gap-2">
//           {/* Payment status + Pay now */}
//           <PaymentStatusBadge status={order.status} />
//           {canPayNow && (
//             <Button size="sm" onClick={onPayNow} className="ml-1">
//               Pay now
//             </Button>
//           )}

//           {/* Job status + manual refresh */}
//           <JobStatusBadge status={job?.status} />
//           <Button variant="outline" size="icon" onClick={refreshJob} disabled={jobLoading} title="Refresh job">
//             <RefreshCw className={jobLoading ? 'animate-spin' : ''} size={16} />
//           </Button>

//           {job?.status === 'COMPLETED' && job?.request_id && (
//             <Link
//               href={`/gallery/${job.request_id}`}
//               className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted"
//               title="Open gallery page"
//             >
//               <ExternalLink size={14} /> View
//             </Link>
//           )}

//           <div className="ml-2 text-[10px] text-foreground/50">
//             {lastUpdated ? `Updated ${new Date(lastUpdated).toLocaleTimeString()}` : ''}
//           </div>
//         </div>
//       </div>

//       {/* Completed: inline preview + actions */}
//       {job?.status === 'COMPLETED' && (
//         <div className="mt-3 space-y-2">
//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setShowGallery((s) => !s)}
//               title="Toggle inline preview"
//             >
//               <Images size={16} className="mr-1" />
//               {showGallery ? 'Hide preview' : 'Preview here'}
//             </Button>

//             {showGallery && (
//               <>
//                 <Button variant="outline" size="sm" onClick={refreshGallery} disabled={galLoading}>
//                   <RefreshCw className={galLoading ? 'animate-spin' : ''} size={16} />
//                   <span className="ml-1">Refresh images</span>
//                 </Button>
//                 <Button variant="outline" size="sm" onClick={onCopyAll}>
//                   Copy all links
//                 </Button>
//               </>
//             )}
//           </div>

//           {showGallery && (
//             <div className="rounded-lg border border-border p-2">
//               {galError && <div className="text-xs text-red-500">{galError}</div>}
//               {!galError && (
//                 <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
//                   {(gallery?.images || []).map((img, i) => (
//                     <div key={i} className="relative aspect-square overflow-hidden rounded-md">
//                       <img
//                         src={img.url}
//                         alt={`gen ${i+1}`}
//                         className="h-full w-full object-cover"
//                         loading="lazy"
//                         onClick={() => onDownloadImage(img.url)}
//                         title="Click to download"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               )}
//               {(!gallery?.images || gallery.images.length === 0) && !galLoading && (
//                 <div className="p-2 text-xs opacity-70">No images yet.</div>
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }


// components/OrderRow.tsx
'use client'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { PaymentStatusBadge } from './PaymentStatusBadge'
import { JobStatusBadge } from './JobStatusBadge'
import { useJobStatus } from '@/hooks/useJobStatus'
import { useGallery } from '@/hooks/useGallery'
import { RefreshCw, Download, Images, CreditCard } from 'lucide-react'
import { logger } from '@/lib/logger'
import { downloadZip } from '@/lib/zip'
import { Api } from '@/lib/api'

type Order = {
  id: string
  created_at?: string
  pack_title?: string
  amount_cents?: number
  currency?: string
  status?: string                         // PAID | REQUIRES_PAYMENT | FAILED | REFUNDED
  job_request_id?: string | null
  checkout_url?: string | null
}

function cents(amount?: number, currency = 'USD') {
  if (amount == null) return '—'
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format((amount || 0) / 100)
}

export function OrderRow({ order }: { order: Order }) {
  const payState = (order.status || '').toUpperCase()
  const canPayNow = (payState === 'REQUIRES_PAYMENT' || payState === 'FAILED') && !!order.checkout_url

  const { job, loading: jobLoading, error: jobError, lastUpdated, refresh: refreshJob } =
    useJobStatus(order.job_request_id || undefined)

  // Preview stays lazy & optional
  const [showGallery, setShowGallery] = React.useState(false)
  const { data: gallery, loading: galLoading, error: galError, refresh: refreshGallery } =
    useGallery(order.job_request_id || undefined, showGallery)

  React.useEffect(() => {
    if (showGallery && order.job_request_id) {
      void refreshGallery()
    }
  }, [showGallery, order.job_request_id, refreshGallery])

  const onPayNow = () => {
    if (!order.checkout_url) return
    logger.info('orders.pay_now', { order_id: order.id })
    window.location.href = order.checkout_url
  }

  // ⬇️ NEW: ZIP is independent — fetch gallery on-demand right here
  const [zipBusy, setZipBusy] = React.useState(false)
  const [zipProgress, setZipProgress] = React.useState<{loaded: number; total: number} | null>(null)

  const onDownloadZip = async () => {
    try {
      const requestId = order.job_request_id
      if (!requestId) {
        alert('No job attached to this order yet.')
        return
      }
      setZipBusy(true)
      setZipProgress(null)

      // Fetch gallery directly (don’t depend on preview being open)
      const res = await Api.getGallery(requestId) as { images?: { url: string }[] }
      const urls = (res?.images || []).map(i => i.url).filter(Boolean)
      if (!urls.length) {
        alert('No images to download yet.')
        return
      }

      setZipProgress({ loaded: 0, total: urls.length })
      await downloadZip(urls, `order_${order.id.slice(0,8)}.zip`, setZipProgress)
      logger.info('orders.download.zip.ok', { order_id: order.id, count: urls.length })
    } catch (e: any) {
      logger.error('orders.download.zip.error', { error: e?.message })
      alert('Failed to create ZIP.')
    } finally {
      setZipBusy(false)
      setZipProgress(null)
    }
  }

  const onDownloadImage = (url: string) => {
    try {
      const a = document.createElement('a')
      a.href = url
      a.download = '' // infer
      document.body.appendChild(a)
      a.click()
      a.remove()
      logger.info('orders.download.single', { order_id: order.id, url })
    } catch (e: any) {
      logger.error('orders.download.single.error', { error: e?.message })
      alert('Failed to trigger download')
    }
  }

  const onCopyAll = async () => {
    const urls = gallery?.images?.map(i => i.url).filter(Boolean) || []
    if (!urls.length) return
    try {
      await navigator.clipboard.writeText(urls.join('\n'))
      logger.info('orders.copy.links', { order_id: order.id, count: urls.length })
      alert('Copied all image links to clipboard.')
    } catch (e: any) {
      logger.error('orders.copy.links.error', { error: e?.message })
      alert('Failed to copy links.')
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      {/* Top row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium truncate">
            Order #{order.id.slice(0, 8)} — {order.pack_title || 'Pack'}
          </div>
          <div className="text-xs text-foreground/60">
            {order.created_at ? new Date(order.created_at).toLocaleString() : '—'} • {cents(order.amount_cents, order.currency)}
          </div>
          {jobError ? <div className="mt-1 text-xs text-red-500">{jobError}</div> : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Payment status + Pay now */}
          <PaymentStatusBadge status={order.status} />
          {canPayNow && (
            <Button size="sm" onClick={onPayNow}>
              <CreditCard size={16} className="mr-1" />
              Pay now
            </Button>
          )}

          {/* Job status + manual refresh */}
          <JobStatusBadge status={job?.status} />
          <Button variant="outline" size="icon" onClick={refreshJob} disabled={jobLoading} title="Refresh job">
            <RefreshCw className={jobLoading ? 'animate-spin' : ''} size={16} />
          </Button>

          {/* ✅ Independent ZIP download (only when completed) */}
          {job?.status === 'COMPLETED' && (
            <Button size="sm" onClick={onDownloadZip} disabled={zipBusy} title="Download all images as ZIP">
              <Download size={16} className={zipBusy ? 'animate-pulse' : ''} />
              <span className="ml-1">
                {zipBusy && zipProgress
                  ? `Zipping ${zipProgress.loaded}/${zipProgress.total}…`
                  : 'Download as ZIP'}
              </span>
            </Button>
          )}

          <div className="text-[10px] text-foreground/50">
            {lastUpdated ? `Updated ${new Date(lastUpdated).toLocaleTimeString()}` : ''}
          </div>
        </div>
      </div>

      {/* Completed: optional inline preview + actions */}
      {job?.status === 'COMPLETED' && (
        <div className="mt-3 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGallery((s) => !s)}
              title="Toggle inline preview"
            >
              <Images size={16} className="mr-1" />
              {showGallery ? 'Hide preview' : 'Preview here'}
            </Button>

            {showGallery && (
              <>
                <Button variant="outline" size="sm" onClick={refreshGallery} disabled={galLoading}>
                  <RefreshCw className={galLoading ? 'animate-spin' : ''} size={16} />
                  <span className="ml-1">Refresh images</span>
                </Button>
                <Button variant="outline" size="sm" onClick={onCopyAll}>
                  Copy all links
                </Button>
              </>
            )}
          </div>

          {showGallery && (
            <div className="rounded-lg border border-border p-2">
              {galError && <div className="text-xs text-red-500">{galError}</div>}
              {!galError && (
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {(gallery?.images || []).map((img, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-md">
                      <img
                        src={img.url}
                        alt={`gen ${i+1}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onClick={() => onDownloadImage(img.url)}
                        title="Click to download"
                      />
                    </div>
                  ))}
                </div>
              )}
              {(!gallery?.images || gallery.images.length === 0) && !galLoading && (
                <div className="p-2 text-xs opacity-70">No images yet.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
