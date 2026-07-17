import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { MarketplaceHeader } from "@/MARKETPLACE/src/components/layout/header"
import { MarketplaceFooter } from "@/MARKETPLACE/src/components/layout/footer"

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "marketplace" })
  return {
    title: {
      default: t("meta.title"),
      template: `%s | ${t("meta.siteName")}`,
    },
    description: t("meta.description"),
    keywords: t("meta.keywords"),
    openGraph: {
      siteName: t("meta.siteName"),
      locale: locale === "ar" ? "ar_MA" : "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "/marketplace",
      languages: {
        fr: "/fr/marketplace",
        ar: "/ar/marketplace",
      },
    },
  }
}

export default async function MarketplaceLayout({ children, params }: Props) {
  const { locale } = await params
  const dir = locale === "ar" ? "rtl" : "ltr"

  return (
    <div dir={dir} className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <MarketplaceHeader locale={locale} />
      <main className="flex-1">{children}</main>
      <MarketplaceFooter locale={locale} />
    </div>
  )
}
