// lib/api.ts
import { logger } from './logger'
import type { ApiError } from './types'
import type { Me } from '@/lib/types'
import { mockApi } from './mockApi'
import { supabase } from './supabase' // 👈 for access token
import type { Pack, Paginated, Section } from '@/lib/types'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ''
const useMock = process.env.NEXT_PUBLIC_API_MOCK === 'true'

console.log("useMock is:",useMock)

export type FetchOptions = RequestInit & { retry?: number }

function cryptoRandom() {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const a = new Uint8Array(16)
    crypto.getRandomValues(a)
    return Array.from(a).map(b => b.toString(16).padStart(2, '0')).join('')
  }
  return String(Date.now()) + Math.random().toString(16).slice(2)
}

export async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  

  // 👇 inject Supabase JWT if present
  let authHeader: Record<string, string> = {}
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    const uid = session?.user?.id
    if (uid) authHeader['X-User-Id'] = uid 
    // if (token) authHeader = { Authorization: `Bearer ${token}` }
    if (token) authHeader['Authorization'] = `Bearer ${token}` 
  } catch (e) {
    logger.warn('apiFetch token fetch failed', { msg: (e as any)?.message })
  }
  const { retry = 1, headers, body, ...rest } = opts
  const autoHeaders: Record<string, string> = {}
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData
  if (!isForm) {
    autoHeaders['Content-Type'] = 'application/json'
  }

  
  const config: RequestInit = {
    ...rest,
    body,
    headers: {
      ...autoHeaders,
      ...authHeader,
      ...(headers || {}),
    },
    // keep if your backend also uses cookies; otherwise can remove
    credentials: 'include',
  }

  let attempt = 0
  let lastErr: any

  while (attempt <= retry) {
    attempt++
    const started = Date.now()
    try {
      logger.debug('apiFetch request', { url, method: config.method || 'GET' })
      const res = await fetch(url, config)
      const ms = Date.now() - started
      if (!res.ok) {
        let errBody: any = undefined
        try { errBody = await res.json() } catch {}
        const err: ApiError = {
          message: errBody?.message || `HTTP ${res.status}`,
          code: errBody?.code || String(res.status),
          details: errBody
        }
        logger.warn('apiFetch non-OK', { url, status: res.status, ms, err })
        if (res.status >= 500 && attempt <= retry) {
          await new Promise(r => setTimeout(r, 250 * attempt))
          continue
        }
        throw err
      }
      const data = (await res.json()) as T
      logger.debug('apiFetch success', { url, ms })
      return data
    } catch (e: any) {
      lastErr = e
      logger.error('apiFetch failed', { url, attempt, error: e?.message })
      if (attempt > retry) break
    }
  }
  throw lastErr
}

/* ------------ REAL API ------------- */

const realApi = {
  // getPacks: () => apiFetch<Pack[]>('/packs'),
 

  getMe: (): Promise<Me> => apiFetch<Me>('/me'),

  getAttributes: () => apiFetch('/attributes'),
  getMyProfile: () => apiFetch<{ reference_image_url?: string }>('/me/profile'),
  updateAttributes: (payload: any) =>
    apiFetch('/attributes', { method: 'PUT', body: JSON.stringify(payload) }),

  createOrder: (body: { pack_id: string }) =>
    apiFetch('/orders', { method: 'POST', body: JSON.stringify(body) }),
  getOrders: () => apiFetch('/orders'),
  // getOrder: (id: string) => apiFetch(`/orders/${id}`),

  // 👇 NEW: upsert user after OAuth callback
  authUpsert: (body: {
    email: string
    name?: string
    avatar_url?: string
    timezone: string
  }) =>
    apiFetch('/auth/upsert', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'X-Idempotency-Key': cryptoRandom() },
      retry: 1,
    }),
  getSections: (): Promise<{ sections: Section[] }> => apiFetch('/sections'),
  getSectionPacks: (slug: string, limit = 40): Promise<Paginated<Pack>> =>
    apiFetch(`/sections/${encodeURIComponent(slug)}/packs?limit=${limit}`),
  getPacks: (opts?: { tag?: string; sort?: 'latest'|'featured'|'trending'; limit?: number }) => {
    const p = new URLSearchParams()
    if (opts?.tag) p.set('tag', opts.tag)
    if (opts?.sort) p.set('sort', opts.sort)
    p.set('limit', String(opts?.limit ?? 40))
    return apiFetch<Paginated<Pack>>(`/packs?${p.toString()}`)
  },
  usePack: (id: string) => apiFetch(`/packs/${encodeURIComponent(id)}/use`, { method: 'POST' }),
  getPack: (slug: string): Promise<Pack> =>
    apiFetch<Pack>(`/packs/${encodeURIComponent(slug)}`),
  getJobStatus: (request_id: string) => apiFetch(`/jobs/${encodeURIComponent(request_id)}`),
getGallery: (request_id: string) => apiFetch(`/gallery/${encodeURIComponent(request_id)}`),
getOrder: (id: string) => apiFetch(`/orders/${encodeURIComponent(id)}`),
uploadReferenceImage: (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return apiFetch<{ url: string }>('/me/reference-image-upload', { method: 'POST', body: fd })
  },
  setReferenceImage: (payload: { reference_image_url: string }) =>
    apiFetch('/me/reference-image', { method: 'POST', body: JSON.stringify(payload) }),
}

/* ------------ EXPORT TOGGLE ------------- */

export const Api = useMock ? mockApi : realApi
