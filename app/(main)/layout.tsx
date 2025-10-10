// app/(main)/layout.tsx
"use client";
import * as React from "react";
import { Suspense, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopbarMobile } from "@/components/TopbarMobile";
import MobileSidebar from "@/components/MobileSidebar";
import ClientToaster from "@/components/ClientToaster";
import { useAuth } from "@/hooks/useAuth";
import { logger } from "@/lib/logger";
import { Api } from "@/lib/api";
import { CookieBanner } from "@/components/CookieBanner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { me, loading } = useAuth()
  const { me } = useAuth();
  const [free_credits, setCredits] = React.useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  React.useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const res: any = await Api.getMyProfile();
        if (!dead && res) setCredits(Number(res.free_credits || 0));
      } catch {
      } 
    })();
    return () => {
      dead = true;
    };
  }, []);

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        {/* Mobile top bar */}
        <div className="md:hidden">
          <TopbarMobile
            authed={!!me}
            onMenu={() => {
              logger.info("topbar.menu");
              setMobileOpen(true);
            }}
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
         <div className="mx-auto max-w-6xl p-4">{children}</div>
        </main>
      </div>

      {/* Mobile drawer sidebar */}
      <MobileSidebar
        authed={!!me}
        open={mobileOpen}
        onClose={() => {
          logger.info("mobile.close");
          setMobileOpen(false);
        }}
        credits={free_credits}
      />

      <ClientToaster />
      <CookieBanner />
    </>
  );
}
