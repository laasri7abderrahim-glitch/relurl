"use client"

import { useTranslations } from "next-intl"
import { SlidersHorizontal } from "lucide-react"

interface Props {
  locale: string
}

export function SearchFilters({ locale }: Props) {
  const t = useTranslations("marketplace")
  const isArabic = locale === "ar"

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="w-5 h-5" />
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          {isArabic ? "تصفية" : "Filtres"}
        </h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {isArabic ? "نوع الإعلان" : "Type d'annonce"}
          </label>
          <div className="space-y-2">
            {["VENTE", "LOCATION", "SERVICE", "EMPLOI"].map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {type === "VENTE" ? (isArabic ? "بيع" : "Vente") :
                   type === "LOCATION" ? (isArabic ? "إيجار" : "Location") :
                   type === "SERVICE" ? (isArabic ? "خدمة" : "Service") :
                   (isArabic ? "وظيفة" : "Emploi")}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {isArabic ? "السعر" : "Prix"}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder={isArabic ? "من" : "Min"}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder={isArabic ? "إلى" : "Max"}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {isArabic ? "الحالة" : "État"}
          </label>
          <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value="">{isArabic ? "الكل" : "Tous"}</option>
            <option value="Neuf">{isArabic ? "جديد" : "Neuf"}</option>
            <option value="Comme neuf">{isArabic ? "كالجديد" : "Comme neuf"}</option>
            <option value="Bon état">{isArabic ? "حالة جيدة" : "Bon état"}</option>
            <option value="Acceptable">{isArabic ? "مقبول" : "Acceptable"}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {isArabic ? "ترتيب حسب" : "Trier par"}
          </label>
          <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value="date_desc">{isArabic ? "الأحدث" : "Plus récents"}</option>
            <option value="date_asc">{isArabic ? "الأقدم" : "Plus anciens"}</option>
            <option value="price_asc">{isArabic ? "السعر: الأقل أولاً" : "Prix: croissant"}</option>
            <option value="price_desc">{isArabic ? "السعر: الأعلى أولاً" : "Prix: décroissant"}</option>
            <option value="views">{isArabic ? "الأكثر مشاهدة" : "Plus vus"}</option>
          </select>
        </div>

        <button className="w-full px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-sm font-medium">
          {isArabic ? "تطبيق التصفية" : "Appliquer les filtres"}
        </button>
      </div>
    </div>
  )
}
