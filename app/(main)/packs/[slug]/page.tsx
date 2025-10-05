// app/(main)/packs/[slug]/page.tsx
import fs from 'node:fs/promises'
import path from 'node:path'
import type { Metadata } from 'next'
import PackDetailClient from './PackDetailClient'

type PackMeta = { slug: string; title: string; description?: string; updated_at?: string | null }

async function readPackList(): Promise<PackMeta[]> {
  try {
    const p = path.join(process.cwd(), 'data', 'packs.json')
    const raw = await fs.readFile(p, 'utf8')
    const json = JSON.parse(raw)
    return json?.packs || []
  } catch {
    return []
  }
}

// 👇 tell Next which slugs to export
export async function generateStaticParams() {
  const packs = await readPackList()
  return packs.map(p => ({ slug: p.slug }))
}

// Optional but good: proper <title>, OG/Twitter tags
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const packs = await readPackList()
  const p = packs.find(x => x.slug === params.slug)
  const title = p ? `${p.title} — SuperSelfieAI` : 'Pack — SuperSelfieAI'
  const description = p?.description || 'Curated AI image pack.'
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://superselfieai.com/packs/${params.slug}`,
      siteName: 'SuperSelfieAI',
      type: 'website'
    },
    twitter: { card: 'summary_large_image', title, description }
  }
}

export default function Page({ params }: { params: { slug: string } }) {
  // All interactivity stays in the client component:
  return <PackDetailClient slug={params.slug} />
}
