import { getTranslations } from "next-intl/server"
import { SubscriptionPlans } from "@/MARKETPLACE/src/components/subscriptions/subscription-plans"

interface Props {
  params: Promise<{ locale: string }>
}

export default async function SubscriptionsPage({ params }: Props) {
  const { locale } = await params
  const isArabic = locale === "ar"

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {isArabic ? "الاشتراك" : "Abonnement"}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        {isArabic
          ? "اختر الخطة المناسبة لاحتياجاتك"
          : "Choisissez le plan qui correspond à vos besoins"}
      </p>

      <SubscriptionPlans locale={locale} />

      <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {isArabic ? "الفوائد" : "Avantages"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>{isArabic ? "ظهور أعلى في نتائج البحث" : "Apparaissez plus haut dans les résultats"}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>{isArabic ? "شارة بائع موثوق" : "Badge vendeur vérifié"}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>{isArabic ? "تحليلات مفصلة" : "Statistiques détaillées"}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>{isArabic ? "دعم فني على مدار الساعة" : "Support client 24/7"}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>{isArabic ? "تعزيز الإعلانات" : "Boost de vos annonces"}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>{isArabic ? "إلغاء في أي وقت" : "Annulation à tout moment"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}