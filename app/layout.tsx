import './globals.css'
import type { Metadata } from 'next'
// import { Inter, Orbitron } from "next/font/google"
import { Inter, Outfit } from 'next/font/google'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'SuperSelfie AI',
  description: 'Photorealistic AI-powered custom image packs for instagram with your likeness',
}

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   )
// }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}