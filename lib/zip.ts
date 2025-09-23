// lib/zip.ts
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { logger } from '@/lib/logger'

type Progress = { loaded: number; total: number }

function uniqueName(name: string, used: Set<string>) {
  let base = name || 'image'
  let out = base
  let i = 1
  while (used.has(out)) {
    const dot = base.lastIndexOf('.')
    if (dot > 0) out = `${base.slice(0, dot)}_${i}${base.slice(dot)}`
    else out = `${base}_${i}`
    i++
  }
  used.add(out)
  return out
}

function filenameFromUrl(u: string) {
  try {
    const url = new URL(u)
    const last = url.pathname.split('/').filter(Boolean).pop() || ''
    if (last) return decodeURIComponent(last)
  } catch {}
  return ''
}

async function fetchBlob(url: string): Promise<Blob> {
  const res = await fetch(url, { mode: 'cors' })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return await res.blob()
}

export async function downloadZip(
  urls: string[],
  zipName = 'images.zip',
  onProgress?: (p: Progress) => void
) {
  if (!urls?.length) throw new Error('No images to download')

  const CONCURRENCY = 4
  let idx = 0
  let loaded = 0
  const total = urls.length
  onProgress?.({ loaded, total })

  const zip = new JSZip()
  const used = new Set<string>()

  async function worker() {
    while (true) {
      const i = idx++
      if (i >= urls.length) break
      debugger;
      const url = urls[i]
      try {
        const blob = await fetchBlob(url)
        const suggested = filenameFromUrl(url) || `image_${i + 1}.jpg`
        const name = uniqueName(suggested, used)
        zip.file(name, blob)
        loaded++
        onProgress?.({ loaded, total })
      } catch (e: any) {
        logger.error('zip.fetch.error', { url, error: e?.message })
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()))
  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, zipName)
  logger.info('zip.saved', { files: loaded, total })
}
