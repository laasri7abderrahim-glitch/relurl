import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { HelpCircle, Shield, FileText, Lock } from "lucide-react"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isArabic = locale === "ar"
  return {
    title: isArabic ? "مساعدة - MarocMarket" : "Aide - MarocMarket",
  }
}

export default async function HelpPage({ params }: Props) {
  const { locale } = await params
  const isArabic = locale === "ar"

  const sections = [
    {
      icon: HelpCircle,
      title: isArabic ? "الأسئلة الشائعة" : "FAQ",
      desc: isArabic ? "إجابات على الأسئلة الأكثر شيوعاً" : "Réponses aux questions les plus fréquentes",
      link: "/marketplace/help/faq",
    },
    {
      icon: Shield,
      title: isArabic ? "نصائح الأمان" : "Conseils de sécurité",
      desc: isArabic ? "كيف تبقى آمناً عند البيع والشراء" : "Comment rester en sécurité lors de vos transactions",
      link: "/marketplace/help/safety",
    },
    {
      icon: FileText,
      title: isArabic ? "شروط الاستخدام" : "Conditions d'utilisation",
      desc: isArabic ? "اقرأ شروط وأحكام استخدام المنصة" : "Lisez les conditions générales d'utilisation",
      link: "/marketplace/help/terms",
    },
    {
      icon: Lock,
      title: isArabic ? "سياسة الخصوصية" : "Politique de confidentialité",
      desc: isArabic ? "كيف نحمي بياناتك الشخصية" : "Comment nous protégeons vos données personnelles",
      link: "/marketplace/help/privacy",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {isArabic ? "مركز المساعدة" : "Centre d'aide"}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map(({ icon: Icon, title, desc, link }) => (
          <Link
            key={link}
            href={link}
            className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-md hover:border-primary/30 transition-all group"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                {title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
