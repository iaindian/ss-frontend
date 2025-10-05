'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Check, X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'


function StepCard({
  step,
  title,
  caption,
  videoSrc,
  poster,
}: {
  step: number
  title: string
  caption: string
  videoSrc: string
  poster?: string
}) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null)
  const [portrait, setPortrait] = React.useState(false)

  function onMeta() {
    const v = videoRef.current
    if (!v) return
    // auto-detect orientation
    setPortrait(v.videoHeight > v.videoWidth)
  }

  const aspectClass = portrait ? "aspect-[9/16]" : "aspect-video"

  return (
    <Card className="bg-card/80 backdrop-blur">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="rounded-full px-3">
            {`STEP ${String(step).padStart(2, "0")}`}
          </Badge>
          <CardTitle className="font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-[minmax(0,680px)_1fr]">
      {/* ✅ Constrained media wrapper */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-xl border border-border/60",
          aspectClass,
          // 👉 hard cap and responsive cap so it never gets gigantic
          "max-h-[380px] md:max-h-[520px]"        // <— add this
        )}
      >
        {/* ✅ Never crop; squeeze inside the max height */}
        <video
          ref={videoRef}
          onLoadedMetadata={onMeta}
          className="absolute inset-0 h-full w-full object-contain bg-black/70"  // <— object-contain
          src={videoSrc}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>

      <div className="text-sm opacity-90 leading-relaxed">
          <div>
            {caption}
            <div className="mt-4">
              <Link href="/attributes" className="inline-flex items-center gap-2 text-primary hover:underline">
                Go to Attributes <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

    </CardContent>
    </Card>
  )
}


function HeadshotGuidelines() {
  return (
    <Card className="bg-card/80 backdrop-blur">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="rounded-full px-3">STEP 01</Badge>
          <CardTitle>Pick a clean reference headshot</CardTitle>
        </div>
      </CardHeader>

      {/* Smaller photos + comfortable layout */}
      <CardContent className="grid gap-6 md:grid-cols-2">
        {/* GOOD */}
        <div className="rounded-xl border border-emerald-600/40 bg-emerald-500/5 p-3">
          <div className="relative aspect-[4/5] w-full max-w-[420px] md:max-w-none mx-auto overflow-hidden rounded-lg border border-emerald-600/40">
            <Image
              src="/tutorial/good.jpg"
              alt="Good headshot example"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute left-2 top-2">
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Good</Badge>
            </div>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-emerald-400" />
              Neutral expression, face forward
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-emerald-400" />
              Head & shoulders in frame
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 text-emerald-400" />
              Sharp, evenly lit photo
            </li>
          </ul>
        </div>

        {/* BAD */}
        <div className="rounded-xl border border-red-600/40 bg-red-500/5 p-3">
          <div className="relative aspect-[4/5] w-full max-w-[420px] md:max-w-none mx-auto overflow-hidden rounded-lg border border-red-600/40">
            <Image
              src="/tutorial/bad.jpg"
              alt="Bad headshot example"
              fill
              className="object-cover"
            />
            <div className="absolute left-2 top-2">
              <Badge className="bg-red-500/20 text-red-300 border border-red-500/40">Avoid</Badge>
            </div>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <X className="mt-0.5 h-4 w-4 text-red-400" />
              Sunglasses, hats or heavy occlusions
            </li>
            <li className="flex items-start gap-2">
              <X className="mt-0.5 h-4 w-4 text-red-400" />
              Strong tilt / profile angle
            </li>
            <li className="flex items-start gap-2">
              <X className="mt-0.5 h-4 w-4 text-red-400" />
              Blurry, noisy or low-light images
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default function TutorialPage() {
  return (
    <div className="space-y-8">
      {/* Intro / steps list */}
      <div className="prose prose-invert">
        <h1>Getting Started</h1>
        <ol>
          <li>Upload a clear reference face in <Link href="/attributes">Attributes</Link>.</li>
          <li>Fill your attributes accurately (age, hair, skin tone, etc.).</li>
          <li>Pick a Pack → review → <strong>Generate</strong>.</li>
          <li>Pay (or use free credits) and we’ll email when it’s done.</li>
        </ol>
      </div>

      <HeadshotGuidelines />

      <Separator />

      {/* Steps with looped clips */}
      <div className="space-y-6">
      <StepCard
        step={2}
        title="Fill your attributes"
        caption="Describe yourself once—age, hair, facial hair, skin tone, body type. We use this to better match your likeness in every pack."
        videoSrc="/tutorial/attributes-demo.mp4"
        poster="/tutorial/attributes-poster.jpg"
      />
      <StepCard
        step={3}
        title="Generate a pack"
        caption="Choose a pack you like and hit Generate. Track progress from the Orders tab. We email you the moment it’s ready."
        videoSrc="/tutorial/generate-demo.mp4"
        poster="/tutorial/generate-poster.jpg"
      />
    </div>


      <Separator />

      {/* FAQ (keep yours, lightly styled) */}
      <div>
        <h2 className="mb-3 text-xl font-semibold">FAQ</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="time">
            <AccordionTrigger>How long does generation take?</AccordionTrigger>
            <AccordionContent>
              Jobs are queued and processed in batches. Most packs finish within 12–24h; you’ll get an email the moment it’s ready.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="change-face">
            <AccordionTrigger>Can I change my reference face?</AccordionTrigger>
            <AccordionContent>
              Yes. Upload a new headshot anytime in <Link href="/attributes" className="underline">Attributes</Link>. We’ll use the latest image for future generations.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="credits">
            <AccordionTrigger>Do unused credits expire?</AccordionTrigger>
            <AccordionContent>
              Free credits and purchased credits never expire.
            </AccordionContent>
          </AccordionItem>

           <AccordionItem value="packs">
            <AccordionTrigger>My generated image is not matching with packs image</AccordionTrigger>
            <AccordionContent>
              We don't use face swap, we generate your image using the same prompt but with a fresh seed, hence the generations are unique
              to every user while maintaing the style.
              If you don't like the generated output, please contact us via  <Link href="/support" className="underline">Support</Link>.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="refund">
            <AccordionTrigger>Can I get refund ?</AccordionTrigger>
            <AccordionContent>
              Refunds are only possible in case of Failed generation, if you don't like the generated image, please contact us and we will be able to provide you a solution 
              which will make you happy
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="license">
            <AccordionTrigger>What’s the license?</AccordionTrigger>
            <AccordionContent>
              Personal use & social sharing are allowed. Commercial use requires a license—email us if you need one.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
