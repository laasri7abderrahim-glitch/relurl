"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Search, MapPin, ArrowRight } from "lucide-react"

interface Props {
  locale: string
}

export function HeroSection({ locale }: Props) {
  const t = useTranslations("marketplace")
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [city, setCity] = useState("")
  const isArabic = locale === "ar"

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (city) params.set("city", city)
    router.push(`/marketplace/search?${params.toString()}`)
  }

  return (
    <section className="relative bg-gradient-to-br from-primary via-primary/80 to-primary/60 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            {isArabic ? (
              <>
                أول سوق إلكتروني
                <br />
                <span className="text-yellow-300">في المغرب</span>
              </>
            ) : (
              <>
                La première marketplace
                <br />
                <span className="text-yellow-300">au Maroc</span>
              </>
            )}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {isArabic
              ? "اشترِ، بيع، أو استأجر بسهولة وأمان. آلاف الإعلانات في جميع أنحاء المغرب."
              : "Achetez, vendez ou louez facilement et en toute sécurité. Des milliers d'annonces partout au Maroc."}
          </p>

          <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-2xl max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("search.placeholder")}
                  className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
                  dir={isArabic ? "rtl" : "ltr"}
                />
              </div>
              <div className="relative md:w-48">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none appearance-none cursor-pointer"
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  <option value="">
                    {isArabic ? "جميع المدن" : "Toutes les villes"}
                  </option>
                  <option value="Casablanca">Casablanca</option>
                  <option value="Rabat">Rabat</option>
                  <option value="Marrakech">Marrakech</option>
                  <option value="Agadir">Agadir</option>
                  <option value="Tanger">Tanger</option>
                  <option value="Fès">Fès</option>
                </select>
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium flex items-center gap-2 justify-center"
              >
                {isArabic ? "بحث" : "Rechercher"}
                <ArrowRight className={`w-4 h-4 ${isArabic ? "rotate-180" : ""}`} />
              </button>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-white/70 text-sm">
            <span>{isArabic ? "الإعلانات المميزة:" : "Annonces populaires :"}</span>
            <a href="/marketplace/categories/immobilier" className="hover:text-white transition-colors">
              {isArabic ? "عقارات" : "Immobilier"}
            </a>
            <a href="/marketplace/categories/automobile" className="hover:text-white transition-colors">
              {isArabic ? "سيارات" : "Voitures"}
            </a>
            <a href="/marketplace/categories/high-tech" className="hover:text-white transition-colors">
              {isArabic ? "إلكترونيات" : "High-Tech"}
            </a>
            <a href="/marketplace/categories/emploi" className="hover:text-white transition-colors">
              {isArabic ? "وظائف" : "Emploi"}
            </a>
            <a href="/marketplace/categories/services" className="hover:text-white transition-colors">
              {isArabic ? "خدمات" : "Services"}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
