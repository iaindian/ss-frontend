'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { cents } from '@/lib/utils'
import { logger } from '@/lib/logger'
import type { Pack, Me } from '@/lib/types'

type Props = {
  pack: Pack
  me?: Me | null
  onGenerate: (pack: Pack) => Promise<void>
  /** default = 'default'. use 'compact' in rails */
  variant?: 'default' | 'compact'
}

export function PackCard({ pack, me, onGenerate, variant = 'default' }: Props) {
  const isCompact = variant === 'compact'

  return (
    <Card className={isCompact ? 'p-0' : ''}>
      <CardHeader className={isCompact ? 'py-3 px-3' : undefined}>
        <CardTitle className={isCompact ? 'text-base' : 'text-lg'}>
          <Link href={`/packs/${pack.slug || pack.id}`} className="hover:underline">
            {pack.title}
          </Link>
        </CardTitle>
        <div className={`text-foreground/60 ${isCompact ? 'text-[11px]' : 'text-xs'}`}>{pack.category}</div>
      </CardHeader>

      <CardContent className={isCompact ? 'px-3 pb-3 pt-0' : undefined}>
        <Link href={`/packs/${pack.slug || pack.id}`}>
          <div className={`grid gap-2 ${isCompact ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {(pack.preview_images || []).slice(0, isCompact ? 2 : 3).map((src, i) => (
              <div key={i} className={`relative w-full overflow-hidden rounded-lg ${isCompact ? 'h-20' : 'h-24'}`}>
                {/* use img to avoid Next/Image layout constraints here */}
                <img src={src} alt="preview" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </Link>

        <div className={`mt-3 flex items-center justify-between ${isCompact ? 'mt-2' : ''}`}>
          <div className={isCompact ? 'text-[13px] opacity-80' : 'text-sm opacity-80'}>
            {cents(pack.price_cents, pack.currency)}
          </div>
          <Button
            onClick={async () => {
              logger.info('Generate pack click', { pack_id: pack.id })
              await onGenerate(pack)
            }}
            size={isCompact ? 'sm' : 'sm'}
            className={isCompact ? 'h-8 px-3 text-xs' : 'h-8 px-3 text-xs'}
          >
            {isCompact ? 'Generate' : 'Generate'}
            {(!isCompact && me && me.free_credits > 0) ? ` (Free ${me.free_credits})` : ''}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
