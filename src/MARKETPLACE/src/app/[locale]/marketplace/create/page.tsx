import { getTranslations } from "next-intl/server"
import { CreateListingForm } from "@/MARKETPLACE/src/components/listings/create-listing-form"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isArabic = locale === "ar"
  return {
    title: isArabic ? "إنشاء إعلان جديد - MarocMarket" : "Créer une annonce - MarocMarket",
    description: isArabic
      ? "أنشئ إعلانك الجديد على MarocMarket بسهولة"
      : "Créez votre nouvelle annonce sur MarocMarket facilement",
  }
}

export default async function CreateListingPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "marketplace" })
  const isArabic = locale === "ar"

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {isArabic ? "إنشاء إعلان جديد" : "Créer une nouvelle annonce"}
      </h1>
      <CreateListingForm locale={locale} />
    </div>
  )
}
