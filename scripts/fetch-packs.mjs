// scripts/fetch-packs.mjs
import fs from 'node:fs'
import path from 'node:path'

// const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
const API = 'https://api.superselfieai.com'
console.log("Apis is:", API)

async function main() {
  const outDir = path.join(process.cwd(), 'data')
  fs.mkdirSync(outDir, { recursive: true })

  let packs = []
  try {
    const res = await fetch(`${API}/packs`, { cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const list = await res.json()
    // normalize minimal fields we need for SEO
    packs = (Array.isArray(list) ? list : list?.items || []).map(p => ({
      id: String(p.id),
      slug: String(p.slug || p.id),
      title: String(p.title || 'Pack'),
      description: p.description ? String(p.description) : '',
      updated_at: p.updated_at || p.created_at || null
    }))
  } catch (e) {
    console.warn('[fetch-packs] failed, falling back to empty list:', e?.message)
  }

  const file = path.join(outDir, 'packs.json')
  fs.writeFileSync(file, JSON.stringify({ generatedAt: Date.now(), packs }, null, 2))
  console.log(`[fetch-packs] wrote ${packs.length} packs -> ${file}`)
}

main()
