// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsxx } from "@/lib/utils";
import { logger } from "@/lib/logger";
import { supabase } from "@/lib/supabase";
import { LogOut } from "lucide-react";
import * as React from "react";
import { Zap } from "lucide-react";
import { Box, UserCircle2, Package, HelpCircle, BookOpen, Users  } from "lucide-react"

type Item = { href: string; label: string; icon: React.ElementType }
// type Item = { href: string; label: string };

const itemsLoggedIn: Item[] = [
  { href: "/", label: "Packs", icon: Package },
  { href: "/attributes", label: "Attributes", icon: UserCircle2 },
  { href: "/orders", label: "Orders", icon: Box },
  { href: "/support", label: "Support", icon: HelpCircle },
  { href: "/tutorial", label: "Tutorial", icon: BookOpen },
  { href: "/about", label: "About Us", icon: Users },
]

const itemsLoggedOut: Item[] = [
  { href: "/", label: "Packs", icon: Package },
  { href: "/support", label: "Support", icon: HelpCircle },
  { href: "/tutorial", label: "Tutorial", icon: BookOpen },
  { href: "/login", label: "Login", icon: UserCircle2 },
  { href: "/about", label: "About Us", icon: Users },
]

// const itemsLoggedOut: Item[] = [
//   { href: "/", label: "Packs" },
//   { href: "/support", label: "Support" },
//   { href: "/tutorial", label: "Tutorial" },
//   { href: "/login", label: "Login" },
//   { href: "/about", label: "About us" },
// ];

// const itemsLoggedIn: Item[] = [
//   { href: "/", label: "Packs" },
//   { href: "/attributes", label: "Attributes" },
//   { href: "/orders", label: "Orders" },
//   { href: "/support", label: "Support" },
//   { href: "/tutorial", label: "Tutorial" },
//    { href: "/about", label: "About us" },
// ];

export function Sidebar({
  authed,
  credits,
}: {
  authed: boolean;
  credits?: any;
}) {
  const pathname = usePathname();
  const items = authed ? itemsLoggedIn : itemsLoggedOut;

  async function handleLogout() {
    try {
      logger.info("sidebar.logout.click");
      await supabase.auth.signOut();
      // optional: hard reload to clear any UI state
      window.location.href = "/";
    } catch (e: any) {
      logger.error("sidebar.logout.error", { error: e?.message });
      alert(e?.message || "Failed to logout");
    }
  }

  return (
    <aside className="hidden h-screen w-64 flex-none border-r border-border bg-black/40 p-4 md:flex md:flex-col">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-primary shadow-neon" />
        <span className="font-display text-xl font-semibold">SuperSelfie AI</span>
      </div>

      {/* Nav */}
      {/* <nav className="space-y-1">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={clsxx(
              "block rounded-xl px-3 py-2 text-sm hover:bg-muted",
              pathname === it.href && "bg-muted"
            )}
          >
            {it.label}
          </Link>
        ))}
      </nav> */}
      <nav className="space-y-1">
      {items.map((it) => {
        const Icon = it.icon
        return (
          <Link
            key={it.href}
            href={it.href}
            className={clsxx(
              "font-display flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-muted transition-colors",
              pathname === it.href && "bg-muted text-emerald-300"
            )}
          >
            <Icon className="h-4 w-4 opacity-80" />
            {it.label}
          </Link>
        )
      })}
    </nav>
      

      {/* Push footer to the bottom */}
      <div className="flex-1" />

      {/* Footer / Logout */}
      {authed && (
  <>
    {/* Credits card */}
    <div className="px-2">
      <div
        className={[
          "group relative w-full overflow-hidden rounded-xl border p-3 transition",
          credits && credits > 0
            ? "border-emerald-400/40 bg-emerald-400/10 hover:bg-emerald-400/15 shadow-[0_0_35px_-15px_rgba(16,185,129,0.6)]"
            : "border-zinc-700/40 bg-zinc-900/40 hover:bg-zinc-900/60"
        ].join(" ")}
        aria-label="Free credits"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* neon zap */}
            <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg
                            bg-emerald-500/15 ring-1 ring-emerald-400/40
                            shadow-[0_0_12px_rgba(16,185,129,0.65)]">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-300">
                <path fill="currentColor" d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-[11px] uppercase tracking-wide text-foreground/60">
                Free credits
              </div>
              <div className="text-lg font-semibold">
                {typeof credits === "number" ? credits : 0}
              </div>
            </div>
          </div>

          {/* optional action */}
          <a
            href="/tutorial#credits"
            className="text-xs text-emerald-300/80 underline-offset-2 hover:underline hover:text-emerald-300"
          >
            how it works
          </a>
        </div>
      </div>
    </div>

    <div className="my-3 h-px w-full bg-border/60" />

    {/* Logout */}
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-muted"
      aria-label="Logout"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 opacity-80">
        <path fill="currentColor" d="M10 17l5-5-5-5v3H3v4h7v3zm9-13H11a2 2 0 00-2 2v2h2V6h8v12h-8v-2H9v2a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2z"/>
      </svg>
      Logout
    </button>
  </>
)}
    </aside>
  );
}
