import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { MapPin } from "lucide-react"
import { moroccanCities } from "@/MARKETPLACE/src/data/cities"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isArabic = locale === "ar"
  return {
    title: isArabic ? "جميع المدن - MarocMarket" : "Toutes les villes - MarocMarket",
    description: isArabic
      ? "تصفح الإعلانات المبوبة حسب المدينة في جميع أنحاء المغرب"
      : "Parcourez les annonces classées par ville dans tout le Maroc",
  }
}

export default async function CitiesPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "marketplace" })
  const isArabic = locale === "ar"

  const grouped = moroccanCities.reduce(
    (acc, city) => {
      if (!acc[city.region]) acc[city.region] = []
      acc[city.region].push(city)
      return acc
    },
    {} as Record<string, typeof moroccanCities>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {isArabic ? "جميع المدن" : "Toutes les villes"}
      </h1>

      <div className="space-y-8">
        {Object.entries(grouped).map(([region, cities]) => (
          <div key={region}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {region}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {cities.map((city) => (
                <Link
                  key={city.nameFr}
                  href={`/marketplace/search?city=${encodeURIComponent(city.nameFr)}`}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-primary/5 border border-gray-200 dark:border-gray-700 hover:border-primary/30 transition-all group"
                >
                  <MapPin className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                      {city.nameFr}
                    </span>
                    <span className="text-xs text-gray-400 block">
                      {city.nameAr}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
