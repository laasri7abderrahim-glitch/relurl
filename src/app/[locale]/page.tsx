import { generateSEOMetadata } from "@/lib/seo"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "seo" })
  return generateSEOMetadata({
    title: t("siteName"),
    description: t("siteDescription"),
    path: "",
    keywords: ["url shortener", "free link shortener", "custom short links", "qr code generator", "link analytics"],
    locale,
  })
}

export { default } from "./page.client"
