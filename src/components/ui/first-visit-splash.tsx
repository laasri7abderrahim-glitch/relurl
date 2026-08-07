"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LogoMark } from "@/components/ui/site-logo"

const WORD = ["R", "E", "L", "U", "R", "L"]

export function FirstVisitSplash() {
  const [show, setShow] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Only ever show once per browser (and only on the marketing app,
    // never inside the authenticated dashboard/admin areas).
    const isAuthenticatedArea =
      pathname.includes("/dashboard") ||
      pathname.includes("/admin") ||
      pathname.includes("/login") ||
      pathname.includes("/register")

    let visited: string | null = null
    try {
      visited = localStorage.getItem("relurl_visited")
    } catch {}

    if (visited || isAuthenticatedArea) return

    setShow(true)
    try {
      localStorage.setItem("relurl_visited", "true")
    } catch {}

    const t = setTimeout(() => setLeaving(true), 1850)
    const unmount = setTimeout(() => setShow(false), 2450)
    return () => {
      clearTimeout(t)
      clearTimeout(unmount)
    }
  }, [pathname])

  if (!show) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center",
        "bg-background transition-opacity duration-500",
        leaving ? "opacity-0" : "opacity-100"
      )}
      aria-hidden="true"
    >
      <div className="relative flex h-20 w-20 items-center justify-center">
        <span className="splash-ring absolute inset-0 rounded-2xl border-2 border-primary/30" />
        <span
          className="splash-ring absolute inset-0 rounded-2xl border-2 border-accent/30"
          style={{ animationDelay: "0.35s" }}
        />
        <div className="splash-mark">
          <LogoMark className="h-20 w-20 rounded-2xl" />
        </div>
      </div>

      <div className="mt-6 flex items-baseline text-4xl font-extrabold tracking-tight">
        {WORD.map((ch, i) => (
          <span
            key={i}
            className={cn(
              "splash-letter bg-clip-text",
              i < 3 ? "text-gradient" : "text-foreground"
            )}
            style={{ animationDelay: `${0.15 + i * 0.09}s` }}
          >
            {ch}
          </span>
        ))}
        <span
          className="splash-letter ml-1 inline-flex text-sm font-normal uppercase tracking-widest text-muted-foreground/50"
          style={{ animationDelay: "0.85s" }}
        >
          .com
        </span>
      </div>

      <div className="mt-6 h-1 w-44 overflow-hidden rounded-full bg-muted">
        <div className="splash-bar h-full rounded-full bg-gradient-to-r from-primary to-accent" />
      </div>
    </div>
  )
}