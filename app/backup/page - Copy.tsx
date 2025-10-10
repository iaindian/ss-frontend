// app/(main)/packs/[slug]/page.tsx
'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAttributes } from '@/hooks/useAttributes'
import { Api } from '@/lib/api'
import type { Pack } from '@/lib/types'
import { logger } from '@/lib/logger'
import { cents } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ErrorView } from '@/components/ErrorView'
import { PackGallery } from '@/components/PackGallery'
import { SocialPreviewDialog } from '@/components/SocialPreview'
import { getStripe } from '@/lib/stripe'
import Link from 'next/link'

export default function PackDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const { hasAttributes } = useAttributes()
  const [pack, setPack] = React.useState<Pack | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [buying, setBuying] = React.useState(false)

  React.useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setError(null); setLoading(true)
        // Try dedicated endpoint first; fallback to list
        try {
          const p = await Api.getPack?.(slug) // optional
          if (mounted) setPack(p)
        } catch {
          const list: Pack[] = await Api.getPacks()
          const p = list.find((x) => x.slug === slug || x.id === slug) || null
          if (!p) throw new Error('Pack not found')
          if (mounted) setPack(p)
        }
        logger.info('pack.detail.loaded', { slug })
      } catch (e: any) {
        setError(e?.message || 'Failed to load pack')
        logger.error('pack.detail.error', { slug, error: e?.message })
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [slug])

  async function handleGenerateGuarded() {
  if (!hasAttributes) {
    alert('Please complete your attributes first. Redirecting…')
    router.push('/attributes?required=1')
    return
  }
  await handleGenerate()
  }

  async function handleGenerate() {
    if (!pack) return
    setBuying(true)
    try {
      const res: any = await Api.createOrder({ pack_id: pack.id })
      logger.info('order.created', { order_id: res?.id, pack_id: pack.id })
      if (res?.checkout_url) {
        window.location.href = res.checkout_url
        return
      }
      if (res?.client_secret) {
        const stripe = await getStripe()
        if (!stripe) throw new Error('Stripe not configured')
        const { error } = await stripe.confirmCardPayment(res.client_secret)
        if (error) throw error
      }
      router.push('/orders')
    } catch (e: any) {
      logger.error('order.create.failed', { error: e?.message })
      alert(e?.message || 'Failed to create order')
    } finally {
      setBuying(false)
    }
  }

  if (loading) return <div className="p-6">Loading pack…</div>
  if (error || !pack) return <ErrorView description={error || 'Not found'} />

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* LEFT: Hero / details */}
      <div className="md:col-span-2 space-y-4">
        <div className="rounded-2xl border border-border bg-card p-3">
          <PackGallery images={pack.preview_images || []} />
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-semibold">{pack.title}</h1>
            <span className="text-xs uppercase text-foreground/60">{pack.category}</span>
          </div>
          {pack.description ? (
            <p className="text-sm opacity-90">{pack.description}</p>
          ) : (
            <p className="text-sm opacity-60">
              A curated style pack. See previews above.{' '}
              <Link href="/" className="underline">Back to all packs</Link>
            </p>
          )}
        </div>
      </div>

      {/* RIGHT: Sticky CTA */}
      <div className="md:col-span-1">
        <div className="sticky top-20 space-y-3">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="text-sm opacity-70 mb-1">Price</div>
            <div className="text-xl font-semibold">{cents(pack.price_cents, pack.currency)}</div>
            <div className="mt-4 grid gap-2">
              <Button onClick={handleGenerateGuarded} loading={buying}>Generate This Pack</Button>
              <Button variant="outline" onClick={() => setPreviewOpen(true)}>Preview on Social</Button>
            </div>
            <div className="mt-3 text-xs opacity-70">
              New users get <strong>3 free credits</strong> on first login.
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 text-xs opacity-70">
            <div className="font-medium mb-1">What you get</div>
            <ul className="list-disc pl-4 space-y-1">
              <li>High-res images in ZIP</li>
              <li>Email when ready</li>
              <li>License for personal sharing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Social preview dialog */}
      <SocialPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        images={pack.preview_images || []}
        title={pack.title}
      />
    </div>
  )
}
