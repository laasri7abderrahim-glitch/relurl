"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "@/i18n/navigation"

const letters = [
  { char: "R", color: "from-primary to-accent" },
  { char: "E", color: "from-primary to-accent" },
  { char: "L", color: "from-primary to-accent" },
  { char: "U", color: "text-foreground" },
  { char: "R", color: "text-foreground" },
  { char: "L", color: "text-foreground" },
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
      className="flex items-center gap-0 text-xl font-bold tracking-tight"
    >
      {letters.map((l, i) => (
        <span
          key={i}
          className={l.color + " bg-clip-text"}
          style={{
            display: "inline-block",
            opacity: isFirstVisit ? (revealed.includes(i) ? 1 : 0) : 1,
            transform: isFirstVisit
              ? revealed.includes(i)
                ? "translateY(0px) rotate(0deg)"
                : "translateY(-40px) rotate(-15deg)"
              : "translateY(0px) rotate(0deg)",
            transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)`,
            transitionDelay: isFirstVisit ? "0ms" : "0ms",
          }}
        >
          {l.char}
        </span>
      ))}
      <span
        style={{
          display: "inline-block",
          opacity: isFirstVisit ? (revealed.includes(5) ? 1 : 0) : 1,
          transition: "opacity 0.4s ease",
          transitionDelay: "0.9s",
          marginLeft: "0.15em",
        }}
      >
        <span className="inline-flex text-xs text-muted-foreground/40 font-normal ml-1.5 tracking-widest uppercase">
          .com
        </span>
      </span>
    </Link>
  )
}
