"use client"

import { useTranslations } from "next-intl"
import { ListingCard } from "./listing-card"
import type { MarketplaceListing } from "@/MARKETPLACE/src/types"

interface Props {
  categoryId: string
  excludeId: string
  locale: string
}

export function SimilarListings({ categoryId, excludeId, locale }: Props) {
  const t = useTranslations("marketplace")

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {locale === "ar" ? "إعلانات مشابهة" : "Annonces similaires"}
      </h2>
      <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-2xl">
        <p>{t("listings.noSimilar")}</p>
      </div>
    </section>
  )
}
