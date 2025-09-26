'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { clsxx } from '@/lib/utils'

// Icons
import {
  X,
  Zap,
  Image as ImageIcon,
  SlidersHorizontal,
  ShoppingBag,
  LifeBuoy,
  BookOpenText,
  LogIn,
  LogOut,
  Users,
} from 'lucide-react'

type Item = { href: string; label: string; icon: React.ComponentType<{ className?: string }> }

const itemsLoggedOut: Item[] = [
  { href: '/',          label: 'Packs',      icon: ImageIcon },
  { href: '/support',   label: 'Support',    icon: LifeBuoy },
  { href: '/tutorial',  label: 'Tutorial',   icon: BookOpenText },
  { href: '/about',     label: 'About Us',   icon: Users },
  { href: '/login',     label: 'Login',      icon: LogIn },
]

const itemsLoggedIn: Item[] = [
  { href: '/',            label: 'Packs',       icon: ImageIcon },
  { href: '/attributes',  label: 'Attributes',  icon: SlidersHorizontal },
  { href: '/orders',      label: 'Orders',      icon: ShoppingBag },
  { href: '/support',     label: 'Support',     icon: LifeBuoy },
  { href: '/tutorial',    label: 'Tutorial',    icon: BookOpenText },
  { href: '/about',       label: 'About Us',    icon: Users },
]

export default function MobileSidebar({
  authed,
  open,
  onClose,
  credits,
}: {
  authed: boolean
  open: boolean
  onClose: () => void
  credits?: number | null
}) {
  const pathname = usePathname()
  const items = authed ? itemsLoggedIn : itemsLoggedOut

  async function handleLogout() {
    try {
      logger.info('mobile.sidebar.logout')
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (e: any) {
      logger.error('mobile.sidebar.logout.error', { error: e?.message })
      alert(e?.message || 'Failed to logout')
    }
  }

  return (
    <div
      aria-hidden={!open}
      className={clsxx(
        'fixed inset-0 z-50 md:hidden transition-opacity',
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Drawer */}
      <aside
        className={clsxx(
          'absolute left-0 top-0 h-full w-[84%] max-w-[320px]',
          'bg-card/90 backdrop-blur border-r border-border',
          'transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full',
          'flex flex-col'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_10px_#22d3ee]" />
            <span className="text-sm font-semibold">SuperSelfie AI</span>
          </div>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-md p-2 hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Credits pill (optional) */}
        {authed && credits != null && (
          <div className="px-4">
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-emerald-300">
              <Zap className="h-4 w-4 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              <span className="font-semibold">{credits}</span>
              <span className="opacity-90">Free credits</span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="mt-3 flex-1 space-y-1 overflow-y-auto px-2 pb-4">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={clsxx(
                  'font-display flex items-center gap-3 rounded-xl px-3 py-3 text-sm',
                  'hover:bg-muted',
                  active && 'bg-muted'
                )}
              >
                <Icon className="h-4 w-4 opacity-90" />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        {authed ? (
          <div className="p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm hover:bg-muted"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  )
}
