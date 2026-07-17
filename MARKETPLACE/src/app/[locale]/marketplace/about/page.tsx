import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isArabic = locale === "ar"
  return {
    title: isArabic ? "من نحن - MarocMarket" : "À propos - MarocMarket",
    description: isArabic
      ? "تعرف على MarocMarket، أول سوق إلكتروني مغربي حديث"
      : "Découvrez MarocMarket, la première marketplace marocaine moderne",
  }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const isArabic = locale === "ar"

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {isArabic ? "من نحن" : "À propos de MarocMarket"}
      </h1>
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          {isArabic
            ? "MarocMarket هي أول سوق إلكتروني مغربي حديث، تم تصميمها لتوفير أفضل تجربة للبيع والشراء عبر الإنترنت في المغرب. نحن نربط بين البائعين والمشترين في جميع أنحاء المملكة."
            : "MarocMarket est la première marketplace marocaine moderne, conçue pour offrir la meilleure expérience d'achat et de vente en ligne au Maroc. Nous connectons acheteurs et vendeurs à travers tout le Royaume."}
        </p>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          {isArabic
            ? "نحن نؤمن بأن التجارة الإلكترونية يجب أن تكون بسيطة، آمنة، وفي متناول الجميع. منصتنا توفر مجموعة واسعة من الفئات: العقارات، السيارات، الإلكترونيات، الوظائف، الخدمات، وأكثر."
            : "Nous croyons que le commerce en ligne doit être simple, sécurisé et accessible à tous. Notre plateforme propose une large gamme de catégories : immobilier, automobile, high-tech, emploi, services, et plus."}
        </p>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {isArabic
            ? "انضم إلى آلاف المستخدمين الذين يثقون في MarocMarket للبيع والشراء عبر الإنترنت في المغرب."
            : "Rejoignez les milliers d'utilisateurs qui font confiance à MarocMarket pour acheter et vendre en ligne au Maroc."}
        </p>
      </div>
    </div>
  )
}
