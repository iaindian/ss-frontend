// app/(main)/head.tsx
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SuperSelfieAI',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  sameAs: [
    'https://twitter.com/superselfieai',
    'https://www.instagram.com/superselfieai',
    'https://www.reddit.com/r/superselfieai'
  ],
}

const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SuperSelfieAI',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/?q={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
}

export default function Head() {
  return (
    <>
      <title>SuperSelfieAI — AI Image Packs</title>
      <meta name="description" content="Generate stunning AI selfie packs from your reference photo. Curated styles, fast delivery." />
      <meta name="theme-color" content="#0d0d0d" />
      <meta property="og:site_name" content="SuperSelfieAI" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }} />
    </>
  )
}
