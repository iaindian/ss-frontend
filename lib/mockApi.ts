// lib/mockApi.ts
import { Me, Pack, Order, Attributes } from '@/lib/types'
import type {  Section, Paginated } from '@/lib/types'

const MOCK_LOGGED_IN =
  typeof process !== 'undefined' &&
  process.env.NEXT_PUBLIC_MOCK_LOGGED_IN === 'true'

const wait = (ms=200) => new Promise(r => setTimeout(r, ms))

// const MOCK_SECTIONS: Section[] = [
//   { slug: 'latest', name: 'Latest', type: 'latest' },
//   { slug: 'featured', name: 'Featured', type: 'featured' },
//   { slug: 'trending', name: 'Trending', type: 'trending' },
//   { slug: 'gym-series', name: 'Gym Series', type: 'tags', tags: ['gym','fitness'] },
//   { slug: 'indoor-shoots', name: 'Indoor Shoots', type: 'tags', tags: ['indoor','studio'] },
// ]

export const MOCK_SECTIONS: Section[] = [
  { slug: 'latest',   name: 'Latest',   type: 'latest'   },
  { slug: 'featured', name: 'Featured', type: 'featured' },
  { slug: 'trending', name: 'Trending', type: 'trending' },

  // 👇 Custom “Gym Packs” section (tags ORed)
  { slug: 'gym-series', name: 'Gym Packs', type: 'tags', tags: ['gym','fitness'] },

  { slug: 'indoor-shoots', name: 'Indoor Shoots', type: 'tags', tags: ['indoor','studio'] },
]

function hasAnyTag(p: Pick<Pack, 'tag1'|'tag2'|'tag3'>, tags: string[]) {
  const a = (p.tag1 || '').toLowerCase()
  const b = (p.tag2 || '').toLowerCase()
  const c = (p.tag3 || '').toLowerCase()
  const set = new Set(tags.map(t => t.toLowerCase()))
  return set.has(a) || set.has(b) || set.has(c)
}

const MOCK_PACKS: Pack[] = [
  {
    id: 'pack_001',
    slug: 'fantasy-knight-1',
    title: 'Fantasy Knight 1',
    description: 'Cinematic armor set with moody lighting and dramatic poses.',
    category: 'general',
    price_cents: 999,
    currency: 'USD',
    preview_images: [
      'https://ss-images.ams3.cdn.digitaloceanspaces.com/2025-09-13/pc-1/zo-p04-i00.png',
      'https://ss-images.ams3.cdn.digitaloceanspaces.com/2025-09-13/pc-1/zo-p02-i00.png',
    ],
    active: true,
    usage_count: 147,
    expires_at: null,
    tag1: 'gym',
    tag2: 'fitness',
    tag3: 'ai-influencer',
    featured_weight: 20,
    workflow: null,
    published_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'pack_002',
    slug: 'yoga-girl-1',
    title: 'Yoga Girl 1',
    description: 'Minimal studio look focused on yoga flows and soft highlights.',
    category: 'fitness',
    price_cents: 1299,
    currency: 'USD',
    preview_images: [
      'https://ss-images.ams3.cdn.digitaloceanspaces.com/2025-09-19/pc-3/zo-p02-i00.png',
      'https://ss-images.ams3.cdn.digitaloceanspaces.com/2025-09-19/pc-3/zo-p03-i00.png',
      'https://ss-images.ams3.cdn.digitaloceanspaces.com/2025-09-19/pc-3/zo-p04-i00.png',
      'https://ss-images.ams3.cdn.digitaloceanspaces.com/2025-09-19/pc-3/zo-p05-i00.png',
      'https://ss-images.ams3.cdn.digitaloceanspaces.com/2025-09-19/pc-3/zo-p06-i00.png',
      'https://ss-images.ams3.cdn.digitaloceanspaces.com/2025-09-19/pc-3/zo-p01-i00.png',
    ],
    active: true,
    usage_count: 8,
    expires_at: null,
    tag1: 'yoga',
    tag2: 'gym',
    tag3: 'indoor',
    featured_weight: 1,
    workflow: 'portrait_v2',
    published_at: new Date().toISOString(),
  },
  {
    id: 'pack_003',
    slug: 'yoga-girl-3',
    title: 'Yoga Girl 1',
    description: 'Minimal studio look focused on yoga flows and soft highlights.',
    category: 'fitness',
    price_cents: 1299,
    currency: 'USD',
    preview_images: [
      'https://ss-images.ams3.cdn.digitaloceanspaces.com/2025-09-13/pc-1/zo-p03-i00.png',
      'https://ss-images.ams3.cdn.digitaloceanspaces.com/2025-09-13/pc-1/zo-p05-i00.png',
    ],
    active: true,
    usage_count: 88,
    expires_at: null,
    tag1: 'yoga',
    tag2: 'gym',
    tag3: 'indoor',
    featured_weight: 10,
    workflow: 'portrait_v2',
    published_at: new Date().toISOString(),
  },
  {
    id: 'pack_004',
    slug: 'yoga-girl-4',
    title: 'Yoga Girl 4',
    description: 'Minimal studio look focused on yoga flows and soft highlights.',
    category: 'fitness',
    price_cents: 1299,
    currency: 'USD',
    preview_images: [
      'https://ss-images.ams3.cdn.digitaloceanspaces.com/2025-09-13/pc-1/zo-p03-i00.png',
      'https://ss-images.ams3.cdn.digitaloceanspaces.com/2025-09-13/pc-1/zo-p05-i00.png',
    ],
    active: true,
    usage_count: 88,
    expires_at: null,
    tag1: 'yoga',
    tag2: 'gym',
    tag3: 'indoor',
    featured_weight: 10,
    workflow: 'portrait_v2',
    published_at: new Date().toISOString(),
  },
]

export const mockApi = {
  getMe: async (): Promise<Me> => {
    await wait()
    if (!MOCK_LOGGED_IN) {
      // simulate “not logged in”
      const err: any = new Error('Unauthorized')
      err.code = 401
      throw err
    }
    return {
      id: 'user_123',
      email: 'demo@example.com',
      free_credits: 2,
      reference_image_url: 'https://placekitten.com/200/200',
    }
  },

  // getPacks: async (): Promise<Pack[]> => {
  //   await wait()
  //   return [
  //     {
  //       id: 'pack_001',
  //       slug: 'fantasy-knight-1',
  //       title: 'Fantasy Knight 1',
  //       category: 'general',
  //       price_cents: 999,
  //       currency: 'USD',
  //       preview_images: ['https://ss-images.ams3.cdn.digitaloceanspaces.com/2025-09-13/pc-1/zo-p04-i00.png','https://ss-images.ams3.cdn.digitaloceanspaces.com/2025-09-13/pc-1/zo-p02-i00.png','https://ss-images.ams3.cdn.digitaloceanspaces.com/2025-09-13/pc-1/zo-p03-i00.png','https://ss-images.ams3.cdn.digitaloceanspaces.com/2025-09-13/pc-1/zo-p05-i00.png','https://ss-images.ams3.cdn.digitaloceanspaces.com/2025-09-13/pc-1/zo-p06-i00.png','https://ss-images.ams3.cdn.digitaloceanspaces.com/2025-09-13/pc-1/zo-p00-i00.png'],
  //       active: true,
  //     },
  //      {
  //       id: 'pack_002',
  //       slug: 'fantasy-knight-2',
  //       title: 'Fantasy Knight 2',
  //       category: 'general',
  //       price_cents: 999,
  //       currency: 'USD',
  //       preview_images: ['https://ss-images.ams3.cdn.digitaloceanspaces.com/2025-09-13/pc-1/zo-p04-i00.png','https://ss-images.ams3.cdn.digitaloceanspaces.com/2025-09-13/pc-1/zo-p02-i00.png','https://ss-images.ams3.cdn.digitaloceanspaces.com/2025-09-13/pc-1/zo-p03-i00.png','https://ss-images.ams3.cdn.digitaloceanspaces.com/2025-09-13/pc-1/zo-p05-i00.png'],
  //       active: true,
  //     },
  //   ]
  // },

  getOrders: async (): Promise<Order[]> => {
    await wait()
    return [
      {
        id: 'order_001',
        pack_id: 'pack_001',
        pack_title: 'Fantasy Knight',
        status: 'ready',
        download_url: 'https://example.com/download.zip',
        receipt_url: 'https://example.com/receipt',
        created_at: new Date().toISOString(),
      },
    ]
  },

  getAttributes: async (): Promise<Attributes> => {
    await wait()
    return {
      age: '25',
      hair_color: 'black',
      hair_style: 'curly',
      body_type: 'athletic',
      skin_tone: 'olive',
      notes: 'Look like a sci-fi hero.',
    }
  },

  updateAttributes: async (_attrs: Attributes): Promise<{ success: true }> => {
    await wait()
    return { success: true }
  },

  postOrder: async (_packId: string): Promise<{ id: string; status: Order['status'] }> => {
    await wait()
    return { id: 'order_mock', status: 'queued' }
  },

  // getPack: async (slugOrId: string) => {
  // await wait()
  // const list = await mockApi.getPacks() // reuse your own method
  // const pack = list.find(
  //   (p) => p.slug === slugOrId || p.id === slugOrId
  // )
  // if (!pack) {
  //   throw new Error('Pack not found')
  // }
  //   return pack
  // },

  authUpsert: async (body: {
  email: string
  name?: string
  avatar_url?: string
  timezone: string
}) => {
  await new Promise(r => setTimeout(r, 200))
  console.log('[mock] authUpsert', body)
  return { tenant_id: 'tenant_mock_123' }
},

 getSections: async (): Promise<{ sections: Section[] }> => {
    await wait(); return { sections: MOCK_SECTIONS }
  },
  getSectionPacks: async (slug: string, limit = 40): Promise<Paginated<Pack>> => {
    await wait()
    const sec = MOCK_SECTIONS.find(s => s.slug === slug)
    if (!sec) return { items: [], next_cursor: null }

    let items = [...MOCK_PACKS].filter(p => p.active)

    switch (sec.type) {
      case 'latest':
        items.sort((a,b) =>
          Date.parse(b.published_at || '0') - Date.parse(a.published_at || '0')
        )
        break

      case 'featured':
        items.sort((a,b) =>
          (b.featured_weight || 0) - (a.featured_weight || 0) ||
          Date.parse(b.published_at || '0') - Date.parse(a.published_at || '0')
        )
        break

      case 'trending':
        items.sort((a,b) =>
          (b.usage_count || 0) - (a.usage_count || 0) ||
          Date.parse(b.published_at || '0') - Date.parse(a.published_at || '0')
        )
        break

      case 'tags': {
        const tags = sec.tags || []
        items = items.filter(p => hasAnyTag(p, tags))
        // reasonable order for tag rails
        items.sort((a,b) =>
          (b.featured_weight || 0) - (a.featured_weight || 0) ||
          Date.parse(b.published_at || '0') - Date.parse(a.published_at || '0')
        )
        break
      }
    }

    return { items: items.slice(0, limit), next_cursor: null }
  },
  getPacks: async (opts?: { tag?: string; sort?: 'latest'|'featured'|'trending'; limit?: number }): Promise<Paginated<Pack>> => {
    await wait()
    let items = [...MOCK_PACKS]
    if (opts?.tag) {
      const t = opts.tag.toLowerCase()
      items = items.filter(p => [p.tag1, p.tag2, p.tag3].some(x => x?.toLowerCase() === t))
    }
    if (opts?.sort === 'featured') {
      items.sort((a,b) => (b.featured_weight ?? 0) - (a.featured_weight ?? 0))
    } else if (opts?.sort === 'trending') {
      items.sort((a,b) => (b.usage_count ?? 0) - (a.usage_count ?? 0))
    } else {
      items.sort((a,b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime())
    }
    return { items: items.slice(0, opts?.limit ?? 40), next_cursor: null }
  },
  getPack: async (slug: string): Promise<Pack> => {
    await wait()
    const p = MOCK_PACKS.find(x => x.slug === slug)
    if (!p) throw new Error('not found')
    return p
  },
  usePack: async (_id: string) => { await wait(); return { ok: true } },
}

// const wait = (ms: number = 500) => new Promise((res) => setTimeout(res, ms))
