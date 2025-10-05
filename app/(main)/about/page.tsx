// export default function AboutPage() {
//   return (
//     <div className="max-w-3xl space-y-4">
//       <h1 className="text-2xl font-semibold">About</h1>
//       <p className="opacity-80">
//         We build high-quality AI style packs with an emphasis on likeness control and privacy.
//       </p>
//       <p className="opacity-80">
//         Questions? <a href="mailto:support@yoursite.com" className="underline">support@yoursite.com</a>
//       </p>
//     </div>
//   )
// }

// app/(main)/about/page.tsx
'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Sparkles, Zap, Users, Palette, Clock, Building2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { Separator } from '@/components/ui/separator'

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10">
      {/* Hero */}
      <section className="rounded-2xl border border-border bg-card/70 backdrop-blur p-8 md:p-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(1200px_600px_at_50%_-20%,rgba(34,197,94,0.12),transparent_60%)]" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-300">
              <Zap className="h-3.5 w-3.5" />
              AI studio for everyone
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              SuperSelfieAI — your personal AI photo studio
            </h1>
            <p className="text-sm md:text-base opacity-80 max-w-2xl">
              We transform a single reference photo into high-quality, social-ready image packs. 
              Reliable, fast, and built with safety and consent at the core.
            </p>
            <div className="flex gap-3">
              <Link href="/#packs"><Button>Explore Packs <ArrowRight className="ml-1.5 h-4 w-4" /></Button></Link>
              <Link href="/tutorial"><Button variant="outline">How it works</Button></Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 min-w-[260px]">
            {['/hero1.png','/hero2.jpg','/hero3.png','/hero4.png','/hero5.png','/hero6.png'].map((src,i)=>(
              <div key={i} className="aspect-square overflow-hidden rounded-xl border border-border/60">
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="grid md:grid-cols-3 gap-4">
        <Card><CardContent className="p-5 space-y-2">
          <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-emerald-300" /><h3 className="font-medium">Studio-grade results</h3></div>
          <p className="text-sm opacity-75">Consistent looks across 10–20 prompts per pack. Tuned for faces, skin, and lighting.</p>
        </CardContent></Card>
        <Card><CardContent className="p-5 space-y-2">
          <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-300" /><h3 className="font-medium">Built-in safety</h3></div>
          <p className="text-sm opacity-75">Explicit consent, face checks, easy deletion, and moderation guardrails.</p>
        </CardContent></Card>
        <Card><CardContent className="p-5 space-y-2">
          <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-emerald-300" /><h3 className="font-medium">Fast delivery</h3></div>
          <p className="text-sm opacity-75">Jobs queue instantly. Email + ZIP download when complete.</p>
        </CardContent></Card>
      </section>

      {/* How it works */}
      <section className="rounded-2xl border border-border bg-card/60 p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-4">How it works</h2>
        <ol className="grid md:grid-cols-4 gap-4 text-sm">
          <li className="rounded-xl border border-border/70 bg-background/40 p-4">
            <div className="font-medium mb-1">1) Add attributes</div>
            <p className="opacity-75">Basic traits to guide the prompts.</p>
          </li>
          <li className="rounded-xl border border-border/70 bg-background/40 p-4">
            <div className="font-medium mb-1">2) Upload reference</div>
            <p className="opacity-75">Face-check runs client-side, then securely stored.</p>
          </li>
          <li className="rounded-xl border border-border/70 bg-background/40 p-4">
            <div className="font-medium mb-1">3) Pick a pack</div>
            <p className="opacity-75">We combine your attributes + pack prompts to create a job.</p>
          </li>
          <li className="rounded-xl border border-border/70 bg-background/40 p-4">
            <div className="font-medium mb-1">4) Receive images</div>
            <p className="opacity-75">We email you when ready. Preview or download ZIP.</p>
          </li>
        </ol>
      </section>

      {/* Why now / Market */}
      <section className="grid md:grid-cols-2 gap-6">
        <Card><CardContent className="p-6 space-y-2">
          <div className="flex items-center gap-2"><Palette className="h-4 w-4 text-emerald-300" /><h3 className="font-medium">Why now</h3></div>
          <p className="text-sm opacity-80">
            Foundation models hit consumer quality, creators need fast iteration,
            and everyone wants professional-looking visuals without a studio.
            SuperSelfieAI packages this into a simple, safe product.
          </p>
        </CardContent></Card>
        <Card><CardContent className="p-6 space-y-2">
          <div className="flex items-center gap-2"><Users className="h-4 w-4 text-emerald-300" /><h3 className="font-medium">For creators & brands</h3></div>
          <p className="text-sm opacity-80">
            Individuals, creators, and small teams use our packs for profiles,
            campaigns, thumbnails, and personal branding—at a fraction of studio time.
          </p>
        </CardContent></Card>
      </section>

      {/* Trust & Safety */}
      <section className="rounded-2xl border border-border bg-card/60 p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-2">Trust & Safety</h2>
        <p className="text-sm opacity-80 mb-4">
          Safety is built into the product. We only generate using the owner’s reference image and attributes.
          Users can delete data at any time. We moderate uploads, rate-limit abuse, and honor GDPR requests.
        </p>
        <div className="flex flex-wrap gap-3 text-xs opacity-80">
          <span className="rounded-lg border border-border/60 bg-background/50 px-3 py-1">Consent-first</span>
          <span className="rounded-lg border border-border/60 bg-background/50 px-3 py-1">Face checks</span>
          <span className="rounded-lg border border-border/60 bg-background/50 px-3 py-1">Deletion & export</span>
          <span className="rounded-lg border border-border/60 bg-background/50 px-3 py-1">EU-friendly</span>
        </div>
      </section>

      {/* Metrics / social proof (leave as honest placeholders until you have numbers) */}
      <section className="grid md:grid-cols-3 gap-4">
        <Card><CardContent className="p-6 text-center">
          <div className="text-3xl font-semibold">99.9%</div>
          <div className="text-xs opacity-70 mt-1">Uptime (last 30d)</div>
        </CardContent></Card>
        <Card><CardContent className="p-6 text-center">
          <div className="text-3xl font-semibold">24h</div>
          <div className="text-xs opacity-70 mt-1">Avg. response time</div>
        </CardContent></Card>
        <Card><CardContent className="p-6 text-center">
          <div className="text-3xl font-semibold">50+</div>
          <div className="text-xs opacity-70 mt-1">Packs & styles</div>
        </CardContent></Card>
      </section>

      {/* <Separator /> */}

      {/* Company / Investors */}
      <section className="grid md:grid-cols-2 gap-6 items-start">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-300" />
            <h2 className="text-xl font-semibold">Company</h2>
          </div>
          <p className="text-sm opacity-80">
            SuperSelfieAI is a product-focused company building human-centric AI imaging.
            We ship fast, listen closely to creators, and keep safety non-negotiable.
          </p>
          <div className="flex gap-3">
            <Link href="/legal/privacy"><Button variant="outline">Privacy</Button></Link>
            <Link href="/legal/terms"><Button variant="outline">Terms</Button></Link>
            <Link href="/support"><Button variant="outline">Support</Button></Link>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-medium">For investors & partners</h3>
            <p className="text-sm opacity-80">
              We’re consolidating AI imaging into a premium, safe consumer experience and 
              a lightweight pro workflow. If you’re exploring the space, we’d love to talk.
            </p>
            <div className="flex gap-3">
              <a href="mailto:contact@superselfieai.com" className="w-full">
                <Button className="w-full">Contact founders</Button>
              </a>
              {/* <Link href="/press"><Button variant="outline">Press kit</Button></Link> */}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
