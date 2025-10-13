// hooks/useAuth.ts
'use client'
import * as React from 'react'
import { Api } from '@/lib/api'
import type { Me } from '@/lib/types'
import { logger } from '@/lib/logger'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ''

export function useAuth() {
  const [me, setMe] = React.useState<Me | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const refresh = React.useCallback(async () => {
    setError(null)
    try {
      const data = await Api.getMyProfile()               // relies on httpOnly session cookie
      setMe(data)
      logger.info('auth.refresh', { email: data?.email })
    } catch (e: any) {
      // 401/403 → unauthenticated
      setMe(null)
      const msg = e?.message || 'Not signed in'
      setError(msg)
      logger.warn('auth.refresh.failed', { msg })
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load + revalidate when tab regains focus/visibility
  React.useEffect(() => {
    let mounted = true
    ;(async () => mounted && (await refresh()))()
    const onFocus = () => refresh()
    const onVis = () => { if (document.visibilityState === 'visible') refresh() }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVis)
    return () => { mounted = false; window.removeEventListener('focus', onFocus); document.removeEventListener('visibilitychange', onVis) }
  }, [refresh])

  // Start Google OAuth on the backend (PKCE). Backend will set session cookie and redirect back.
  function signInWithGoogle(next: string = '/attributes') {
    const nextAbs = `${window.location.origin}${next.startsWith('/') ? next : `/${next}`}`
    const url = `${API_BASE}/auth/google/start?next=${encodeURIComponent(nextAbs)}`
    logger.info('auth.google.start', { next: nextAbs })
    window.location.href = url
  }

  // Ask backend to clear the session cookie, then bounce home
  // async function signOut(redirectTo: string = '/') {
  //   try {
  //     // prefer POST if your backend supports it; else a GET that clears cookie + redirects
  //     await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {})
  //   } finally {
  //     setMe(null)
  //     window.location.href = redirectTo
  //   }
  // }

  async function signOut(redirectTo: string = '/') {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ''
  const nextAbs = `${window.location.origin}${redirectTo.startsWith('/') ? redirectTo : `/${redirectTo}`}`
  // Either method works; GET is simplest since backend redirects after clearing cookie
  window.location.href =  await `${API_BASE}/auth/logout?next=${encodeURIComponent(nextAbs)}`
  // setMe(null);
  // window.location.replace("/")
}

  return { me, loading, error, refresh, signInWithGoogle, signOut }
}
