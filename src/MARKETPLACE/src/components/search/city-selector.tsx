"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { MapPin, ChevronRight } from "lucide-react"

interface Props {
  locale: string
}

const cities = [
  "Casablanca", "Rabat", "Marrakech", "Agadir", "Tanger",
  "Fès", "Meknès", "Oujda", "Laâyoune", "Nador",
  "Tétouan", "Kénitra", "Safi", "El Jadida", "Béni Mellal",
]

export function CitySelector({ locale }: Props) {
  const t = useTranslations("marketplace")
  const isArabic = locale === "ar"

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            {t("cities.title")}
          </h2>
          <Link
            href="/marketplace/cities"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            {t("cities.viewAll")}
            <ChevronRight className={`w-4 h-4 ${isArabic ? "rotate-180" : ""}`} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {cities.map((city) => (
            <Link
              key={city}
              href={`/marketplace/search?city=${encodeURIComponent(city)}`}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-primary/5 hover:border-primary/30 border border-gray-200 dark:border-gray-700 transition-all group"
            >
              <MapPin className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                {city}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
