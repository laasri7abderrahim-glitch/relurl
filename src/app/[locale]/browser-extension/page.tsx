import { generateSEOMetadata } from "@/lib/seo"
import { getTranslations } from "next-intl/server"
import BrowserExtensionPage from "./page.client"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "extension" })
  return generateSEOMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/browser-extension",
    keywords: ["relurl browser extension", "chrome extension url shortener", "firefox addon url shortener", "one click url shortener"],
    locale,
  })
}

export default function Page() {
  return <BrowserExtensionPage />
}
