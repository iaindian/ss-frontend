// components/MobileSidebar.tsx
'use client'

import * as React from 'react'
import Link from 'next/link'
import { X, LogOut } from 'lucide-react'
import { logger } from '@/lib/logger'
import { clsxx } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

type NavItem = {
  label: string
  href?: string
  onClick?: () => void | Promise<void>
}

export default function MobileSidebar({
  open,
  onClose,
  authed,
}: {
  open: boolean
  onClose: () => void
  authed: boolean
}) {
  // Close on ESC
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Prevent body scroll when open
  React.useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  // Your base route objects
  const itemsLoggedOut: NavItem[] = [
    { href: '/', label: 'Packs' },
    { href: '/support', label: 'Support' },
    { href: '/tutorial', label: 'Tutorial' },
    { href: '/login', label: 'Login' },
  ]

  const itemsLoggedInBase: NavItem[] = [
    { href: '/', label: 'Packs' },
    { href: '/attributes', label: 'Attributes' },
    { href: '/orders', label: 'Orders' },
    { href: '/support', label: 'Support' },
    { href: '/tutorial', label: 'Tutorial' },
  ]

  // Append Logout to logged-in routes, as an object in the same list
  const items: NavItem[] = authed
    ? [
        ...itemsLoggedInBase,
        {
          label: 'Logout',
          onClick: async () => {
            logger.info('nav.logout.click')
            await supabase.auth.signOut()
            onClose()
          },
        },
      ]
    : itemsLoggedOut

  return (
    <>
      {/* overlay */}
      <div
        aria-hidden
        className={clsxx(
          'fixed inset-0 z-50 bg-black/50 transition-opacity md:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => {
          logger.info('mobile-sidebar.overlay')
          onClose()
        }}
      />
      {/* drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={clsxx(
          'fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-card p-4 shadow-xl transition-transform md:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary shadow-neon" />
            <span className="text-sm font-semibold">AI Image Pack</span>
          </div>
          <button
            onClick={() => { logger.info('mobile-sidebar.close'); onClose() }}
            className="rounded-lg p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="space-y-1">
          {items.map((it) =>
            it.href ? (
              <Link
                key={it.label + it.href}
                href={it.href}
                className="block rounded-xl px-3 py-2 text-sm hover:bg-muted"
                onClick={() => {
                  logger.info('mobile-sidebar.link', { href: it.href })
                  onClose()
                }}
              >
                {it.label}
              </Link>
            ) : (
              <button
                key={it.label}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-muted"
                onClick={() => it.onClick?.()}
              >
                <LogOut className="h-4 w-4" />
                {it.label}
              </button>
            )
          )}
        </nav>
      </aside>
    </>
  )
}
