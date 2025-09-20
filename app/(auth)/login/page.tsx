// app/(auth)/login/page.tsx
'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { logger } from '@/lib/logger'
import { Loader2, LogIn } from 'lucide-react'

export default function LoginPage() {
  const { signInWithGoogle } = useAuth()
  const [loading, setLoading] = React.useState(false)

  async function handleGoogle() {
    try {
      setLoading(true)
      logger.info('auth.google.start')
      await signInWithGoogle()
    } catch (e: any) {
      logger.error('auth.google.error', { error: e?.message })
      alert(e?.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-4">
      <h1 className="text-xl font-semibold">Sign in</h1>
      <Button onClick={handleGoogle} disabled={loading} className="w-full">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
        Continue with Google
      </Button>

      {/* 👇 You asked to keep this explicitly */}
      <div className="text-xs opacity-70">New users receive <strong>3 free credits</strong> on first login.</div>
    </div>
  )
}
