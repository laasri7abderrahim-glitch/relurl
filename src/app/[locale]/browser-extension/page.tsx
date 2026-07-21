import { generateSEOMetadata } from "@/lib/seo"
import BrowserExtensionPage from "./page.client"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return generateSEOMetadata({
    title: "Browser Extension - Shorten URLs Instantly",
    description: "The RELURL browser extension for Chrome and Firefox. Shorten URLs, generate QR codes, and copy short links with one click.",
    path: "/browser-extension",
    keywords: ["relurl browser extension", "chrome extension url shortener", "firefox addon url shortener", "one click url shortener"],
    locale,
  })
}

export default function Page() {
  return <BrowserExtensionPage />
}
