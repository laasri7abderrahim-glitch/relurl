"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react"
import type { MarketplaceListingImage } from "@/MARKETPLACE/src/types"

interface Props {
  images: MarketplaceListingImage[]
  title: string
}

export function ListingGallery({ images, title }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
        <div className="text-center text-gray-400">
          <ImageIcon className="w-16 h-16 mx-auto mb-2" />
          <p>Aucune image</p>
        </div>
      </div>
    )
  }

  const prev = () => setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1))

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/9] bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden group">
        <img
          src={images[currentIndex].url}
          alt={images[currentIndex].alt || title}
          className="w-full h-full object-contain"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-900/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-900"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-900/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-900"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex
                      ? "bg-white w-4"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/50 text-white text-sm rounded-lg">
          {currentIndex + 1}/{images.length}
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setCurrentIndex(i)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                i === currentIndex
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <img
                src={img.url}
                alt={img.alt || `${title} ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
