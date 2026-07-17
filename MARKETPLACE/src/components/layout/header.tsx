"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useRouter, usePathname } from "@/i18n/navigation"
import {
  Search,
  Bell,
  Heart,
  PlusCircle,
  User,
  Menu,
  X,
  Globe,
  Moon,
  Sun,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

interface Props {
  locale: string
}

export function MarketplaceHeader({ locale }: Props) {
  const t = useTranslations("marketplace")
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const isArabic = locale === "ar"

  const switchLocale = () => {
    const next = locale === "fr" ? "ar" : "fr"
    router.replace(pathname, { locale: next })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/marketplace/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/marketplace"
            className="flex items-center gap-2 text-xl font-bold text-primary"
          >
            <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm font-bold">
              M
            </span>
            MarocMarket
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search.placeholder")}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </form>

          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={switchLocale}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Globe className="w-4 h-4" />
              {locale === "fr" ? "FR" : "AR"}
            </button>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              href="/marketplace/dashboard/favorites"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Heart className="w-5 h-5" />
            </Link>

            <Link
              href="/marketplace/dashboard/notifications"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
            </Link>

            <Link href="/marketplace/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                {t("nav.profile")}
              </Button>
            </Link>

            <Link href="/marketplace/create">
              <Button size="sm" className="gap-2">
                <PlusCircle className="w-4 h-4" />
                {t("nav.createAd")}
              </Button>
            </Link>
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search.placeholder")}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
              />
            </div>
          </form>
          <div className="flex flex-col gap-2">
            <Link
              href="/marketplace/create"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <PlusCircle className="w-4 h-4" />
              {t("nav.createAd")}
            </Link>
            <Link
              href="/marketplace/dashboard/favorites"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart className="w-4 h-4" />
              {t("nav.favorites")}
            </Link>
            <Link
              href="/marketplace/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="w-4 h-4" />
              {t("nav.profile")}
            </Link>
            <button
              onClick={() => {
                switchLocale()
                setMobileMenuOpen(false)
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Globe className="w-4 h-4" />
              {locale === "fr" ? "العربية" : "Français"}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
