// components/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsxx } from '@/lib/utils'
import { logger } from '@/lib/logger'
import { supabase } from '@/lib/supabase'
import { LogOut } from 'lucide-react'
import * as React from 'react'

type Item = { href: string; label: string }

const itemsLoggedOut: Item[] = [
  { href: '/', label: 'Packs' },
  { href: '/support', label: 'Support' },
  { href: '/tutorial', label: 'Tutorial' },
  { href: '/login', label: 'Login' },
]

const itemsLoggedIn: Item[] = [
  { href: '/', label: 'Packs' },
  { href: '/attributes', label: 'Attributes' },
  { href: '/orders', label: 'Orders' },
  { href: '/support', label: 'Support' },
  { href: '/tutorial', label: 'Tutorial' },
]

export function Sidebar({ authed }: { authed: boolean }) {
  const pathname = usePathname()
  const items = authed ? itemsLoggedIn : itemsLoggedOut

  async function handleLogout() {
    try {
      logger.info('sidebar.logout.click')
      await supabase.auth.signOut()
      // optional: hard reload to clear any UI state
      window.location.href = '/'
    } catch (e: any) {
      logger.error('sidebar.logout.error', { error: e?.message })
      alert(e?.message || 'Failed to logout')
    }
  }

  return (
    <aside className="hidden h-screen w-64 flex-none border-r border-border bg-black/40 p-4 md:flex md:flex-col">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-primary shadow-neon" />
        <span className="text-sm font-semibold">AI Image Pack</span>
      </div>

      {/* Nav */}
      <nav className="space-y-1">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={clsxx(
              'block rounded-xl px-3 py-2 text-sm hover:bg-muted',
              pathname === it.href && 'bg-muted'
            )}
          >
            {it.label}
          </Link>
        ))}
      </nav>

      {/* Push footer to the bottom */}
      <div className="flex-1" />

      {/* Footer / Logout */}
      {authed && (
        <>
          <div className="my-3 h-px w-full bg-border/60" />
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-muted"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </>
      )}
    </aside>
  )
}
