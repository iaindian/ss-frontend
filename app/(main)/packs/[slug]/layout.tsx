// app/(main)/packs/[slug]/layout.tsx
import type { Metadata } from 'next'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ''
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

type Pack = {
  id: string
  slug: string
  title: string
  description?: string
  category?: string
  price_cents: number
  currency: string
  preview_images?: string[]
  active?: boolean
}

function absUrl(path: string) {
  try { return new URL(path, SITE_URL).toString() } catch { return path }
}

async function getAllPacks(): Promise<Pack[]> {
  // Keep it simple (uses your existing /packs list)
  console.log("Api base is:",API_BASE);
  try{
    const res = await fetch(`${API_BASE}/packs`, { cache: 'force-cache' })
    const data = await res.json(); // read once
    return data;

  }
  catch(err){
    console.log(err)
    console.log("inside error")
    return []
  }
}

async function getPack(slug: string): Promise<Pack | null> {
  // If you add /packs/:slug later, swap to that.
  const all = await getAllPacks()
  return all.items.find(p => p.slug === slug || p.id === slug) || null
}

export async function generateStaticParams() {
  const packs = await getAllPacks()
  return packs?.items
    .filter(p => p.active !== false)
    .map(p => ({ slug: p.slug || p.id }))
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const pack = await getPack(params.slug)
  const title = pack ? `${pack.title} — SuperSelfieAI` : 'Pack — SuperSelfieAI'
  const description =
    pack?.description ||
    `Generate a custom AI image pack in the style of ${pack?.title ?? 'our curated pack'}.`
  const canonical = absUrl(`/packs/${pack?.slug || params.slug}`)
  const ogImg = pack?.preview_images?.[0]
  const images = (pack?.preview_images || []).slice(0, 6).map(src => ({ url: src }))

  return {
    title,
    description,
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      nocache: false,
    },
    openGraph: {
      type: 'product',
      url: canonical,
      siteName: 'SuperSelfieAI',
      title,
      description,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImg ? [ogImg] : undefined,
      creator: '@superselfieai',
    },
    other: {
      'theme-color': '#0d0d0d',
    },
  }
}

export default function PackSlugLayout({ children }: { children: React.ReactNode }) {
  return children
}
