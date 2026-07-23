"use client"

import { useEffect, useRef } from "react"

export function RevealAnimations({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.querySelectorAll(".reveal").forEach((el) => el.classList.add("revealed"))
        return
      }
    } catch {}

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )

    const elements = rootRef.current?.querySelectorAll(".reveal") ?? []
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return <div ref={rootRef}>{children}</div>
}
