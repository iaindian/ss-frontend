'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { SiX, SiInstagram, SiReddit } from 'react-icons/si'

type Props = {
  className?: string
  // put your real URLs here
  xUrl?: string
  igUrl?: string
  rdUrl?: string
}

export function SocialLinks({
  className,
  xUrl = 'https://x.com/yourhandle',
  igUrl = 'https://instagram.com/yourhandle',
  rdUrl = 'https://reddit.com/r/yourcommunity',
}: Props) {
  const item =
    'flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-card/60 backdrop-blur hover:bg-card hover:border-foreground/30 transition shadow-[0_0_8px_rgba(16,185,129,0.15)]'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Link href={xUrl} aria-label="X (Twitter)" className={item} target="_blank">
        <SiX className="h-4 w-4 text-foreground/80" />
      </Link>
      <Link href={igUrl} aria-label="Instagram" className={item} target="_blank">
        <SiInstagram className="h-4 w-4 text-foreground/80" />
      </Link>
      <Link href={rdUrl} aria-label="Reddit" className={item} target="_blank">
        <SiReddit className="h-4 w-4 text-foreground/80" />
      </Link>
    </div>
  )
}
