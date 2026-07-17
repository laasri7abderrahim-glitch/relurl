"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Check, Crown, Zap, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PLANS, type PlanType } from "@/MARKETPLACE/src/lib/stripe"

interface Props {
  currentPlan?: PlanType
  locale: string
}

export function SubscriptionPlans({ currentPlan = "FREE", locale }: Props) {
  const t = useTranslations("marketplace")
  const isArabic = locale === "ar"
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (plan: PlanType) => {
    if (plan === currentPlan) return
    setIsLoading(true)
    try {
      const res = await fetch("/api/marketplace/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "subscribe", plan, userId: "current-user-id" }),
      })
      const data = await res.json()
      if (data.success && data.data.checkoutUrl) {
        window.location.href = data.data.checkoutUrl
      }
    } finally {
      setIsLoading(false)
    }
  }

  const plans = [
    { key: "FREE" as PlanType, icon: Star, color: "gray" },
    { key: "PREMIUM" as PlanType, icon: Zap, color: "blue" },
    { key: "PRO" as PlanType, icon: Crown, color: "purple" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map(({ key, icon: Icon, color }) => {
        const plan = PLANS[key]
        const isCurrent = currentPlan === key
        return (
          <div
            key={key}
            className={`relative p-6 rounded-2xl border-2 transition-all ${
              isCurrent
                ? `border-${color}-500 bg-${color}-50 dark:bg-${color}-900/10`
                : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700"
            }`}
          >
            {key === "PRO" && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">
                {isArabic ? "الأكثر شعبية" : "Populaire"}
              </div>
            )}

            <div className="text-center mb-6">
              <Icon className={`w-10 h-10 mx-auto mb-3 text-${color}-500`} />
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {isArabic ? plan.nameAr : plan.name}
              </h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {plan.price}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">MAD/mois</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Check className="w-4 h-4 text-green-500" />
                {plan.listings === -1
                  ? (isArabic ? "إعلانات غير محدودة" : "Annonces illimitées")
                  : `${plan.listings} ${isArabic ? "إعلان" : "annonces"}`}
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Check className="w-4 h-4 text-green-500" />
                {plan.photosPerListing} {isArabic ? "صور لكل إعلان" : "photos par annonce"}
              </li>
              {plan.featured && (
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Check className="w-4 h-4 text-green-500" />
                  {isArabic ? "إعلان مميز" : "Annonce en vedette"}
                </li>
              )}
              {plan.boosted && (
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Check className="w-4 h-4 text-green-500" />
                  {isArabic ? "تعزيز الأداء" : "Boost de visibilité"}
                </li>
              )}
              {plan.analytics && (
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Check className="w-4 h-4 text-green-500" />
                  {isArabic ? "تحليلات متقدمة" : "Statistiques avancées"}
                </li>
              )}
              {plan.priority && (
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Check className="w-4 h-4 text-green-500" />
                  {isArabic ? "أولوية في الدعم" : "Support prioritaire"}
                </li>
              )}
            </ul>

            <Button
              onClick={() => handleSubscribe(key)}
              disabled={isCurrent || isLoading}
              variant={isCurrent ? "outline" : key === "PRO" ? "default" : "outline"}
              className="w-full"
            >
              {isCurrent
                ? (isArabic ? "الخطة الحالية" : "Plan actuel")
                : key === "FREE"
                  ? (isArabic ? "مجاني" : "Gratuit")
                  : (isArabic ? "اشترك الآن" : "S'abonner")}
            </Button>
          </div>
        )
      })}
    </div>
  )
}