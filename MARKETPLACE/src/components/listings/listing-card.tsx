"use client"

import Link from "next/link"
import { Heart, MapPin, Eye, Image as ImageIcon } from "lucide-react"
import { formatPrice, formatRelativeDate } from "@/MARKETPLACE/src/lib/utils"
import type { MarketplaceListing } from "@/MARKETPLACE/src/types"

interface Props {
  listing: MarketplaceListing
  locale: string
}

export function ListingCard({ listing, locale }: Props) {
  const isArabic = locale === "ar"
  const primaryImage = listing.images?.[0]
  const imageCount = listing._count?.images ?? listing.images?.length ?? 0

  return (
    <Link
      href={`/marketplace/listing/${listing.slug}`}
      className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all"
    >
      <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt || listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-gray-300 dark:text-gray-600" />
          </div>
        )}

        {listing.isPromoted && (
          <span className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-md">
            {isArabic ? "مميز" : "Sponsorisé"}
          </span>
        )}

        {listing.isUrgent && (
          <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-md">
            {isArabic ? "عاجل" : "Urgent"}
          </span>
        )}

        <button className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-gray-900/80 rounded-full hover:bg-white dark:hover:bg-gray-900 transition-colors">
          <Heart className="w-4 h-4 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors" />
        </button>

        {imageCount > 1 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/50 text-white text-xs rounded-md">
            <ImageIcon className="w-3 h-3" />
            {imageCount}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            {listing.listingType === "VENTE" ? (isArabic ? "بيع" : "Vente") :
             listing.listingType === "LOCATION" ? (isArabic ? "إيجار" : "Location") :
             listing.listingType}
          </span>
          {listing.condition && (
            <span className="text-xs text-gray-400">{listing.condition}</span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {listing.title}
        </h3>

        {listing.price != null && (
          <p className="text-lg font-bold text-primary mb-2">
            {formatPrice(listing.price, listing.currency)}
          </p>
        )}

        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <MapPin className="w-3 h-3" />
          <span>{listing.city}</span>
          {listing.region && <span>· {listing.region}</span>}
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs text-gray-400">
            {formatRelativeDate(listing.createdAt, locale)}
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Eye className="w-3 h-3" />
            {listing.viewsCount}
          </div>
        </div>
      </div>
    </Link>
  )
}
