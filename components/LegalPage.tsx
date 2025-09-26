// components/LegalPage.tsx
"use client"

import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Card } from "@/components/ui/card"

export function LegalPage({
  title,
  updated,
  markdown,
}: {
  title: string
  updated?: string
  markdown: string
}) {
  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6">
      {/* <Card className="mb-4 border-border/60 bg-card/70 backdrop-blur">
        <div className="p-4 md:p-5">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {title}
          </h1>
          {updated && (
            <div className="mt-1 text-xs text-foreground/60">
              Last updated: {updated}
            </div>
          )}
        </div>
      </Card> */}

      <Card className="border-border/60 bg-card/70 backdrop-blur shadow-neon">
        <div className="prose prose-invert prose-headings:scroll-m-24 prose-a:text-emerald-300 hover:prose-a:text-emerald-200 prose-strong:text-zinc-100 max-w-none p-4 md:p-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdown}
          </ReactMarkdown>
        </div>
      </Card>
    </div>
  )
}
