"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

const letters = [
  { char: "R", gradient: true },
  { char: "E", gradient: true },
  { char: "L", gradient: true },
  { char: "U", gradient: false },
  { char: "R", gradient: false },
  { char: "L", gradient: false },
]

export function FirstVisitLogo() {
  const [started, setStarted] = useState(false)
  const [revealed, setRevealed] = useState<number[]>([])
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  const ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const hasVisited = localStorage.getItem("relurl_visited")
    if (hasVisited) {
      setIsFirstVisit(false)
      setRevealed(letters.map((_, i) => i))
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.05 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    letters.forEach((_, i) => {
      setTimeout(() => {
        setRevealed((prev) => [...prev, i])
        if (i === letters.length - 1) {
          localStorage.setItem("relurl_visited", "true")
        }
      }, i * 120 + 200)
    })
  }, [started])

  return (
    <Link
      ref={ref}
      href="/"
      className="group flex items-center gap-2 text-xl font-extrabold tracking-tight"
    >
      <span
        className={cn(
          "transition-transform duration-500 group-hover:-rotate-6",
          isFirstVisit && "translateY"
        )}
        style={{
          display: "inline-block",
          opacity: isFirstVisit ? (revealed.includes(0) ? 1 : 0) : 1,
          transform: isFirstVisit
            ? revealed.includes(0)
              ? "translateY(0px) scale(1)"
              : "translateY(-20px) scale(0.6) rotate(-12deg)"
              : "translateY(0px) scale(1)",
          transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <LogoMark />
      </span>
      {letters.map((l, i) => (
        <span
          key={i}
          className={cn("bg-clip-text", l.gradient ? "text-gradient" : "text-foreground")}
          style={{
            display: "inline-block",
            opacity: isFirstVisit ? (revealed.includes(i) ? 1 : 0) : 1,
            transform: isFirstVisit
              ? revealed.includes(i)
                ? "translateY(0px) rotate(0deg)"
                : "translateY(-40px) rotate(-15deg)"
              : "translateY(0px) rotate(0deg)",
            transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)`,
          }}
        >
          {l.char}
        </span>
      ))}
      <span
        className="inline-flex text-xs text-muted-foreground/40 font-normal ml-1 tracking-widest uppercase"
        style={{
          opacity: isFirstVisit ? (revealed.includes(5) ? 1 : 0) : 1,
          transition: "opacity 0.4s ease",
          transitionDelay: "0.6s",
        }}
      >
        .com
      </span>
    </Link>
  )
}

function LogoMark() {
  return (
    <div
      className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20"
      aria-hidden="true"
    >
      <svg width="16" height="16" viewBox="0 0 100 100" fill="none">
        <rect x="28" y="18" width="12" height="64" rx="4" fill="white" />
        <rect x="40" y="18" width="28" height="12" rx="4" fill="white" />
        <path d="M68 28 C68 48 58 52 40 52 L40 28 Z" fill="white" />
        <path d="M54 46 L68 82 L58 82 L46 46 Z" fill="white" opacity="0.92" />
      </svg>
    </div>
  )
}