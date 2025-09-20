// components/TopbarMobile.tsx
'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'

export function TopbarMobile({
  authed,
  onMenu,
}: {
  authed: boolean
  onMenu: () => void
}) {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/80 p-3 backdrop-blur md:hidden">
      <button
        onClick={onMenu}
        aria-label="Open menu"
        className="rounded-lg p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <Menu className="h-6 w-6" />
      </button>

      <Link href="/" className="text-sm font-semibold">AI Image Pack</Link>

      {!authed ? (
        <Link href="/login" className="rounded-lg bg-primary px-3 py-1 text-black text-sm">Login</Link>
      ) : (
        <Link href="/attributes" className="rounded-lg bg-primary px-3 py-1 text-black text-sm">Account</Link>
      )}
    </div>
  )
}
