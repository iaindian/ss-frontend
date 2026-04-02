import "./globals.css";
import type { Metadata, Viewport } from "next";
// import { Inter, Orbitron } from "next/font/google"
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import AnalyticsListener from "./analytics-listener";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "SuperSelfie AI",
  description:
    "Photorealistic AI-powered custom image packs for instagram with your likeness",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   )
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                // We disable auto page_view for SPA and send our own
                gtag('config', '${GA_ID}', { send_page_view: false });
              `}
            </Script>
          </>
        )}
      </head>
      <body className="font-sans">
        <Suspense fallback={null}>
          <AnalyticsListener />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
