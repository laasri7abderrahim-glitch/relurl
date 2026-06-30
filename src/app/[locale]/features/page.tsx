import { generateSEOMetadata } from "@/lib/seo"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "features" })
  return generateSEOMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/features",
    locale,
  })
}

export { default } from "./page.client"