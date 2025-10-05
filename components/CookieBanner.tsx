'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const KEY = 'cookie-consent.v1'

export function CookieBanner({ className }: { className?: string }) {
  const [show, setShow] = React.useState(false)

  React.useEffect(() => {
    try {
      const val = localStorage.getItem(KEY)
      if (!val) setShow(true)
    } catch { /* ignore */ }
  }, [])

  function setConsent(value: 'accepted' | 'declined') {
    try {
      localStorage.setItem(KEY, value)
      // optional cookie for server read (expires ~6 months)
      document.cookie = `cookie_consent=${value}; Max-Age=${60*60*24*180}; Path=/; SameSite=Lax`
    } catch { /* ignore */ }
    setShow(false)
  }

  if (!show) return null

  return (
    <div className={cn('fixed inset-x-0 bottom-3 z-50 px-3', className)}>
      <Card className="mx-auto max-w-3xl bg-card/90 backdrop-blur border border-border/70 shadow-[0_0_20px_rgba(16,185,129,0.12)]">
        <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-foreground/90">
            We use cookies only for essential functionality and to improve your experience. See our{' '}
            <Link href="/legal/privacy" className="underline">Privacy Policy</Link>.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setConsent('declined')}>Decline</Button>
            <Button onClick={() => setConsent('accepted')}>Accept</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
