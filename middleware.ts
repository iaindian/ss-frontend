// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import packsJson from './data/packs.json' assert { type: 'json' };

// Expect packsJson like: { packs: [{ slug: '...' }, ...] }
const knownSlugs: Set<string> = new Set(
  (packsJson as any)?.packs?.map((p: any) => p.slug) ?? []
);

export function middleware(req: NextRequest) {
  // Only emulate in dev; in prod Firebase Hosting handles the rewrite
  if (process.env.NODE_ENV === 'production') return NextResponse.next();

  const { pathname } = new URL(req.url);

  // Match /packs/<slug> (but not /packs or /packs/)
  const m = pathname.match(/^\/packs\/([^/]+)\/?$/);
  if (!m) return NextResponse.next();

  const slug = decodeURIComponent(m[1]);

  // If slug is NOT in the pre-rendered list, rewrite to /packs (client fallback)
  if (!knownSlugs.has(slug)) {
    const url = req.nextUrl.clone();
    url.pathname = '/packs';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/packs/:path*'],
};
