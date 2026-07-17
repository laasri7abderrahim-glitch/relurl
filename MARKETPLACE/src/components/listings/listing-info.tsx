"use client"

import { useTranslations } from "next-intl"
import {
  MapPin, Calendar, Eye, Tag, Box, Ruler, Bed, Bath,
  Gauge, Fuel, SteeringWheel, Phone, MessageCircle,
  BadgeCheck, Clock, AlertCircle,
} from "lucide-react"
import { formatPrice, formatDate } from "@/MARKETPLACE/src/lib/utils"
import type { MarketplaceListing } from "@/MARKETPLACE/src/types"

interface Props {
  listing: MarketplaceListing
  locale: string
}

export function ListingInfo({ listing, locale }: Props) {
  const t = useTranslations("marketplace")
  const isArabic = locale === "ar"

  const details = [
    { label: t("listings.city"), value: listing.city, icon: MapPin },
    { label: t("listings.region"), value: listing.region, icon: MapPin },
    { label: t("listings.condition"), value: listing.condition, icon: Tag },
    { label: t("listings.brand"), value: listing.brand, icon: Box },
    { label: t("listings.model"), value: listing.model, icon: Box },
    { label: t("listings.year"), value: listing.year?.toString(), icon: Calendar },
    { label: t("listings.surface"), value: listing.surface ? `${listing.surface} m²` : null, icon: Ruler },
    { label: t("listings.rooms"), value: listing.rooms?.toString(), icon: Bed },
    { label: t("listings.bedrooms"), value: listing.bedrooms?.toString(), icon: Bed },
    { label: t("listings.bathrooms"), value: listing.bathrooms?.toString(), icon: Bath },
  ]

  const displayedDetails = details.filter((d) => d.value)

  return (
    <div className="mt-8 space-y-8">
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {listing.title}
          </h1>
          <div className="flex items-center gap-2">
            {listing.isPromoted && (
              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-medium rounded-full">
                {isArabic ? "مميز" : "Promu"}
              </span>
            )}
            {listing.isUrgent && (
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium rounded-full">
                {isArabic ? "عاجل" : "Urgent"}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {listing.city}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(listing.createdAt, locale)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {listing.viewsCount} {t("listings.views")}
          </span>
          {listing.user?.isVerified && (
            <span className="flex items-center gap-1 text-blue-500">
              <BadgeCheck className="w-4 h-4" />
              {isArabic ? "بائع موثوق" : "Vendeur vérifié"}
            </span>
          )}
        </div>

        {listing.price != null && (
          <p className="text-3xl font-bold text-primary mt-4">
            {formatPrice(listing.price, listing.currency)}
            {listing.isNegotiable && (
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal mr-2">
                ({isArabic ? "قابل للتفاوض" : "Négociable"})
              </span>
            )}
          </p>
        )}

        {listing.expiresAt && (
          <div className="flex items-center gap-2 mt-2 text-sm text-orange-600 dark:text-orange-400">
            <Clock className="w-4 h-4" />
            {isArabic ? "ينتهي في" : "Expire le"}{" "}
            {new Date(listing.expiresAt).toLocaleDateString("fr-FR")}
          </div>
        )}
      </div>

      {displayedDetails.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
          {displayedDetails.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {t("listings.description")}
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
            {listing.description}
          </p>
        </div>
      </div>

      {listing.tags && (
        <div className="flex flex-wrap gap-2">
          {listing.tags.split(",").map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400 rounded-full"
            >
              {tag.trim()}
            </span>
          ))}
        </div>
      )}

      {listing.latitude && listing.longitude && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {isArabic ? "الموقع على الخريطة" : "Localisation sur la carte"}
          </h3>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-500">
            {isArabic ? "الخريطة قيد التطوير" : "Carte en cours de développement"}
          </div>
        </div>
      )}
    </div>
  )
}
