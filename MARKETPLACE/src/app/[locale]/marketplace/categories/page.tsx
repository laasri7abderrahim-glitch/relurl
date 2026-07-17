import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { marketplaceCategories } from "@/MARKETPLACE/src/data/categories"
import { ChevronRight } from "lucide-react"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isArabic = locale === "ar"
  return {
    title: isArabic ? "جميع الأقسام - MarocMarket" : "Toutes les catégories - MarocMarket",
    description: isArabic
      ? "تصفح جميع أقسام MarocMarket: عقارات، سيارات، إلكترونيات، وظائف، خدمات، وأكثر"
      : "Parcourez toutes les catégories MarocMarket: Immobilier, Automobile, High-Tech, Emploi, Services, et plus",
  }
}

export default async function CategoriesPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "marketplace" })
  const isArabic = locale === "ar"

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {isArabic ? "جميع الأقسام" : "Toutes les catégories"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {marketplaceCategories.map((cat) => (
          <div
            key={cat.slug}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
          >
            <Link
              href={`/marketplace/categories/${cat.slug}`}
              className="flex items-center justify-between mb-4 group"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                {isArabic ? cat.nameAr : cat.nameFr}
              </h2>
              <ChevronRight className={`w-5 h-5 text-gray-400 group-hover:text-primary transition-colors ${isArabic ? "rotate-180" : ""}`} />
            </Link>
            {cat.children && (
              <div className="grid grid-cols-2 gap-2">
                {cat.children.map((child) => (
                  <Link
                    key={child.slug}
                    href={`/marketplace/categories/${child.slug}`}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                  >
                    {isArabic ? child.nameAr : child.nameFr}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
