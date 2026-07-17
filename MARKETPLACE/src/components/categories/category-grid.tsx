"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import {
  Building2, Car, Laptop, Home, Shirt, Briefcase, Handshake, PawPrint,
  Sprout, Factory, Dumbbell, Plane, BookOpen, HeartPulse,
  ChevronRight,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  building: Building2,
  car: Car,
  laptop: Laptop,
  home: Home,
  shirt: Shirt,
  briefcase: Briefcase,
  handshake: Handshake,
  "paw-print": PawPrint,
  sprout: Sprout,
  factory: Factory,
  dumbbell: Dumbbell,
  plane: Plane,
  "book-open": BookOpen,
  "heart-pulse": HeartPulse,
}

const categories = [
  { slug: "immobilier", icon: "building", color: "#4f46e5" },
  { slug: "automobile", icon: "car", color: "#dc2626" },
  { slug: "highTech", icon: "laptop", color: "#2563eb" },
  { slug: "maison", icon: "home", color: "#059669" },
  { slug: "mode", icon: "shirt", color: "#db2777" },
  { slug: "emploi", icon: "briefcase", color: "#0891b2" },
  { slug: "services", icon: "handshake", color: "#ca8a04" },
  { slug: "animaux", icon: "paw-print", color: "#65a30d" },
  { slug: "agriculture", icon: "sprout", color: "#16a34a" },
  { slug: "industrie", icon: "factory", color: "#7c3aed" },
  { slug: "sports", icon: "dumbbell", color: "#ea580c" },
  { slug: "tourisme", icon: "plane", color: "#0d9488" },
  { slug: "education", icon: "book-open", color: "#6366f1" },
  { slug: "sante", icon: "heart-pulse", color: "#e11d48" },
]

interface Props {
  locale: string
}

export function CategoryGrid({ locale }: Props) {
  const t = useTranslations("marketplace")
  const isArabic = locale === "ar"

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t("categories.title")}
          </h2>
          <Link
            href="/marketplace/categories"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            {t("categories.viewAll")}
            <ChevronRight className={`w-4 h-4 ${isArabic ? "rotate-180" : ""}`} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map(({ slug, icon, color }) => {
            const Icon = iconMap[icon]
            const name = t(`categories.${slug}` as any)
            const count = t(`categories.${slug}Count` as any)

            return (
              <Link
                key={slug}
                href={`/marketplace/categories/${slug}`}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${color}15` }}
                >
                  {Icon && <Icon className="w-6 h-6" style={{ color }} />}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                  {name}
                </span>
                {count && (
                  <span className="text-xs text-gray-400">{count}</span>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
