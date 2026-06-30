import { getTranslations } from "next-intl/server"
import { generateSEOMetadata } from "@/lib/seo"

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'dashboard.links.edit' })
  return generateSEOMetadata({
    title: t('metatitle'),
    description: t('metadescription'),
    path: "/dashboard/links/edit",
    locale,
  })
}

export { default } from "./page.client"