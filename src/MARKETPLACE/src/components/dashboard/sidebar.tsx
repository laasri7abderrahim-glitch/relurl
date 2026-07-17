"use client"

import Link from "next/link"
import { usePathname } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import {
  LayoutDashboard, List, Heart, MessageCircle, Star, Settings,
  BarChart3, PlusCircle, LogOut, Crown,
} from "lucide-react"

interface Props {
  locale: string
}

const links = [
  { href: "/marketplace/dashboard", icon: LayoutDashboard, key: "overview" },
  { href: "/marketplace/dashboard/my-listings", icon: List, key: "myListings" },
  { href: "/marketplace/dashboard/favorites", icon: Heart, key: "favorites" },
  { href: "/marketplace/dashboard/messages", icon: MessageCircle, key: "messages" },
  { href: "/marketplace/dashboard/reviews", icon: Star, key: "reviews" },
  { href: "/marketplace/dashboard/stats", icon: BarChart3, key: "stats" },
  { href: "/marketplace/dashboard/subscriptions", icon: Crown, key: "subscription" },
  { href: "/marketplace/dashboard/settings", icon: Settings, key: "settings" },
]

export function DashboardSidebar({ locale }: Props) {
  const t = useTranslations("marketplace")
  const pathname = usePathname()
  const isArabic = locale === "ar"

  return (
    <nav className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 space-y-1">
      {links.map(({ href, icon: Icon, key }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Icon className="w-4 h-4" />
            {t(`dashboard.${key}` as any)}
          </Link>
        )
      })}

      <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
        <Link
          href="/marketplace/create"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          {t("dashboard.createAd")}
        </Link>
      </div>
    </nav>
  )
}
