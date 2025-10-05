import fs from 'node:fs/promises'
import path from 'node:path'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://superselfieai.com'
  const staticRoutes = [
    '',          // /
    '/support',
    '/tutorial',
    '/orders',   // ok to list; or drop it if you prefer
    '/about',
    '/legal/privacy',
    '/legal/terms'
  ].map(p => ({ url: base + p, lastModified: new Date() }))

  let packRoutes: MetadataRoute.Sitemap = []
  try {
    const p = path.join(process.cwd(), 'data', 'packs.json')
    const raw = await fs.readFile(p, 'utf8')
    const json = JSON.parse(raw)
    packRoutes = (json?.packs || []).map((pk: any) => ({
      url: `${base}/packs/${pk.slug}`,
      lastModified: pk.updated_at ? new Date(pk.updated_at) : new Date()
    }))
  } catch {}

  // NOTE: do NOT include /attributes (no SEO)
  return [...staticRoutes, ...packRoutes]
}
