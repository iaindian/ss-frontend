import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Image Pack',
  description: 'Generate themed image packs',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
