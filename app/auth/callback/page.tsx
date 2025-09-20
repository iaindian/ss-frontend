'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Api } from '@/lib/api'
import { logger } from '@/lib/logger'

function getTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Amsterdam'
  } catch {
    return 'Europe/Amsterdam'
  }
}

export default function AuthCallback() {
  const router = useRouter()
  const qp = useSearchParams()

  useEffect(() => {
    async function run() {
      // 1) surface OAuth errors in the URL (if any)
      const err = qp.get('error') || qp.get('error_description')
      if (err) {
        logger.error('auth.callback.oauth_error', { err })
        alert(err)
        router.replace('/login')
        return
      }

      // 2) ensure Supabase session exists
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        logger.error('auth.callback.session_error', { error: error.message })
        alert(error.message)
        router.replace('/login')
        return
      }
      const user = session?.user
      logger.info('auth.callback.session', { authed: !!user })

      // 3) upsert user in your backend (idempotent)
      if (user?.email) {
        try {
          const body = {
            email: user.email,
            name: (user.user_metadata?.full_name || user.user_metadata?.name || '').trim() || undefined,
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || undefined,
            timezone: getTimezone(),
          }
          await Api.authUpsert(body)
          logger.info('auth.upsert.success', { email: user.email })
        } catch (e: any) {
          // Don't block the user if the upsert fails—log it, tell them lightly
          logger.error('auth.upsert.error', { error: e?.message })
          // optional: show a non-blocking toast instead of alert
          console.warn('User profile sync failed:', e?.message)
        }
      }
      try {
      const res = await Api.getAttributes()
      const has = !!res?.attributes && Object.keys(res.attributes).length > 0
      if (!has) {
        router.replace('/attributes?required=1')
        return
      }
      } catch {}

      // 4) go to a logged-in landing (attributes or home)
      router.replace('/')
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div className="p-6">Signing you in…</div>
}
