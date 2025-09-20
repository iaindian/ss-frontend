'use client'
import * as React from 'react'
export function usePoll(fn: () => void, ms: number, enabled = true) {
React.useEffect(() => {
if (!enabled) return
fn() // immediate
const id = setInterval(fn, ms)
return () => clearInterval(id)
}, [fn, ms, enabled])
}