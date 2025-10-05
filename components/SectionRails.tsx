'use client'
import * as React from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PackCard } from '@/components/PackCard'
import type { Pack, Me } from '@/lib/types'
import { cn } from '@/lib/utils'

type Props = {
  title: string
  packs: Pack[]
  me?: Me | null
  onGenerate: (p: Pack) => void
  /** show the scrubber slider below the rail */
  showScrubber?: boolean
}

export function SectionRail({ title, packs, me, onGenerate, showScrubber = true }: Props) {
  const trackRef = React.useRef<HTMLDivElement | null>(null)

  // --- drag to scroll ---
  const dragState = React.useRef({ dragging: false, startX: 0, scrollLeft: 0, moved: false })
  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current
    if (!el) return
    dragState.current.dragging = true
    dragState.current.moved = false
    dragState.current.startX = e.clientX
    dragState.current.scrollLeft = el.scrollLeft
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const el = trackRef.current
    const d = dragState.current
    if (!el || !d.dragging) return
    const dx = e.clientX - d.startX
    if (Math.abs(dx) > 3) d.moved = true
    el.scrollLeft = d.scrollLeft - dx
  }
  const onPointerUp = (e: React.PointerEvent) => {
    dragState.current.dragging = false
    dragState.current.startX = 0
  }

  // prevent click on cards when we were dragging
  const suppressClickIfDragged = (e: React.MouseEvent) => {
    if (dragState.current.moved) {
      e.preventDefault()
      e.stopPropagation()
    }
    dragState.current.moved = false
  }

  // --- wheel → horizontal ---
  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    const el = trackRef.current
    if (!el) return
    // Hold Shift to speed up
    const factor = e.shiftKey ? 2.5 : 1
    el.scrollLeft += e.deltaY * factor
    // Prevent the page from scrolling vertically
    e.preventDefault()
  }

  // --- paging with chevrons ---
  const pageBy = (dir: -1 | 1) => {
    const el = trackRef.current
    if (!el) return
    const amount = el.clientWidth * 0.9 // ~one viewport
    el.scrollTo({ left: el.scrollLeft + dir * amount, behavior: 'smooth' })
  }

  // --- keyboard nav ---
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const el = trackRef.current
    if (!el) return
    if (['ArrowRight', 'ArrowLeft', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) e.preventDefault()
    switch (e.key) {
      case 'ArrowRight': el.scrollBy({ left: 80, behavior: 'smooth' }); break
      case 'ArrowLeft':  el.scrollBy({ left: -80, behavior: 'smooth' }); break
      case 'PageDown':   el.scrollBy({ left: el.clientWidth, behavior: 'smooth' }); break
      case 'PageUp':     el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' }); break
      case 'Home':       el.scrollTo({ left: 0, behavior: 'smooth' }); break
      case 'End':        el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' }); break
    }
  }

  // --- scrubber (range) ---
  const [scrub, setScrub] = React.useState(0) // 0..100
  const updateScrubFromScroll = React.useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const pct = max > 0 ? (el.scrollLeft / max) * 100 : 0
    setScrub(pct)
  }, [])
  React.useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateScrubFromScroll()
    const handler = () => updateScrubFromScroll()
    el.addEventListener('scroll', handler, { passive: true })
    return () => el.removeEventListener('scroll', handler)
  }, [updateScrubFromScroll])
  const onScrubChange = (v: number) => {
    setScrub(v)
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    el.scrollTo({ left: (v / 100) * max })
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Link href="/packs" className="text-xs opacity-70 hover:opacity-100 underline">See all</Link>
      </div>

      <div className="relative">
        {/* gradient edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent rounded-l-2xl" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent rounded-r-2xl" />

        {/* chevrons */}
        <div className="absolute inset-y-0 left-1 z-20 flex items-center">
          <Button
            type="button"
            variant="outline"
            className="h-9 w-9 rounded-full bg-background/70 backdrop-blur border-border"
            onClick={() => pageBy(-1)}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute inset-y-0 right-1 z-20 flex items-center">
          <Button
            type="button"
            variant="outline"
            className="h-9 w-9 rounded-full bg-background/70 backdrop-blur border-border"
            onClick={() => pageBy(1)}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* track */}
        <div
          ref={trackRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className={cn(
            'flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none px-1 py-2',
            'select-none' // so dragging feels nice
          )}
          style={{ scrollBehavior: 'auto' }} // we control smoothness per action
        >
          {packs.map((p) => (
            <div key={p.id} className="snap-start shrink-0 w-[320px]" onClick={suppressClickIfDragged}>
              <PackCard pack={p} me={me || null} onGenerate={() => onGenerate(p)} variant="compact" />
            </div>
          ))}
        </div>
      </div>

      {/* scrubber */}
      {showScrubber && (
        <div className="flex items-center gap-3 px-1">
          <input
            aria-label="Scroll position"
            type="range"
            min={0}
            max={100}
            value={scrub}
            onChange={(e) => onScrubChange(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <span className="text-[11px] tabular-nums opacity-60">{Math.round(scrub)}%</span>
        </div>
      )}
    </section>
  )
}
