import { getTranslations } from "next-intl/server"
import { StatCard } from "@/MARKETPLACE/src/components/dashboard/stat-card"
import { Eye, Heart, MessageCircle, TrendingUp } from "lucide-react"

interface Props {
  params: Promise<{ locale: string }>
}

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "marketplace" })
  const isArabic = locale === "ar"

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {isArabic ? "مرحباً بك في لوحة التحكم" : "Bienvenue sur votre tableau de bord"}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Eye}
          label={isArabic ? "إجمالي المشاهدات" : "Vues totales"}
          value="0"
          trend={isArabic ? "هذا الشهر" : "Ce mois"}
        />
        <StatCard
          icon={Heart}
          label={isArabic ? "المفضلة" : "Favoris"}
          value="0"
          trend={isArabic ? "هذا الشهر" : "Ce mois"}
        />
        <StatCard
          icon={MessageCircle}
          label={isArabic ? "الرسائل" : "Messages"}
          value="0"
          trend={isArabic ? "غير مقروء" : "Non lus"}
        />
        <StatCard
          icon={TrendingUp}
          label={isArabic ? "الإعلانات النشطة" : "Annonces actives"}
          value="0"
          trend={isArabic ? "هذا الشهر" : "Ce mois"}
        />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {isArabic ? "نشاطك الأخير" : "Votre activité récente"}
        </h2>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>{isArabic ? "لا يوجد نشاط بعد" : "Aucune activité récente"}</p>
          <p className="text-sm mt-1">
            {isArabic ? "أنشئ أول إعلان لك للبدء" : "Créez votre première annonce pour commencer"}
          </p>
        </div>
      </div>
    </div>
  )
}
