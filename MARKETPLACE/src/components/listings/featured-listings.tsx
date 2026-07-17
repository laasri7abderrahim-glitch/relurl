"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { ListingCard } from "./listing-card"
import { ChevronRight } from "lucide-react"
import type { MarketplaceListing } from "@/MARKETPLACE/src/types"

interface Props {
  locale: string
}

const featuredListings: MarketplaceListing[] = []

export function FeaturedListings({ locale }: Props) {
  const t = useTranslations("marketplace")
  const isArabic = locale === "ar"

  if (featuredListings.length === 0) {
    return (
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t("listings.featured")}
            </h2>
            <Link
              href="/marketplace/search"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              {t("listings.viewAll")}
              <ChevronRight className={`w-4 h-4 ${isArabic ? "rotate-180" : ""}`} />
            </Link>
          </div>

          <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-2xl">
            <p className="text-lg mb-2">{t("listings.noListings")}</p>
            <p className="text-sm">{t("listings.beFirst")}</p>
            <Link
              href="/marketplace/create"
              className="inline-block mt-4 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              {t("listings.createFirst")}
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t("listings.featured")}
          </h2>
          <Link
            href="/marketplace/search"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            {t("listings.viewAll")}
            <ChevronRight className={`w-4 h-4 ${isArabic ? "rotate-180" : ""}`} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.slice(0, 8).map((listing) => (
            <ListingCard key={listing.id} listing={listing} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  )
}
