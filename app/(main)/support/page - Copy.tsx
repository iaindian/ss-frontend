// // app/(main)/support/page.tsx
// 'use client'
// import * as React from 'react'
// import { useAuth } from '@/hooks/useAuth'
// import { Api } from '@/lib/api'
// import { ErrorView } from '@/components/ErrorView'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { logger } from '@/lib/logger'
// import { Input } from '@/components/ui/input'

// type OrderLite = { id: string; created_at?: string; pack_title?: string }

// export default function SupportPage() {
//   const { me, loading } = useAuth()
//   const [orders, setOrders] = React.useState<OrderLite[]>([])
//   const [orderId, setOrderId] = React.useState('')
//   const [message, setMessage] = React.useState('')
//   const [busy, setBusy] = React.useState(false)
//   const [cap, setCap] = React.useState<{a:number;b:number;ts:number;sig:string} | null>(null)
//   const maxLen = 800

//   React.useEffect(() => {
//     let alive = true
//     ;(async () => {
//       try {
//         // keep it light—your /orders endpoint already exists
//         const res = await Api.getOrders()
//         const items = (res?.items || res || []).map((o:any) => ({
//           id: o.id,
//           created_at: o.created_at,
//           pack_title: o.pack_title || o.pack?.title
//         }))
//         if (alive) setOrders(items)
//       } catch (e:any) {
//         logger.error('support.load.orders.failed', { error: e?.message })
//       }
//     })()
//     return () => { alive = false }
//   }, [])

//   async function refreshCaptcha() {
//     try {
//       const c = await Api.getSupportCaptcha()
//       setCap(c)
//     } catch (e:any) {
//       logger.error('support.captcha.failed', { error: e?.message })
//     }
//   }

//   React.useEffect(() => { refreshCaptcha() }, [])

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault()
//     if (!me) {
//       alert('Please login to submit a support request.')
//       window.location.href = '/login'
//       return
//     }
//     if (!orderId) return alert('Please select an order.')
//     if (message.trim().length < 10) return alert('Message is too short.')
//     if (!cap) return alert('Captcha missing. Please refresh the page.')

//     const answer = cap.a + cap.b
//     try {
//       setBusy(true)
//       await Api.submitSupport({ order_id: orderId, message, a: cap.a, b: cap.b, ts: cap.ts, sig: cap.sig, answer })
//       alert('Thanks! Your ticket was submitted.')
//       setMessage('')
//       refreshCaptcha()
//     } catch (e:any) {
//       logger.error('support.submit.failed', { error: e?.message })
//       alert(e?.message || 'Submission failed')
//     } finally {
//       setBusy(false)
//     }
//   }

//   if (loading) return <div className="p-4">Loading…</div>
//   if (!me) return <div className="p-4">Please sign in to contact support.</div>

//   return (
//     <div className="max-w-2xl space-y-6">
//       <div className="prose prose-invert">
//         <h1>Support</h1>
//         <p>We only accept requests linked to an existing order. Describe your issue briefly and we’ll get back ASAP.</p>
//       </div>

//       <Card className="backdrop-blur bg-card/80">
//         <CardHeader>
//           <CardTitle>Submit a request</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={onSubmit} className="space-y-4">
//             <div>
//               <label className="mb-1 block text-sm opacity-80">Order</label>
//               <select
//                 value={orderId}
//                 onChange={(e) => setOrderId(e.target.value)}
//                 className="w-full rounded-lg bg-muted/40 px-3 py-2 outline-none ring-1 ring-border focus:ring-primary"
//               >
//                 <option value="">Select one…</option>
//                 {orders.map(o => (
//                   <option key={o.id} value={o.id}>
//                     {o.pack_title ? `${o.pack_title} — ` : ''}{o.id.slice(0,8)}… ({new Date(o.created_at || '').toLocaleDateString()})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="mb-1 block text-sm opacity-80">Message</label>
//               <textarea
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 rows={5}
//                 maxLength={maxLen}
//                 placeholder="What went wrong? Be specific."
//                 className="w-full resize-y rounded-lg bg-muted/40 px-3 py-2 outline-none ring-1 ring-border focus:ring-primary"
//               />
//               <div className="mt-1 text-right text-xs opacity-60">{message.length}/{maxLen}</div>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="rounded-lg bg-muted/40 px-3 py-2 text-sm">
//                 {cap ? <>Solve: <b>{cap.a} + {cap.b} = ?</b></> : 'Loading captcha…'}
//               </div>
//               <Button type="button" variant="secondary" onClick={refreshCaptcha}>New</Button>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="text-xs opacity-60">
//                 We’ll notify you by email. Submissions are rate-limited.
//               </div>
//               <Button disabled={busy || !cap || !orderId || message.trim().length < 10}>
//                 {busy ? 'Submitting…' : 'Submit'}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }



// app/(main)/support/page.tsx
// 'use client'
// import * as React from 'react'
// import { useAuth } from '@/hooks/useAuth'
// import { Api } from '@/lib/api'
// import { ErrorView } from '@/components/ErrorView'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { logger } from '@/lib/logger'
// import { Input } from '@/components/ui/input'

// type OrderLite = { id: string; created_at?: string; pack_title?: string }

// export default function SupportPage() {
//   const { me, loading } = useAuth()
//   const [orders, setOrders] = React.useState<OrderLite[]>([])
//   const [orderId, setOrderId] = React.useState('')
//   const [message, setMessage] = React.useState('')
//   const [busy, setBusy] = React.useState(false)

//   // 👇 keep captcha object from backend + a user-entered answer
//   const [cap, setCap] = React.useState<{ a:number; b:number; ts:number; sig:string } | null>(null)
//   const [answer, setAnswer] = React.useState('') // <- NEW

//   const maxLen = 800

//   React.useEffect(() => {
//     let alive = true
//     ;(async () => {
//       try {
//         const res = await Api.getOrders()
//         const items = (res?.items || res || []).map((o:any) => ({
//           id: o.id,
//           created_at: o.created_at,
//           pack_title: o.pack_title || o.pack?.title
//         }))
//         if (alive) setOrders(items)
//       } catch (e:any) {
//         logger.error('support.load.orders.failed', { error: e?.message })
//       }
//     })()
//     return () => { alive = false }
//   }, [])

//   async function refreshCaptcha() {
//     try {
//       const c = await Api.getSupportCaptcha()
//       setCap(c)
//       setAnswer('') // reset user input on new captcha
//     } catch (e:any) {
//       logger.error('support.captcha.failed', { error: e?.message })
//     }
//   }

//   React.useEffect(() => { refreshCaptcha() }, [])

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault()
//     if (!me) {
//       alert('Please login to submit a support request.')
//       window.location.href = '/login'
//       return
//     }
//     if (!orderId) return alert('Please select an order.')
//     if (message.trim().length < 10) return alert('Message is too short.')
//     if (!cap) return alert('Captcha missing. Please refresh.')
//     if (!answer.trim()) return alert('Please solve the captcha.')

//     try {
//       setBusy(true)
//       await Api.submitSupport({
//         order_id: orderId,
//         message,
//         a: cap.a,
//         b: cap.b,
//         ts: cap.ts,
//         sig: cap.sig,
//         // send numeric; backend will verify
//         answer: Number(answer)
//       })
//       alert('Thanks! Your ticket was submitted.')
//       setMessage('')
//       setAnswer('')
//       refreshCaptcha()
//     } catch (e:any) {
//       logger.error('support.submit.failed', { error: e?.message })
//       alert(e?.message || 'Submission failed')
//     } finally {
//       setBusy(false)
//     }
//   }

//   if (loading) return <div className="p-4">Loading…</div>
//   if (!me) return <div className="p-4">Please sign in to contact support.</div>

//   return (
//     <div className="max-w-2xl space-y-6">
//       <div className="prose prose-invert">
//         <h1>Support</h1>
//         <p>We only accept requests linked to an existing order. Describe your issue briefly and we’ll get back ASAP.</p>
//       </div>

//       <Card className="backdrop-blur bg-card/80">
//         <CardHeader>
//           <CardTitle>Submit a request</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={onSubmit} className="space-y-4">
//             <div>
//               <label className="mb-1 block text-sm opacity-80">Order</label>
//               <select
//                 value={orderId}
//                 onChange={(e) => setOrderId(e.target.value)}
//                 className="w-full rounded-lg bg-muted/40 px-3 py-2 outline-none ring-1 ring-border focus:ring-primary"
//               >
//                 <option value="">Select one…</option>
//                 {orders.map(o => (
//                   <option key={o.id} value={o.id}>
//                     {o.pack_title ? `${o.pack_title} — ` : ''}{o.id.slice(0,8)}… ({new Date(o.created_at || '').toLocaleDateString()})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="mb-1 block text-sm opacity-80">Message</label>
//               <textarea
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 rows={5}
//                 maxLength={maxLen}
//                 placeholder="What went wrong? Be specific."
//                 className="w-full resize-y rounded-lg bg-muted/40 px-3 py-2 outline-none ring-1 ring-border focus:ring-primary"
//               />
//               <div className="mt-1 text-right text-xs opacity-60">{message.length}/{maxLen}</div>
//             </div>

//             {/* Captcha row: prompt + input + refresh */}
//             <div className="flex flex-wrap items-center gap-3">
//               <div className="rounded-lg bg-muted/40 px-3 py-2 text-sm">
//                 {cap ? <>Solve: <b>{cap.a} + {cap.b} = ?</b></> : 'Loading captcha…'}
//               </div>

//               <Input
//                 value={answer}
//                 onChange={(e) => setAnswer(e.target.value.replace(/[^0-9]/g, ''))}
//                 inputMode="numeric"
//                 pattern="[0-9]*"
//                 placeholder="Answer"
//                 className="w-28"
//                 aria-label="Captcha answer"
//               />

//               <Button type="button" variant="secondary" onClick={refreshCaptcha}>
//                 New
//               </Button>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="text-xs opacity-60">
//                 We’ll notify you by email. Submissions are rate-limited.
//               </div>
//               <Button
//                 disabled={busy || !cap || !orderId || message.trim().length < 10 || !answer.trim()}
//               >
//                 {busy ? 'Submitting…' : 'Submit'}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }



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

export default function SupportPage() {
  const { me, loading } = useAuth()
  const [orders, setOrders] = React.useState<OrderLite[]>([])
  const [orderId, setOrderId] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [busy, setBusy] = React.useState(false)

  const [cap, setCap] = React.useState<{ a:number; b:number; ts:number; sig:string } | null>(null)
  const [answer, setAnswer] = React.useState('')

  // NEW: feedback
  const [formError, setFormError] = React.useState<string | null>(null)
  const [formSuccess, setFormSuccess] = React.useState<string | null>(null)
  const [captchaError, setCaptchaError] = React.useState<string | null>(null)

  const maxLen = 800

  React.useEffect(() => {
    let alive = true
    ;(async () => {
      try {
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
      setCaptchaError('Failed to load captcha. Please try again.')
    }
  }

  React.useEffect(() => { refreshCaptcha() }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(null)
    setCaptchaError(null)

    if (!me) {
      setFormError('Please sign in to submit a support request.')
      window.location.href = '/login'
      return
    }
    if (!orderId) return setFormError('Please select an order.')
    if (message.trim().length < 10) return setFormError('Message is too short (min 10 characters).')
    if (!cap) return setFormError('Captcha not loaded. Click “New” and try again.')
    if (!answer.trim()) return setCaptchaError('Please solve the captcha.')

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
        a: cap.a,
        b: cap.b,
        ts: cap.ts,
        sig: cap.sig,
        answer: Number(answer)
      })
      setFormSuccess('Thanks! Your ticket was submitted. We’ll email you soon.')
      setMessage('')
      setAnswer('')
      refreshCaptcha()
    } catch (e:any) {
      logger.error('support.submit.failed', { error: e?.message })
      setFormError(e?.message || 'Submission failed. Please try again.')
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

      <Card className="backdrop-blur bg-card/80">
        <CardHeader>
          <CardTitle>Submit a request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* banners */}
          {formError && (
            <div
              className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
              role="alert"
              aria-live="polite"
            >
              {formError}
            </div>
          )}
          {formSuccess && (
            <div
              className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300"
              role="status"
              aria-live="polite"
            >
              {formSuccess}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
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

            {/* Captcha row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-lg bg-muted/40 px-3 py-2 text-sm">
                {cap ? <>Solve: <b>{cap.a} + {cap.b} = ?</b></> : 'Loading captcha…'}
              </div>

              <div className="flex flex-col">
                <Input
                  value={answer}
                  id="captcha-answer"   
                  onChange={(e) => { setAnswer(e.target.value.replace(/[^0-9]/g, '')); setCaptchaError(null) }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Answer"
                  className="w-28"
                  aria-invalid={!!captchaError}
                  aria-describedby={captchaError ? 'captcha-error' : undefined}
                />
                {captchaError && (
                  <span id="captcha-error" className="mt-1 text-xs text-red-400">
                    {captchaError}
                  </span>
                )}
              </div>

              <Button type="button" variant="secondary" onClick={refreshCaptcha}>
                New
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs opacity-60">
                We’ll notify you by email. Submissions are rate-limited.
              </div>
              <Button
                disabled={busy || !cap || !orderId || message.trim().length < 10 }
              >
                {busy ? 'Submitting…' : 'Submit'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
