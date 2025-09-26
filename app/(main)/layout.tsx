// app/(main)/layout.tsx
'use client'
import * as React from 'react'
import { Suspense, useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { TopbarMobile } from '@/components/TopbarMobile'
import MobileSidebar from '@/components/MobileSidebar'
import ClientToaster from '@/components/ClientToaster'
import { useAuth } from '@/hooks/useAuth'
import { logger } from '@/lib/logger'
import { Api } from '@/lib/api'


// export default function MainLayout({ children }: { children: React.ReactNode }) {
//   const { me, loading } = useAuth()
//   const [mobileOpen, setMobileOpen] = useState(false)

//   return (
//     <>
//       <div className="flex">
//         <Sidebar authed={!!me} />
//         <div className="min-h-screen flex-1 p-4">
//           <TopbarMobile
//             authed={!!me}
//             onMenu={() => { logger.info('topbar.menu'); setMobileOpen(true) }}
//           />
//           <div className="mx-auto max-w-6xl pt-2">
//             {loading ? <div>Loading…</div> : <Suspense fallback={<div>Loading…</div>}>{children}</Suspense>}
//           </div>
//         </div>
//       </div>

//       <MobileSidebar
//         authed={!!me}
//         open={mobileOpen}
//         onClose={() => { logger.info('mobile.close'); setMobileOpen(false) }}
//       />

//       <ClientToaster />
//     </>
//   )
// }


export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { me, loading } = useAuth()
  const [free_credits, setRefUrl] = React.useState<number | null>(null)
  React.useEffect(() => {
        let dead = false
        ;(async () => {
          try {
            const res = await Api.getMyProfile()
            console.log("res is",res);
            if (!dead) {
               console.log("res is",res.free_credits);
              setRefUrl(res?.free_credits ?? null)
            }
            } catch {
            // ignore
          }
        })()
        return () => { dead = true }
      }, [])
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        {/* Mobile top bar */}
        <div className="md:hidden">
          <TopbarMobile
            authed={!!me}
            onMenu={() => { logger.info('topbar.menu'); setMobileOpen(true) }}
          />
        </div>

        {/* FIXED sidebar on desktop */}
        <aside
          className="hidden md:block fixed inset-y-0 left-0 w-64 z-40
                     border-r border-border bg-card/80 backdrop-blur
                     overflow-y-auto scrollbar-none"
        >
          <Sidebar authed={!!me} credits={free_credits} />
        </aside>

        {/* Main content – shifted to the right on desktop */}
        <main className="md:ml-64">
          <div className="mx-auto max-w-6xl p-4">
            {loading
              ? <div>Loading…</div>
              : <Suspense fallback={<div>Loading…</div>}>{children}</Suspense>}
          </div>
        </main>
      </div>

      {/* Mobile drawer sidebar */}
      <MobileSidebar
        authed={!!me}
        open={mobileOpen}
        onClose={() => { logger.info('mobile.close'); setMobileOpen(false) }}
        credits={free_credits}
      />

      <ClientToaster />
    </>
  )
}