"use client"

import { useTranslations } from "next-intl"
import { Shield, Zap, Users, BadgeCheck, MessageCircle, CreditCard } from "lucide-react"

const features = [
  {
    icon: Shield,
    key: "secure",
  },
  {
    icon: Zap,
    key: "fast",
  },
  {
    icon: Users,
    key: "trusted",
  },
  {
    icon: BadgeCheck,
    key: "verified",
  },
  {
    icon: MessageCircle,
    key: "messaging",
  },
  {
    icon: CreditCard,
    key: "payment",
  },
]

interface Props {
  locale: string
}

export function WhyMarocMarket({ locale }: Props) {
  const t = useTranslations("marketplace")
  const isArabic = locale === "ar"

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t("whyMarocMarket.title")}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("whyMarocMarket.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, key }) => (
            <div
              key={key}
              className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 ${isArabic ? "ml-auto" : ""}`}>
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {t(`whyMarocMarket.${key}.title`)}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {t(`whyMarocMarket.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
