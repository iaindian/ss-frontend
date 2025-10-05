"use client"

import * as React from "react"
import { Heart, MessageCircle, Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Pack } from "@/lib/types" // make sure this path matches your project

/** ---------- Small helpers ---------- */
function seededCount(seed: string, min = 120, max = 2200) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  const r = (h % (max - min + 1)) + min
  return Intl.NumberFormat().format(r)
}

/** ---------- Card that can work with either 'images' or a 'pack' ---------- */
type BaseCardProps = {
  autoSlide?: boolean
  slideEveryMs?: number
  className?: string
}

type CardWithPack = BaseCardProps & {
  pack: Pack
  onGenerate?: (p: Pack) => void
  images?: never
}

type CardWithImages = BaseCardProps & {
  images: string[]
  pack?: never
  onGenerate?: never
}

type PackSocialCardProps = CardWithPack | CardWithImages

export function PackSocialCard(props: PackSocialCardProps) {
  const imgs = "images" in props
    ? (props.images?.length ? props.images : ["/placeholder.png"])
    : (props.pack.preview_images?.length ? props.pack.preview_images : ["/placeholder.png"])

  const title = "pack" in props ? props.pack.title : "Preview"
  const seedStr = "pack" in props ? (props.pack.id || props.pack.slug || title) : imgs.join("|")

  const {
    autoSlide = true,
    slideEveryMs = 2000,
    className,
  } = props

  const [idx, setIdx] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const interact = () => setPaused(true)

  React.useEffect(() => {
    if (!autoSlide || imgs.length <= 1 || paused) return
    const id = setInterval(() => setIdx((i) => (i + 1) % imgs.length), slideEveryMs)
    return () => clearInterval(id)
  }, [autoSlide, imgs.length, paused, slideEveryMs])

  return (
    <article
      className={cn(
        "w-[320px] overflow-hidden rounded-2xl border border-border bg-card",
        "shadow-[0_0_12px_rgba(0,255,128,0.12)] hover:shadow-[0_0_18px_rgba(0,255,128,0.22)] transition-shadow",
        className
      )}
      onMouseEnter={interact}
      onTouchStart={interact}
    >
      {/* image viewport */}
      <div className="relative h-[380px] w-full overflow-hidden">
        <div
          className="flex h-full w-full transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {imgs.map((src, i) => (
            <div key={i} className="min-w-full h-full">
              <img src={src} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>

        {/* dots (only if multiple) */}
        {imgs.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {imgs.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 w-1.5 rounded-full bg-white/30",
                  i === idx && "bg-white"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* footer: faux social stats */}
      <div className="p-3">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="truncate font-semibold">{title}</h3>
          {/* if you want a generate button in packs mode, you can show it here */}
          {/* {"pack" in props && props.onGenerate && (
            <button
              onClick={() => props.onGenerate?.(props.pack)}
              className="text-xs rounded-lg px-2 py-1 bg-primary text-black"
            >
              Generate
            </button>
          )} */}
        </div>
        <div className="flex items-center gap-4 text-sm opacity-80">
          <span className="inline-flex items-center gap-1">
            <Heart className="h-4 w-4" /> {seededCount(seedStr + "likes")}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="h-4 w-4" /> {seededCount(seedStr + "comments", 8, 120)}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 opacity-70">
            <Bookmark className="h-4 w-4" /> Save
          </span>
        </div>
      </div>
    </article>
  )
}

/** ---------- SocialRail that supports two modes ---------- */
type RailWithPacks = {
  packs: Pack[]
  onGenerate: (p: Pack) => void
  autoSlideCards?: boolean
  slideEveryMs?: number
  images?: never
}

type RailWithImages = {
  images: string[]
  autoSlideCards?: boolean
  slideEveryMs?: number
  packs?: never
  onGenerate?: never
}

export function SocialRail(props: RailWithPacks | RailWithImages) {
  // IMAGES MODE: single post-like card (for /packs/[slug])
  if ("images" in props) {
    const { images, autoSlideCards = true, slideEveryMs = 2000 } = props
    return (
      <section className="relative">
        <div className="flex justify-center">
          <PackSocialCard
            images={images}
            autoSlide={autoSlideCards}
            slideEveryMs={slideEveryMs}
            className="w-full max-w-[420px]"
          />
        </div>
      </section>
    )
  }

  // PACKS MODE: horizontal rail of many cards (for homepage)
  const { packs, onGenerate, autoSlideCards = false, slideEveryMs = 2000 } = props
  return (
    <section className="relative">
      <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4">
        {packs.map((p) => (
          <div key={p.id} className="snap-start shrink-0">
            <PackSocialCard
              pack={p}
              onGenerate={onGenerate}
              autoSlide={autoSlideCards}
              slideEveryMs={slideEveryMs}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default SocialRail
