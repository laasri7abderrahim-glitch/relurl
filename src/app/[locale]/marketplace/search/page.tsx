import { getTranslations } from "next-intl/server"
import { SearchForm } from "@/MARKETPLACE/src/components/search/search-form"
import { ListingCard } from "@/MARKETPLACE/src/components/listings/listing-card"
import { SearchFilters } from "@/MARKETPLACE/src/components/search/search-filters"
import { SavedSearch } from "@/MARKETPLACE/src/components/search/saved-search"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string>>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isArabic = locale === "ar"
  return {
    title: isArabic ? "بحث - MarocMarket" : "Recherche - MarocMarket",
    description: isArabic
      ? "ابحث عن آلاف الإعلانات المبوبة في المغرب"
      : "Recherchez parmi des milliers d'annonces classées au Maroc",
  }
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params
  const sp = await searchParams
  const t = await getTranslations({ locale, namespace: "marketplace" })
  const isArabic = locale === "ar"

  const query = sp.q || ""
  const city = sp.city || ""
  const category = sp.category || ""

  const filters = {
    query,
    city,
    categoryId: category,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {isArabic ? "بحث" : "Recherche"}
        {query && (
          <span className="text-primary ml-2">
            : &ldquo;{query}&rdquo;
          </span>
        )}
      </h1>

      <SearchForm
        locale={locale}
        initialQuery={query}
        initialCity={city}
        initialCategory={category}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        <aside className="lg:col-span-1 space-y-6">
          <SearchFilters locale={locale} />
          <SavedSearch
            filters={filters}
            locale={locale}
          />
        </aside>
        <div className="lg:col-span-3">
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg">{t("search.noResults")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
