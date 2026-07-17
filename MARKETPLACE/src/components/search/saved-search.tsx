"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Bookmark, Bell, BellOff, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MarketplaceSavedSearch, SearchFilters } from "@/MARKETPLACE/src/types"

interface Props {
  filters: SearchFilters
  locale: string
  savedSearches?: MarketplaceSavedSearch[]
  onSaveSearch?: (name: string, filters: SearchFilters) => void
  onDeleteSearch?: (id: string) => void
  onToggleAlerts?: (id: string, enabled: boolean) => void
}

export function SavedSearch({
  filters,
  locale,
  savedSearches = [],
  onSaveSearch,
  onDeleteSearch,
  onToggleAlerts,
}: Props) {
  const t = useTranslations("marketplace")
  const isArabic = locale === "ar"
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [searchName, setSearchName] = useState("")

  const hasActiveFilters = Boolean(
    filters.query ||
    filters.categoryId ||
    filters.city ||
    filters.listingType ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.condition
  )

  const handleSave = () => {
    if (searchName.trim() && onSaveSearch) {
      onSaveSearch(searchName.trim(), filters)
      setSearchName("")
      setShowSaveForm(false)
    }
  }

  return (
    <div className="space-y-4">
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSaveForm(!showSaveForm)}
            className="gap-2"
          >
            <Bookmark className="w-4 h-4" />
            {isArabic ? "حفظ البحث" : "Sauvegarder la recherche"}
          </Button>
        </div>
      )}

      {showSaveForm && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder={isArabic ? "اسم البحث..." : "Nom de la recherche..."}
            className="flex-1 px-3 py-1.5 text-sm border border-blue-200 dark:border-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button size="sm" onClick={handleSave}>
            {isArabic ? "حفظ" : "Enregistrer"}
          </Button>
        </div>
      )}

      {savedSearches.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isArabic ? "البحث المحفوظ" : "Recherches sauvegardées"}
          </h4>
          {savedSearches.map((search) => (
            <div
              key={search.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {search.name}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onToggleAlerts?.(search.id, !search.emailAlerts)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {search.emailAlerts ? (
                    <Bell className="w-4 h-4 text-blue-500" />
                  ) : (
                    <BellOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => onDeleteSearch?.(search.id)}
                  className="p-1.5 text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}