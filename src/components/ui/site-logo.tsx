"use client"

import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

const LETTERS = [
  { char: "R", gradient: true },
  { char: "E", gradient: true },
  { char: "L", gradient: true },
  { char: "U", gradient: false },
  { char: "R", gradient: false },
  { char: "L", gradient: false },
]

interface LogoMarkProps {
  className?: string
}

export function LogoMark({ className }: LogoMarkProps) {
  return (
    <div
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-xl",
        "bg-gradient-to-br from-primary to-accent",
        "shadow-lg shadow-primary/20 dark:shadow-primary/30",
        className
      )}
      aria-hidden="true"
    >
      <svg width="20" height="20" viewBox="0 0 100 100" fill="none" className="drop-shadow-sm">
        <rect x="28" y="18" width="12" height="64" rx="4" fill="white" />
        <rect x="40" y="18" width="28" height="12" rx="4" fill="white" />
        <path d="M68 28 C68 48 58 52 40 52 L40 28 Z" fill="white" />
        <path d="M54 46 L68 82 L58 82 L46 46 Z" fill="white" opacity="0.92" />
      </svg>
    </div>
  )
}

interface SiteLogoProps {
  href?: string
  className?: string
  markClassName?: string
  onClick?: () => void
}

export function SiteLogo({ href = "/", className, markClassName, onClick }: SiteLogoProps) {
  const content = (
    <>
      <LogoMark className={markClassName} />
      <span className="flex items-baseline gap-0.5 text-xl font-extrabold tracking-tight">
        {LETTERS.map((l) => (
          <span
            key={l.char}
            className={cn(
              "bg-clip-text",
              l.gradient ? "text-gradient" : "text-foreground"
            )}
          >
            {l.char}
          </span>
        ))}
        <span className="ml-1 inline-flex text-xs font-normal tracking-widest uppercase text-muted-foreground/50">
          .com
        </span>
      </span>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn("group inline-flex items-center gap-2.5", className)}
        aria-label="RELURL logo"
      >
        {content}
      </Link>
    )
  }

  return <span className={cn("inline-flex items-center gap-2.5", className)}>{content}</span>
}