// app/(main)/support/page.tsx
'use client'
import * as React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/logger'
import { Input } from '@/components/ui/input'

type OrderLite = { id: string; created_at?: string; pack_title?: string }
type Ticket = { id: string; created_at?: string; order_id?: string; message?: string; status?: string }

export default function SupportPage() {
  const { me, loading } = useAuth()

  // form state
  const [orders, setOrders] = React.useState<OrderLite[]>([])
  const [orderId, setOrderId] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [cap, setCap] = React.useState<{a:number;b:number;ts:number;sig:string} | null>(null)
  const [answer, setAnswer] = React.useState('')
  const [formError, setFormError] = React.useState<string | null>(null)
  const [captchaError, setCaptchaError] = React.useState<string | null>(null)
  const [formSuccess, setFormSuccess] = React.useState<string | null>(null)
  const maxLen = 800

  // tickets state
  const INITIAL_LIMIT = 2
  const PAGE_SIZE = 5
  const [tickets, setTickets] = React.useState<Ticket[]>([])
  const [hasMore, setHasMore] = React.useState(true)
  const [loadingTickets, setLoadingTickets] = React.useState(false)
  const [offset, setOffset] = React.useState(0)

  React.useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        // your existing orders fetch
        const res = await Api.getOrders()
        const items = (res?.items || res || []).map((o:any) => ({
          id: o.id,
          created_at: o.created_at,
          pack_title: o.pack_title || o.pack?.title
        }))
        if (alive) setOrders(items)
      } catch (e:any) {
        logger.error('support.load.orders.failed', { error: e?.message })
      }
    })()
    return () => { alive = false }
  }, [])

  async function refreshCaptcha() {
    try {
      const c = await Api.getSupportCaptcha()
      setCap(c)
      setAnswer('')
      setCaptchaError(null)
    } catch (e:any) {
      logger.error('support.captcha.failed', { error: e?.message })
    }
  }
  React.useEffect(() => { refreshCaptcha() }, [])

  // ---- Tickets fetchers ----
  const loadInitialTickets = React.useCallback(async () => {
    setLoadingTickets(true)
    try {
      const res = await Api.getSupportTickets(INITIAL_LIMIT, 0)
      const items = res?.items || []
      setTickets(items)
      setOffset(items.length)
      setHasMore(items.length >= INITIAL_LIMIT) // if less than initial, nothing more
    } catch (e:any) {
      logger.error('support.tickets.initial.failed', { error: e?.message })
    } finally {
      setLoadingTickets(false)
    }
  }, [])

  const loadMoreTickets = React.useCallback(async () => {
    if (!hasMore || loadingTickets) return
    setLoadingTickets(true)
    try {
      const res = await Api.getSupportTickets(PAGE_SIZE, offset)
      const items = res?.items || []
      setTickets(prev => [...prev, ...items])
      setOffset(prev => prev + items.length)
      if (items.length < PAGE_SIZE) setHasMore(false)
    } catch (e:any) {
      logger.error('support.tickets.more.failed', { error: e?.message })
    } finally {
      setLoadingTickets(false)
    }
  }, [hasMore, loadingTickets, offset])

  React.useEffect(() => { loadInitialTickets() }, [loadInitialTickets])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(null)
    setCaptchaError(null)

    if (!me) {
      alert('Please login to submit a support request.')
      window.location.href = '/login'
      return
    }
    if (!orderId) return setFormError('Please select an order.')
    if (message.trim().length < 10) return setFormError('Message is too short (min 10 characters).')
    if (!cap) return setFormError('Captcha not loaded. Click “New” and try again.')

    const numeric = Number(answer)
    if (!answer.trim() || !Number.isFinite(numeric)) {
      setCaptchaError('Please solve the captcha.')
      document.getElementById('captcha-answer')?.focus()
      return
    }

    try {
      setBusy(true)
      await Api.submitSupport({
        order_id: orderId,
        message,
        a: cap.a, b: cap.b, ts: cap.ts, sig: cap.sig, answer: numeric,
      })
      setFormSuccess('Thanks! Your ticket was submitted.')
      setMessage('')
      setAnswer('')
      await refreshCaptcha()
      // refresh tickets to show the latest on top
      setTickets([])
      setOffset(0)
      setHasMore(true)
      await loadInitialTickets()
    } catch (e:any) {
      const msg = e?.message || 'Submission failed'
      setFormError(msg)
      logger.error('support.submit.failed', { error: msg })
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <div className="p-4">Loading…</div>
  if (!me) return <div className="p-4">Please sign in to contact support.</div>

  return (
    <div className="max-w-2xl space-y-6">
      <div className="prose prose-invert">
        <h1>Support</h1>
        <p>We only accept requests linked to an existing order. Describe your issue briefly and we’ll get back ASAP.</p>
      </div>

      {/* Submit form */}
      <Card className="backdrop-blur bg-card/80">
        <CardHeader>
          <CardTitle>Submit a request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {formError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                {formSuccess}
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm opacity-80">Order</label>
              <select
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full rounded-lg bg-muted/40 px-3 py-2 outline-none ring-1 ring-border focus:ring-primary"
              >
                <option value="">Select one…</option>
                {orders.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.pack_title ? `${o.pack_title} — ` : ''}{o.id.slice(0,8)}… ({new Date(o.created_at || '').toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm opacity-80">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                maxLength={maxLen}
                placeholder="What went wrong? Be specific."
                className="w-full resize-y rounded-lg bg-muted/40 px-3 py-2 outline-none ring-1 ring-border focus:ring-primary"
              />
              <div className="mt-1 text-right text-xs opacity-60">{message.length}/{maxLen}</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted/40 px-3 py-2 text-sm">
                {cap ? <>Solve: <b>{cap.a} + {cap.b} = ?</b></> : 'Loading captcha…'}
              </div>
              <Input
                id="captcha-answer"
                value={answer}
                onChange={(e) => { 
                  setAnswer(e.target.value.replace(/[^0-9]/g, ''))
                  setCaptchaError(null)
                }}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Answer"
                className="w-28"
                aria-invalid={!!captchaError}
                aria-describedby={captchaError ? 'captcha-error' : undefined}
              />
              <Button type="button" variant="secondary" onClick={refreshCaptcha}>
                New
              </Button>
            </div>
            {captchaError && (
              <div id="captcha-error" className="text-xs text-red-300">
                {captchaError}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-xs opacity-60">
                We’ll notify you by email. Submissions are rate-limited.
              </div>
              <Button disabled={busy || !cap || !orderId || message.trim().length < 10 || !answer.trim()}>
                {busy ? 'Submitting…' : 'Submit'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tickets history */}
      <Card className="backdrop-blur bg-card/80">
        <CardHeader>
          <CardTitle>Your recent tickets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tickets.length === 0 && !loadingTickets && (
            <div className="text-sm opacity-70">No tickets yet.</div>
          )}

          <div className="space-y-2">
            {tickets.map(t => (
              <details key={t.id} className="group rounded-lg border border-border/60 bg-muted/20">
                <summary className="cursor-pointer list-none px-3 py-2 text-sm flex items-center justify-between">
                  <span className="flex-1">
                    <span className="opacity-70">{new Date(t.created_at || '').toLocaleString()}</span>
                    <span className="mx-2">•</span>
                    <span className="uppercase text-xs opacity-80">{t.status || 'OPEN'}</span>
                    {t.order_id && <span className="mx-2 text-xs opacity-60">Order {t.order_id.slice(0,8)}…</span>}
                  </span>
                  <span className="opacity-70 group-open:hidden">Show</span>
                  <span className="opacity-70 hidden group-open:inline">Hide</span>
                </summary>
                <div className="px-3 pb-3 text-sm opacity-90 whitespace-pre-wrap">
                  {t.message}
                </div>
              </details>
            ))}
          </div>

          {(hasMore || loadingTickets) && (
            <div className="pt-2">
              <Button
                variant="outline"
                onClick={loadMoreTickets}
                disabled={loadingTickets || !hasMore}
              >
                {loadingTickets ? 'Loading…' : hasMore ? 'Load more' : 'No more'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
