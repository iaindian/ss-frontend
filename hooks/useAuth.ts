// hooks/useAuth.ts
'use client'
import * as React from 'react'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export type Me = {
  id: string
  email: string
  avatar_url?: string | null
}

export function useAuth() {
  const [me, setMe] = React.useState<Me | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const refresh = React.useCallback(async () => {
    try {
      setError(null)
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      const user = session?.user || null
      console.log("user is",user)
      setMe(user ? {
        id: user.id,
        email: user.email || '',
        avatar_url: user.user_metadata?.avatar_url ?? null,
      } : null)
      logger.info('auth.refresh', { authed: !!user })
    } catch (e: any) {
      setError(e?.message || 'Auth failed')
      setMe(null)
      logger.error('auth.refresh.error', { error: e?.message })
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    // initial
    refresh()
    // subscribe to auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, _session) => {
      refresh()
    })
    return () => { sub.subscription.unsubscribe() }
  }, [refresh])

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    })
    if (error) {
      logger.error('auth.google.error', { error: error.message })
      throw error
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return { me, loading, error, refresh, signInWithGoogle, signOut }
}
