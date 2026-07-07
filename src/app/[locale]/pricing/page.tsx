import { generateSEOMetadata } from "@/lib/seo"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "pricing" })
  return generateSEOMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/pricing",
    keywords: ["url shortener pricing", "link management plans", "free url shortener", "branded domains pricing"],
    locale,
  })
}

export { default } from "./page.client"