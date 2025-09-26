'use client'

import * as React from 'react'
import type { Pack } from '@/lib/types'
import { PackCard } from '@/components/PackCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  title: string
  packs: Pack[]
  me: any
  onGenerate: (p: Pack) => void
  cardWidth?: number   // default 360px
  gapPx?: number       // default 16px (tailwind gap-4)
  showArrows?: boolean // default true
  showDots?: boolean   // default true
}

export function SectionRail({
  title,
  packs,
  me,
  onGenerate,
  cardWidth = 360,
  gapPx = 16,
  showArrows = true,
  showDots = true,
}: Props) {
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const [pageCount, setPageCount] = React.useState(0)
  const [page, setPage] = React.useState(0)

  // measure to compute pagination
  React.useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const vw = el.clientWidth
      const total = packs.length * (cardWidth + gapPx)
      const pages = Math.max(1, Math.ceil(total / vw))
      setPageCount(pages)
      // clamp current page
      setPage((p) => Math.min(p, pages - 1))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [packs.length, cardWidth, gapPx])

  // update page on scroll
  React.useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const onScroll = () => {
      const vw = el.clientWidth
      const p = Math.round(el.scrollLeft / Math.max(1, vw))
      setPage(p)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const scrollByPage = (dir: -1 | 1) => {
    const el = wrapRef.current
    if (!el) return
    const vw = el.clientWidth
    el.scrollTo({ left: Math.max(0, el.scrollLeft + dir * vw), behavior: 'smooth' })
  }

  if (!packs?.length) return null

  return (
    <section className="px-1 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className=" font-display text-lg font-semibold">{title}</h2>
      </div>

      <div className="relative">
        {/* Rail */}
        <div
          ref={wrapRef}
          className="no-scrollbar overflow-x-auto"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          <div className="inline-flex pb-2" style={{ gap: gapPx }}>
            {packs.map((p) => (
              <div
                key={p.id}
                className="snap-start shrink-0"
                style={{ width: cardWidth }}
              >
                <PackCard pack={p} me={me} onGenerate={() => onGenerate(p)} />
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        {showArrows && pageCount > 1 && (
          <>
            <button
              aria-label="Previous"
              onClick={() => scrollByPage(-1)}
              className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 backdrop-blur hover:bg-black/60 focus:outline-none"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              aria-label="Next"
              onClick={() => scrollByPage(1)}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 backdrop-blur hover:bg-black/60 focus:outline-none"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {showDots && pageCount > 1 && (
        <div className="flex items-center justify-center gap-1 pt-1">
          {Array.from({ length: pageCount }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                i === page ? 'bg-foreground' : 'bg-foreground/30'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default SectionRail
