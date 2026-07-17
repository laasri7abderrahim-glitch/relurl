import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

interface Props {
  params: Promise<{ locale: string }>
}

export default async function MyListingsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "marketplace" })
  const isArabic = locale === "ar"

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {isArabic ? "إعلاناتي" : "Mes annonces"}
        </h1>
        <Link
          href="/marketplace/create"
          className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          {isArabic ? "إضافة إعلان" : "Nouvelle annonce"}
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-2">
          {isArabic ? "لا توجد إعلانات بعد" : "Vous n'avez pas encore d'annonces"}
        </p>
        <p className="text-sm text-gray-400 mb-6">
          {isArabic ? "أنشئ أول إعلان لك الآن" : "Créez votre première annonce dès maintenant"}
        </p>
        <Link
          href="/marketplace/create"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium"
        >
          <PlusCircle className="w-5 h-5" />
          {isArabic ? "إنشاء إعلان" : "Créer une annonce"}
        </Link>
      </div>
    </div>
  )
}
