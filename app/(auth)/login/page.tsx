'use client'

import * as React from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export default function LoginPage() {
  const [agree, setAgree] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  const [err, setErr] = React.useState<string | null>(null)

  async function handleGoogle() {
    setErr(null)
    if (!agree) {
      setErr('You must agree to the Terms to continue.')
      return
    }
    try {
      setBusy(true)
      logger.info('auth.google.start')

      // If you already configured redirect in Supabase console you can omit 'options'
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Change to your deployed URL:
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
          queryParams: { prompt: 'select_account' },
        },
      })
      if (error) throw error
    } catch (e: any) {
      logger.error('auth.google.error', { message: e?.message })
      setErr(e?.message || 'Sign in failed')
      setBusy(false)
    }
  }

  return (
    <div className="min-h-[80vh] grid place-items-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card/70 backdrop-blur p-6 shadow-[0_0_24px_rgba(0,255,200,0.07)]">
        {/* Header */}
        <div className="mb-6 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_rgba(0,255,200,0.8)]" />
          <h1 className="text-lg font-semibold tracking-wide">Welcome back</h1>
        </div>

        <p className="mb-6 text-sm opacity-80">
          Sign in to generate packs with your reference face and attributes.
        </p>

        {/* Agree to terms */}
        <label className="group mb-4 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1 h-4 w-4 appearance-none rounded border border-emerald-400/50 
                       bg-transparent outline-none transition
                       checked:bg-emerald-400/90 checked:shadow-[0_0_10px_rgba(16,185,129,0.8)]"
            aria-label="Agree to Terms"
          />
          <span className="text-sm leading-5">
            I agree to the{' '}
            <Link href="/legal/terms" className="underline decoration-emerald-400/70 hover:opacity-90">
              Terms & Agreement
            </Link>{' '}
            and{' '}
            <Link href="/legal/privacy" className="underline decoration-emerald-400/70 hover:opacity-90">
              Privacy Policy
            </Link>.
          </span>
        </label>

        {/* Error */}
        {err && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {err}
          </div>
        )}

        {/* Google button */}
        <button
          onClick={handleGoogle}
          disabled={busy}
          className="relative flex w-full items-center justify-center gap-3 rounded-xl
                     border border-emerald-400/30 bg-emerald-500/15 px-4 py-2.5
                     text-sm font-medium text-emerald-200 
                     hover:bg-emerald-500/20 active:scale-[0.99]
                     disabled:opacity-60 disabled:cursor-not-allowed
                     shadow-[0_0_14px_rgba(16,185,129,0.15)]"
          aria-label="Sign in with Google"
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-5 w-5"
          >
            <path fill="#EA4335" d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.5-5.1 3.5-3.1 0-5.6-2.6-5.6-5.7S8.9 5.9 12 5.9c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.8 3.6 14.6 2.7 12 2.7 6.9 2.7 2.7 6.9 2.7 12s4.2 9.3 9.3 9.3c5.4 0 9-3.8 9-9.1 0-.6 0-1-.1-1.5H12z"/>
          </svg>
          {busy ? 'Redirecting…' : 'Continue with Google'}
          {!agree && (
            <span className="absolute right-3 text-[10px] uppercase tracking-wide text-amber-300/80">
              requires agreement
            </span>
          )}
        </button>

        {/* Subtext */}
        <p className="mt-4 text-xs opacity-60">
          We’ll only use your email to create your account and link your orders.
        </p>
      </div>
    </div>
  )
}
