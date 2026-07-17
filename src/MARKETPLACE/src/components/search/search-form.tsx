"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { Search, MapPin } from "lucide-react"

interface Props {
  locale: string
  initialQuery?: string
  initialCity?: string
  initialCategory?: string
}

export function SearchForm({ locale, initialQuery = "", initialCity = "", initialCategory = "" }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [city, setCity] = useState(initialCity)
  const isArabic = locale === "ar"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (city) params.set("city", city)
    if (initialCategory) params.set("category", initialCategory)
    router.push(`/marketplace/search?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isArabic ? "ابحث عن..." : "Rechercher..."}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
            dir={isArabic ? "rtl" : "ltr"}
          />
        </div>
        <div className="md:w-52 relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
            dir={isArabic ? "rtl" : "ltr"}
          >
            <option value="">{isArabic ? "جميع المدن" : "Toutes les villes"}</option>
            <option value="Casablanca">Casablanca</option>
            <option value="Rabat">Rabat</option>
            <option value="Marrakech">Marrakech</option>
            <option value="Agadir">Agadir</option>
            <option value="Tanger">Tanger</option>
            <option value="Fès">Fès</option>
            <option value="Meknès">Meknès</option>
            <option value="Oujda">Oujda</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium"
        >
          {isArabic ? "بحث" : "Rechercher"}
        </button>
      </div>
    </form>
  )
}
