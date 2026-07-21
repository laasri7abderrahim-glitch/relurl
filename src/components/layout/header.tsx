"use client"

import { useState, useRef, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Menu, X, ChevronDown, Link2, QrCode, BarChart3, Globe, Shield, Zap, Sliders, Users, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { LocaleSwitcher } from "@/components/layout/locale-switcher"

const navLinks = [
  { label: "layout.nav.features", href: "/features" },
  { label: "layout.nav.pricing", href: "/pricing" },
  { label: "layout.nav.blog", href: "/blog" },
  { label: "layout.nav.contact", href: "/contact" },
]

const platformItems = [
  {
    group: "Products",
    items: [
      { icon: Link2, label: "URL Shortener", desc: "Customize, share and track links", href: "/custom-url-shortener" },
      { icon: QrCode, label: "QR Code Generator", desc: "Dynamic solutions for every need", href: "/qr-code-generator" },
      { icon: BarChart3, label: "Analytics", desc: "Track and analyze performance", href: "/features" },
      { icon: Globe, label: "Branded Links", desc: "Custom links with your domain", href: "/branded-link-shortener" },
    ],
  },
  {
    group: "Features",
    items: [
      { icon: Zap, label: "Link-in-bio", desc: "Curate links for social profiles", href: "/instagram-link-generator" },
      { icon: Shield, label: "Link Health", desc: "Monitor your link performance", href: "/features" },
      { icon: Sliders, label: "UTM Builder", desc: "Track with UTM parameters", href: "/features" },
      { icon: Users, label: "Team Collaboration", desc: "Work together seamlessly", href: "/features" },
      { icon: Zap, label: "Browser Extension", desc: "Shorten links with one click", href: "/browser-extension" },
    ],
  },
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
        aria-label="Toggle theme"
      >
        {resolvedTheme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-dark-500 border border-dark-100 rounded-xl shadow-dropdown py-1 min-w-[140px]">
            <button
              type="button"
              onClick={() => { setTheme("light"); setOpen(false) }}
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors hover:bg-dark-300",
                resolvedTheme === "light" ? "text-primary font-medium" : "text-dark-100"
              )}
            >
              <Sun className="h-4 w-4" /> Light
            </button>
            <button
              type="button"
              onClick={() => { setTheme("dark"); setOpen(false) }}
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors hover:bg-dark-300",
                resolvedTheme === "dark" ? "text-primary font-medium" : "text-dark-100"
              )}
            >
              <Moon className="h-4 w-4" /> Dark
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function MegaMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1 text-sm font-medium transition-colors",
          open ? "text-primary" : "text-dark-100 hover:text-dark-50"
        )}
      >
        Platform <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-3 z-50 w-[580px] bg-dark-500 border border-dark-100 rounded-2xl shadow-dropdown p-5 animate-fade-in-down">
            <div className="grid grid-cols-2 gap-4">
              {platformItems.map((section) => (
                <div key={section.group}>
                  <p className="text-xs font-semibold text-dark-100 uppercase tracking-wider mb-3 px-3">{section.group}</p>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-primary/5 group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                          <item.icon className="w-4.5 h-4.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-dark-50">{item.label}</p>
                          <p className="text-xs text-dark-100 mt-0.5">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-dark-100/30">
              <Link
                href="/features"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-dark-100 hover:text-primary hover:bg-primary/5 transition-colors"
              >
                View all features <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = useTranslations()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-100/60 bg-dark-700/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xl font-bold tracking-tight"
        >
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">REL</span>
          <span className="text-dark-50">URL</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <MegaMenu />
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-dark-100 transition-colors hover:text-dark-50"
            >
              {t(link.label)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <div className="w-px h-6 bg-dark-100/30 mx-1" />
          <LocaleSwitcher />
          <div className="w-px h-6 bg-dark-100/30 mx-1" />
          <Link href="/login">
            <Button variant="ghost" size="sm">{t("layout.nav.login")}</Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25">{t("layout.nav.signUp")}</Button>
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="mobile-touch-target rounded-lg hover:bg-dark-300 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
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
          mobileOpen ? "max-h-[32rem] pb-6" : "max-h-0"
        )}
      >
        <nav className="flex flex-col gap-1">
          <div className="flex flex-col gap-0.5 pt-2">
            <p className="text-xs font-semibold text-dark-100 uppercase tracking-wider px-4 mb-1 mt-2">Platform</p>
            {platformItems.flatMap(s => s.items).map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 min-h-[44px] text-sm font-medium text-dark-100 hover:text-dark-50 hover:bg-dark-300 transition-colors"
              >
                <item.icon className="w-5 h-5 text-primary" />
                {item.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-dark-300/50 my-2 mx-4" />
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center min-h-[44px] px-4 text-sm font-medium text-dark-100 transition-colors hover:text-dark-50 hover:bg-dark-300 rounded-xl"
            >
              {t(link.label)}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-3 px-4 pb-2">
            <Link href="/login">
              <Button variant="ghost" className="w-full h-12 text-sm" size="default">{t("layout.nav.login")}</Button>
            </Link>
            <Link href="/register">
              <Button className="w-full h-12 text-sm bg-gradient-to-r from-primary to-accent text-white" size="default">{t("layout.nav.signUp")}</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

export { Header }
