"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "URL Shortener", href: "/custom-url-shortener" },
  { label: "QR Codes", href: "/qr-code-generator" },
  { label: "Social Links", href: "/instagram-link-generator" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
]

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 text-dark-100 hover:text-dark-50 hover:bg-dark-300 transition-colors"
        title="Toggle theme"
      >
        {resolvedTheme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-dark-500 border border-dark-100 rounded-lg shadow-lg py-1 min-w-[140px]">
            <button
              type="button"
              onClick={() => { setTheme("light"); setOpen(false) }}
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors hover:bg-dark-300",
                resolvedTheme === "light" ? "text-[#2FA084] font-medium" : "text-dark-100"
              )}
            >
              <Sun className="h-4 w-4" /> Light
            </button>
            <button
              type="button"
              onClick={() => { setTheme("dark"); setOpen(false) }}
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors hover:bg-dark-300",
                resolvedTheme === "dark" ? "text-[#2FA084] font-medium" : "text-dark-100"
              )}
            >
              <Moon className="h-4 w-4" /> Dark
            </button>
            <button
              type="button"
              onClick={() => { setTheme("system"); setOpen(false) }}
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors hover:bg-dark-300",
                theme === "system" ? "text-[#2FA084] font-medium" : "text-dark-100"
              )}
            >
              <Monitor className="h-4 w-4" /> System
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-100 bg-dark-700/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-dark-50"
        >
          <span className="text-primary-500">REL</span>
          <span>URL</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-dark-100 transition-colors hover:text-dark-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">Sign Up</Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-6 w-6 text-dark-50" />
            ) : (
              <Menu className="h-6 w-6 text-dark-50" />
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "container overflow-hidden transition-all duration-300 md:hidden",
          mobileOpen ? "max-h-80 pb-6" : "max-h-0"
        )}
      >
        <nav className="flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-dark-100 transition-colors hover:text-dark-50"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">Sign Up</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

export { Header }
