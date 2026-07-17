"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Heart, MapPin, Calendar, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FavoriteListing {
  id: string
  title: string
  price: number | null
  currency: string
  city: string
  image: string
  slug: string
  createdAt: string
  listingType: string
}

interface Props {
  locale: string
}

const MOCK_FAVORITES: FavoriteListing[] = []

export function FavoritesClient({ locale }: Props) {
  const t = useTranslations("marketplace")
  const isArabic = locale === "ar"
  const [favorites, setFavorites] = useState<FavoriteListing[]>(MOCK_FAVORITES)
  const [searchQuery, setSearchQuery] = useState("")

  const handleRemove = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id))
  }

  const filteredFavorites = favorites.filter((f) =>
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {isArabic ? "الإعلانات المفضلة" : "Mes favoris"}
        </h1>
        <span className="text-sm text-gray-500">
          {favorites.length} {isArabic ? "إعلان" : "annonces"}
        </span>
      </div>

      {favorites.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isArabic ? "بحث في المفضلة..." : "Rechercher dans les favoris..."}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <Heart className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            {isArabic ? "لا توجد إعلانات مفضلة" : "Aucune annonce favorite"}
          </p>
          <p className="text-sm text-gray-400 mb-4">
            {isArabic ? "أضف إعلانات إلى المفضلة لمتابعتها" : "Ajoutez des annonces à vos favoris pour les suivre"}
          </p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {isArabic ? "تصفح الإعلانات" : "Parcourir les annonces"}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFavorites.map((fav) => (
            <div
              key={fav.id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden group"
            >
              <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800">
                <img
                  src={fav.image}
                  alt={fav.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => handleRemove(fav.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-900/90 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {fav.listingType && (
                  <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-white text-xs font-medium rounded-lg">
                    {fav.listingType}
                  </span>
                )}
              </div>

              <div className="p-4">
                <Link href={`/marketplace/listing/${fav.slug}`}>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 hover:text-primary transition-colors">
                    {fav.title}
                  </h3>
                </Link>

                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {fav.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(fav.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-lg font-bold text-primary">
                    {fav.price != null
                      ? new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: fav.currency,
                          maximumFractionDigits: 0,
                        }).format(fav.price)
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}