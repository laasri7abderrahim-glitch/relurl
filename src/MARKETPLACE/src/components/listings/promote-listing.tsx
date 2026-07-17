"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Crown, Zap, AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  listingId: string
  locale: string
  isPromoted?: boolean
}

export function PromoteListing({ listingId, locale, isPromoted }: Props) {
  const t = useTranslations("marketplace")
  const isArabic = locale === "ar"
  const [showOptions, setShowOptions] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const promotions = [
    {
      type: "FEATURED",
      icon: Crown,
      nameFr: "Mise en avant",
      nameAr: "تمييز",
      descFr: "Apparaît en haut des résultats pendant 7 jours",
      descAr: "يظهر في أعلى النتائج لمدة 7 أيام",
      price: 49,
      days: 7,
    },
    {
      type: "BOOST",
      icon: Zap,
      nameFr: "Boost",
      nameAr: "تعزيز",
      descFr: "Renforce la visibilité pendant 3 jours",
      descAr: "يعزز الظهور لمدة 3 أيام",
      price: 29,
      days: 3,
    },
    {
      type: "URGENT",
      icon: AlertCircle,
      nameFr: "Urgent",
      nameAr: "عاجل",
      descFr: "Badge urgent + meilleure visibilité 5 jours",
      descAr: "شارة عاجل + ظهور أفضل لمدة 5 أيام",
      price: 19,
      days: 5,
    },
  ]

  const handlePromote = async (type: string, days: number) => {
    setIsProcessing(true)
    try {
      const res = await fetch("/api/marketplace/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "promote",
          listingId,
          promotionType: type,
          durationDays: days,
          userId: "current-user-id",
        }),
      })
      const data = await res.json()
      if (data.success && data.data.checkoutUrl) {
        window.location.href = data.data.checkoutUrl
      }
    } finally {
      setIsProcessing(false)
    }
  }

  if (isPromoted) {
    return (
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
        <CheckCircle className="w-4 h-4" />
        {isArabic ? "إعلان مميز" : "Annonce promue"}
      </div>
    )
  }

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowOptions(!showOptions)}
        className="gap-2"
      >
        <Crown className="w-4 h-4" />
        {isArabic ? "ترقية الإعلان" : "Promouvoir"}
      </Button>

      {showOptions && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg z-50 p-2">
          <p className="text-xs text-gray-500 px-3 py-2">
            {isArabic ? "اختر نوع الترقية" : "Choisir le type de promotion"}
          </p>
          {promotions.map((promo) => (
            <button
              key={promo.type}
              onClick={() => handlePromote(promo.type, promo.days)}
              disabled={isProcessing}
              className="w-full flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-left"
            >
              <promo.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {isArabic ? promo.nameAr : promo.nameFr}
                  </p>
                  <span className="text-sm font-bold text-primary">{promo.price} MAD</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {isArabic ? promo.descAr : promo.descFr}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}